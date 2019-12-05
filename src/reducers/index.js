import detailReducer from './detailReducer';
import modalReducer from './modalReducer';
import spinnerReducer from './spinnerReducer';
import algorithmReducer from './algorithmReducer';
import canvasReducer from './canvasReducer';
import settingsReducer from './settingsReducer';

export default {
    details: detailReducer,
    modalStates: modalReducer,
    spinners: spinnerReducer,
    algorithm: algorithmReducer,
    canvas: canvasReducer,
    settings: settingsReducer
};