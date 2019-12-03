const initialStore = {
    details: [{
        id: '1',
        width: '200',
        height: '100',
        amount: '3'
    }],
    modalStates: {
        addDetail: false
    },
    spinner: false,
    algorithm: '',
    canvas: {
        width: '500',
        height: '600'
    }
};

export default initialStore;