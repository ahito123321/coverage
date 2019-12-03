import initialStore from '../store/initialStore';

const detailReducer = (details = initialStore.details, action) => {
    if (action.type === 'ADD_DETAIL') {
        let id = details.length + 1;
        return [
            ...details, {
                id,
                ...action.payload
            }
        ];
    } else if (action.type === 'REMOVE_DETAIL') {
        return details
            .filter(detail => detail.id !== action.payload.id)
            .map((detail, index) => {
                return {
                    ...detail,
                    id: index + 1
                };
            });
    } else {
        return details;
    }
};

export default detailReducer;