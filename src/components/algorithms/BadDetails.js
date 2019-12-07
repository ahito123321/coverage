import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles  = {
    root: {
        width: '100%',
        maxWidth: 360,
    },
    nested: {
        paddingLeft: 20,
    },
};

class BadDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenBadDetailList: false
        }
    }

    handleClickOnBadDetail = () => {
        this.setState({
            ...this.state,
            isOpenBadDetailList: !this.state.isOpenBadDetailList
        });
    };

    render() {
        const { isOpenBadDetailList } = this.state;
        const { badDetails, classes } = this.props;

        return (
            <div>
                <ListItem button onClick={this.handleClickOnBadDetail}>
                    <ListItemIcon>
                    <   InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={`Список неподходящих деталей (${badDetails.length})`} />
                    {isOpenBadDetailList ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={isOpenBadDetailList} timeout="auto" unmountOnExit>
                    {badDetails.length === 0 && 
                        <List component="div" disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary="Не подходящие детали отсутствуют" />
                            </ListItem>
                        </List>}
                    {badDetails.map((detail, index) => {
                        return (
                            <List component="div" disablePadding key={index}>
                                <ListItem button className={classes.nested}>
                                    <ListItemText primary={`${detail.id}`} secondary={`ширина: ${detail.width}, высота: ${detail.height}`} />
                                </ListItem>
                            </List>
                        );
                    })}
                </Collapse>
            </div>
        );
    }
}

export default withStyles(styles)(BadDetails);