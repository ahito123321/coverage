import initialStore from '../store/initialStore';

const algorithmReducer = (algorithm = initialStore.algorithm, action) => {
    if (action.type === 'FIRST_SUITABLE') {
        return 'FIRST_SUITABLE';
    } else {
        return algorithm;
    }
};

export default algorithmReducer;