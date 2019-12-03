import React from 'react';
// material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
//custom
import Canvas from '../components/Canvas';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    }
}));

function CanvasContainer(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography align="center">
                Данные о полотне
            </Typography>
            <Canvas />
        </Paper>
    );
};

export default (CanvasContainer);