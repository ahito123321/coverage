import initialStore from '../store/initialStore';

const settingsReducer = (settings = initialStore.settings, action) => {
    if (action.type === 'CHECK_ADAPTIVE') {
        return {
            ...settings,
            isAdaptiveCanvas: true
        };
    } else if (action.type === 'UNCHECK_ADAPTIVE') {
        return {
            ...settings,
            isAdaptiveCanvas: false
        };
    } else if (action.type === 'CHECK_MULTI_CANVASES') {
        return {
            ...settings,
            isMultiCanvases: true
        };
    } else if (action.type === 'UNCHECK_MULTI_CANVASES') {
        return {
            ...settings,
            isMultiCanvases: false
        };
    } else {
        return settings;
    }
};

export default settingsReducer;