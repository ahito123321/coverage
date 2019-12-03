import React from 'react';
import { connect } from 'react-redux';
//material ui
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
//spinners
import PulseLoader from 'react-spinners/PulseLoader';

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh'
    }
}));

function Spinner(props) {
    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={props.spinner}
        >
            <div className={classes.paper}>
                <PulseLoader className={classes.spinner} color="#350091" />
            </div>
        </Modal>
    );
}

const mapStateToProps = state => {
    return {
        spinner: state.spinners
    }
};

export default connect(mapStateToProps)(Spinner)