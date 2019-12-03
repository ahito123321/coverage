import initialStore from '../store/initialStore';

const canvasReducer = (canvas = initialStore.canvas, action) => {
    if (action.type === 'SET_CANVAS') {
        return {
            width: canvas.width,
            height: canvas.height
        }
    } else {
        return canvas;
    }
};

export default canvasReducer;