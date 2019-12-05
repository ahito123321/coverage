import initialStore from '../store/initialStore';

const algorithmReducer = (algorithm = initialStore.algorithm, action) => {
    if (action.type === 'CLEAR_ALGORITHM') {
        return '';
    } else if (action.type === 'FIRST_SUITABLE') {
        return 'FIRST_SUITABLE';
    } else if (action.type === 'FIRST_SUITABLE_WITH_ORDERING') {
        return 'FIRST_SUITABLE_WITH_ORDERING';
    } else {
        return algorithm;
    }
};

export default algorithmReducer;