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
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withSnackbar } from 'notistack';

const styles = {
    button: {
        marginTop: 15
    },
    formControl: {
        marginTop: 15,
        width: '100%'
    },
    formControlLabel: {
        justifyContent: 'center'
    },
    colorWhite: {
        color: '#ffffff'
    }
};

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            width: this.props.canvas.width,
            height: this.props.canvas.height,
            settings: this.props.settings
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

    onChangeSettings = field => event => {
        this.setState({
            ...this.state,
            settings: {
                ...this.state.settings,
                [field]: event.target.checked
            }
        }, () => {
            if (field === 'isAdaptiveCanvas') {
                this.props.dispatch({ 
                    type: this.state.settings.isAdaptiveCanvas ? 'CHECK_ADAPTIVE' : 'UNCHECK_ADAPTIVE',
                });
            } else if (field === 'isMultiCanvases') {
                this.props.dispatch({ 
                    type: this.state.settings.isMultiCanvases ? 'CHECK_MULTI_CANVASES' : 'UNCHECK_MULTI_CANVASES',
                });
            }                        
        });
    };

    isValidation = () => {
        if (this.props.details.length === 0) {
            this.props.enqueueSnackbar('Отсутствуют детали!', {
                variant: 'error',
                autoHideDuration: 3000,
                action: this.action
            });
            return false;
        }
        return true;
    };

    algorithmFirstSuitable = () => {
        if (!this.isValidation()) return;
        if (this.props.algorithm !== '') {
            this.props.enqueueSnackbar('Очистите плотно!', {
                variant: 'info',
                autoHideDuration: 3000,
                action: this.action
            });
            return;
        }  
        this.props.dispatch({ type: 'SHOW_SPINNER' });
        this.props.dispatch({ type: 'FIRST_SUITABLE' });
    };

    algorithmFirstSuitableWithOrdering = () => {
        if (!this.isValidation()) return;
        if (this.props.algorithm !== '') {
            this.props.enqueueSnackbar('Очистите плотно!', {
                variant: 'info',
                autoHideDuration: 3000,
                action: this.action
            });
            return;
        }  
        this.props.dispatch({ type: 'SHOW_SPINNER' });
        this.props.dispatch({ type: 'FIRST_SUITABLE_WITH_ORDERING' });
    };

    algorithmClear = () => {
        if (this.props.algorithm === '') {
            this.props.enqueueSnackbar('Полотно уже очищено!', {
                variant: 'warning',
                autoHideDuration: 3000,
                action: this.action
            });
            return;
        }  
        this.props.dispatch({ type: 'CLEAR_ALGORITHM' });
        this.props.enqueueSnackbar('Полотно очищено!', {
            variant: 'info',
            autoHideDuration: 3000,
            action: this.action
        });
    };

    action = key => (
        <>
            <Button className={this.props.classes.colorWhite} onClick={() => { this.props.closeSnackbar(key) }}>
                ОК
            </Button>
        </>
    );

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
                <FormControl className={classes.formControl}>
                    <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                            <Switch
                                checked={this.state.settings.isAdaptiveCanvas}
                                onChange={this.onChangeSettings('isAdaptiveCanvas')}
                                color="primary"
                                inputProps={{ 'aria-label': 'is adaptive checkbox' }}
                            /> 
                        }
                        label="Использовать адаптацию полотна?"
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                            <Switch
                                checked={this.state.settings.isMultiCanvases}
                                onChange={this.onChangeSettings('isMultiCanvases')}
                                color="primary"
                                inputProps={{ 'aria-label': 'is multi canvas checkbox' }}
                            /> 
                        }
                        label="Использовать много полотен?"
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
                    onClick={this.algorithmFirstSuitableWithOrdering}
                    className={classes.button}
                    fullWidth
                    startIcon={<PictureInPictureAlt />}
                >
                    Первый подходящий с упорядочиванием
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
        algorithm: state.algorithm,
        settings: state.settings
    }
};

export default withStyles(styles)(connect(mapStateToProps)(withSnackbar(Canvas)));