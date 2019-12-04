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
import LayersClearIcon from '@material-ui/icons/LayersClear';

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
        }, () => {
            this.props.dispatch({ 
                type: 'SET_CANVAS',
                payload: {
                    width: this.state.width,
                    height: this.state.height
                }
            });
        });
    };

    isValidation = () => {
        if (this.props.details.length === 0) {
            this.props.enqueueSnackbar('Отсутствуют детали!', {
                variant: 'error'
            });
            return false;
        }
        return true;
    };

    algorithmFirstSuitable = () => {
        if (!this.isValidation()) return;
        if (this.props.algorithm !== '') {
            this.props.enqueueSnackbar('Очистите плотно!', {
                variant: 'info'
            });
            return;
        }  
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

    algorithmClear = () => {
        if (this.props.algorithm === '') {
            this.props.enqueueSnackbar('Полотно уже очищено!', {
                variant: 'warning'
            });
            return;
        }  
        this.props.dispatch({ type: 'CLEAR_ALGORITHM' });
        this.props.enqueueSnackbar('Полотно очищено!', {
            variant: 'info'
        });
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
                <Button
                    variant="contained"
                    color="default"
                    onClick={this.algorithmClear}
                    className={classes.button}
                    fullWidth
                    startIcon={<LayersClearIcon />}
                >
                    Очистить полотно
                </Button>
            </>
        );
    }
};

const mapStateToProps = state => {
    return {
        details: state.details,
        canvas: state.canvas,
        algorithm: state.algorithm
    }
};

export default withStyles(styles)(connect(mapStateToProps)(withSnackbar(Canvas)));