import React from 'react';
import { connect } from 'react-redux';
// material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
//custom
import CustomListItem from '../components/CustomListItem';
import AddDetail from '../components/AddDetail';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    }
}));

function DetailContainer(props) {
    const classes = useStyles();
    const { details } = props;

    return (
        <Paper className={classes.paper}>
            <Typography align="center">
                Список деталей
            </Typography>
            <List dense={true} className={classes.listContainer}>
                {details.map((detail, index) => {  
                    return (
                        <CustomListItem 
                            item={detail} 
                            key={index} 
                            dispatch={props.dispatch} 
                            type="DETAIL"
                        />
                    );
                })}
                {details.length === 0 &&
                    <Typography align="center" variant="caption" component="p">
                        Список пуст
                    </Typography>
                }         
            </List>
            <Button
                variant="contained"
                color="default"
                size="small"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => {
                    props.dispatch({
                        type: 'OPEN_ADD_DETAIL_MODAL'
                    });
                }}
            >
                Добавить
            </Button>
            <AddDetail />
        </Paper>
    );
};

const mapStateToProps = state => {
    return {
        details: state.details
    }
};

export default connect(mapStateToProps)(DetailContainer);