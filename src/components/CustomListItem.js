import React from 'react';
//material UI
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles  = {
    listItem: {
        width: '100%'
    }
};

class CustomListItem extends React.Component {

    constructor(props, context) {
        super(props);
    }

    onClickRemoveHandler = id => event => {
        this.props.dispatch({
            type: 'REMOVE_DETAIL',
            payload: {
                id
            }
        });
    };

    render() {
        const { classes, item } = this.props;
        
        return (
            <ListItem className={classes.listItem}>
                <ListItemText
                    primary={`Деталь ${item.id} x ${item.amount}`}
                    secondary={`ширина: ${item.width}, высота: ${item.height}`}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={this.onClickRemoveHandler(item.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withStyles(styles)(CustomListItem);