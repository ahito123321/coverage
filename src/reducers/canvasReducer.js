import initialStore from '../store/initialStore';

const canvasReducer = (canvas = initialStore.canvas, action) => {
    if (action.type === 'SET_CANVAS') {
        return {
            width: action.payload.width,
            height: action.payload.height
        }
    } else {
        return canvas;
    }
};

export default canvasReducer;