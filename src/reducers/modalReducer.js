import initialStore from '../store/initialStore';

const modalReducer = (state = initialStore.modalStates, action) => {
    if (action.type === 'OPEN_ADD_DETAIL_MODAL') {
        return {
            ...state,
            addDetail: true
        };
    } else if (action.type === 'CLOSE_ADD_DETAIL_MODAL') {
        return {
            ...state,
            addDetail: false
        };
    } else {
        return state;
    }
};

export default modalReducer;