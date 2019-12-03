const initialStore = {
    details: [{
        id: '1',
        width: '200',
        height: '200',
        amount: '10'
    }],
    modalStates: {
        addDetail: false
    },
    spinner: false,
    algorithm: '',
    canvas: {
        width: '500',
        height: '500'
    }
};

export default initialStore;