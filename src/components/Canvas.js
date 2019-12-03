import React, { Component } from 'react';
import { connect } from 'react-redux';
// material UI
import { withStyles } from '@material-ui/core/styles';
import PictureInPictureAlt from '@material-ui/icons/PictureInPictureAlt';
import Button from '@material-ui/core/Button';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';

import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';

import { withSnackbar } from 'notistack';

const styles = {
    button: {
        marginTop: 15
    },
    formControl: {
        marginTop: 15
    }
};

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            width: this.props.canvas.width,
            height: this.props.canvas.height
        };
    }

    onChange = field => event => {
        this.setState({
            ...this.state,
            [field]: event.target.value
        });
    };

    isValidation = () => {
        if (this.props.details.length === 0) {
            this.props.enqueueSnackbar('Отсутствуют детали!', {
                variant: 'error'
            });
            return false;
        }
        this.props.dispatch({ type: 'SHOW_SPINNER' });
        return true;
    };

    algorithmFirstSuitable = () => {
        if (!this.isValidation()) return;
        const { width, height } = this.state;
        this.props.dispatch({ 
            type: 'SHOW_SPINNER',
            payload: {
                width,
                height
            }
        });
        this.props.dispatch({ type: 'FIRST_SUITABLE' });
    };

    render() {
        const { classes } = this.props;

        return (
            <>
                <FormControl 
                    fullWidth 
                    variant="outlined"
                    className={classes.formControl}
                >
                    <InputLabel htmlFor="add-item-width">Ширина</InputLabel>
                    <OutlinedInput
                        id="add-item-width"
                        value={this.state.width}
                        onChange={this.onChange('width')}
                        endAdornment={<InputAdornment position="end">мм</InputAdornment>}
                        labelWidth={60}
                    />
                </FormControl>
                <FormControl 
                    fullWidth 
                    variant="outlined"
                    className={classes.formControl}
                >
                    <InputLabel htmlFor="add-item-height">Высота</InputLabel>
                    <OutlinedInput
                        id="add-item-height"
                        value={this.state.height}
                        onChange={this.onChange('height')}
                        endAdornment={<InputAdornment position="end">мм</InputAdornment>}
                        labelWidth={60}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    color="default"
                    onClick={this.algorithmFirstSuitable}
                    className={classes.button}
                    fullWidth
                    startIcon={<PictureInPictureAlt />}
                >
                    Первый подходящий
                </Button>
            </>
        );
    }
};

const mapStateToProps = state => {
    return {
        details: state.details,
        canvas: state.canvas
    }
};

export default withStyles(styles)(connect(mapStateToProps)(withSnackbar(Canvas)));