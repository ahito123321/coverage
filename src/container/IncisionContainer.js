import React from 'react';
import { connect } from 'react-redux';
// material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FirstSuitable from '../components/algorithms/FirstSuitable';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    }
}));

function IncisionContainer(props) {
    const classes = useStyles();
    const { algorithm } = props;
    console.log(algorithm);
    return (
        <Paper className={classes.paper}>
            {algorithm === '' && 
                <Typography variant="caption" align="center">
                    Не подсчитано!
                </Typography>
            }
            {algorithm === 'FIRST_SUITABLE' && <FirstSuitable />}
        </Paper>
    );
};

const mapStateToProps = state => {
    return {
        algorithm: state.algorithm
    }
};

export default connect(mapStateToProps)(IncisionContainer);