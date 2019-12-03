import initialStore from '../store/initialStore';

const spinnerReducer = (spinner = initialStore.spinner, action) => {
    if (action.type === 'SHOW_SPINNER') {
        return true;
    } else if (action.type === 'CLOSE_SPINNER') {
        return false;
    } else {
        return spinner;
    }
};

export default spinnerReducer;