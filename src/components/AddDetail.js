import React from 'react';
import { connect } from 'react-redux';
//material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';

class AddDetail extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = {
            width: '',
            height: '',
            amount: ''
        };
    }

    onChange = field => event => {
        this.setState({
            ...this.state,
            [field]: event.target.value
        });
    };

    getDefaultState = () => {
        return {
            width: '',
            height: '',
            amount: ''
        }
    };

    onClickAddItemHandler = () => {
        this.props.dispatch({
            type: 'ADD_DETAIL',
            payload: { ...this.state }
        });
        this.setState(this.getDefaultState(), this.onClickCloseModalHandler);
    };

    onClickCloseModalHandler = () => {
        this.props.dispatch({
            type: 'CLOSE_ADD_DETAIL_MODAL'
        });
    };

    render() {
        const { addDetail } = this.props.modalStates;
        const values = {
            width: this.state.width,
            height: this.state.height,
            amount: this.state.amount
        };

        return (
            <Dialog 
                open={addDetail} 
                aria-labelledby="add-item-form-dialog-title"
                onClose={this.onClickCloseModalHandler}
            >
                <DialogTitle id="add-item-form-dialog-title">Добавление детали</DialogTitle>
                <DialogContent>
                    <DialogContentText align="center">
                        Данные о детали
                    </DialogContentText>
                    <FormControl fullWidth>
                        <Input
                            id="add-item-width"
                            value={values.width}
                            onChange={this.onChange('width')}
                            endAdornment={<InputAdornment position="end">мм</InputAdornment>}
                            aria-describedby="add-item-width-helper-text"
                            inputProps={{
                                'aria-label': 'width',
                            }}
                        />
                        <FormHelperText id="standard-width-helper-text">Ширина</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <Input
                            id="add-item-height"
                            value={values.height}
                            onChange={this.onChange('height')}
                            endAdornment={<InputAdornment position="end">мм</InputAdornment>}
                            aria-describedby="add-item-height-helper-text"
                            inputProps={{
                                'aria-label': 'height',
                            }}
                        />
                        <FormHelperText id="standard-height-helper-text">Высота</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <Input
                            id="add-item-amount"
                            value={values.amount}
                            onChange={this.onChange('amount')}
                            endAdornment={<InputAdornment position="end">шт</InputAdornment>}
                            aria-describedby="add-item-amount-helper-text"
                            inputProps={{
                                'aria-label': 'amount',
                            }}
                        />
                        <FormHelperText id="standard-amount-helper-text">Количество</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button 
                        color="primary"
                        onClick={this.onClickCloseModalHandler}
                    >
                        Отмена
                    </Button>
                    <Button 
                        color="primary"
                        onClick={this.onClickAddItemHandler}
                    >
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        modalStates: state.modalStates
    }
};

export default connect(mapStateToProps)(AddDetail);