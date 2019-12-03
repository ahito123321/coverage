import React from 'react';
import { connect } from 'react-redux';
//material UI
import { withStyles } from '@material-ui/core/styles';
//custom 
import Canvas from './Canvas';

import { withSnackbar } from 'notistack';

const styles  = {
    listItem: {
        width: '100%'
    }
};

class FirstSuitable extends React.Component {

    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            canvasStyles: {
                width: this.props.canvas.width,
                height: this.props.canvas.height
            },
            details: [],
            badDetails: [],
            canvases: [],
            factor: 1,
        };
    }

    componentDidMount() {
        let canvasWidth = this.container.current.clientWidth;
        let factor = canvasWidth / +this.props.canvas.width;
        let canvasHeight = factor * this.props.canvas.height;

        let detailedParts = [];
        this.props.details.forEach((detail) => {
            for (let index = 0; index < +detail.amount; index++) {
                detailedParts.push({
                    width: Math.round(+detail.width * factor),
                    height: Math.round(+detail.height * factor)
                });
            }
        });
        
        this.setState({
            ...this.state,
            canvas: {
                width: canvasWidth,
                height: canvasHeight
            },
            canvasStyles: {
                width: Math.round(this.state.canvasStyles.width * factor),
                height: Math.round(this.state.canvasStyles.height * factor)
            },
            details: detailedParts,
            factor
        }, this.startAlgorithm);
    }

    startAlgorithm = () => {
        let startTime = Date.now();

        const { canvasStyles, details, factor } = this.state;
        let badDetails = [];
        let topLeftCorner = {
            x: 0,
            y: canvasStyles.height
        };
        let bottomRightCorner = {
            x: 0,
            y: canvasStyles.height
        }; 

        let canvases = [{
            details: [],
            width: canvasStyles.width,
            height: canvasStyles.height,
            currentBottomRightCorner: bottomRightCorner,
            currentTopLeftCorner: topLeftCorner
        }];

        let currentCanvas = 0;
        let isNeedToInit = true;

        details.forEach((detail, index) => {
            do {
                if (this.isSuitableForWidth(canvases[currentCanvas].currentBottomRightCorner, detail, canvases[currentCanvas])) {
                    canvases[currentCanvas].currentBottomRightCorner = {
                        x: canvases[currentCanvas].currentBottomRightCorner.x + detail.width,
                        y: canvases[currentCanvas].currentBottomRightCorner.y
                    };

                    if (isNeedToInit) {
                        canvases[currentCanvas].currentTopLeftCorner = {
                            x: canvases[currentCanvas].currentBottomRightCorner.x - detail.width,
                            y: canvases[currentCanvas].currentBottomRightCorner.y - detail.height
                        };
                        isNeedToInit = false;
                    }
                    canvases[currentCanvas].details.push({
                        point1: {
                            x: canvases[currentCanvas].currentBottomRightCorner.x - detail.width,
                            y: canvases[currentCanvas].currentBottomRightCorner.y - detail.height
                        },
                        point2: {
                            x: canvases[currentCanvas].currentBottomRightCorner.x,
                            y: canvases[currentCanvas].currentBottomRightCorner.y
                        }
                    });
                    break;
                } else if (this.isSuitableForHeight(canvases[currentCanvas].currentTopLeftCorner, detail)) {

                    canvases[currentCanvas].currentBottomRightCorner = {
                        x: canvases[currentCanvas].currentTopLeftCorner.x + detail.width,
                        y: canvases[currentCanvas].currentTopLeftCorner.y
                    };
                    canvases[currentCanvas].currentTopLeftCorner = {
                        x: canvases[currentCanvas].currentTopLeftCorner.x,
                        y: canvases[currentCanvas].currentTopLeftCorner.y - detail.height
                    };
                    
                    canvases[currentCanvas].details.push({
                        point1: {
                            x: canvases[currentCanvas].currentBottomRightCorner.x - detail.width,
                            y: canvases[currentCanvas].currentBottomRightCorner.y - detail.height
                        },
                        point2: {
                            x: canvases[currentCanvas].currentBottomRightCorner.x,
                            y: canvases[currentCanvas].currentBottomRightCorner.y
                        }
                    });
                    break;
                }
                if (!this.isSuitableForHeight(canvases[currentCanvas].currentTopLeftCorner, detail) ||
                    !this.isSuitableForWidth(canvases[currentCanvas].currentTopLeftCorner, detail, canvases[currentCanvas])) {
                    canvases.push({
                        details: [],
                        width: canvasStyles.width,
                        height: canvasStyles.height,
                        currentBottomRightCorner: bottomRightCorner,
                        currentTopLeftCorner: topLeftCorner
                    });
                    isNeedToInit = true;
                    currentCanvas++;

                    if (canvases[currentCanvas - 1].details.length === 0) {
                        badDetails.push({
                            width: Math.round(detail.width / factor),
                            height: Math.round(detail.height / factor)
                        });
                        currentCanvas--;
                        return;
                    }
                    continue;
                }
            } while (true);
        });
        let endTime = Date.now();
        
        this.setState({
            ...this.state,
            canvases: canvases
        }, () => {
            this.props.dispatch({
                type: 'CLOSE_SPINNER'
            });
            this.props.enqueueSnackbar(`Время выполнения ${endTime - startTime} мс`, {
                variant: 'success'
            });
        });
    };

    isSuitableForWidth = (bottomRightCorner, detail, canvas) => bottomRightCorner.x + detail.width <= canvas.width;

    isSuitableForHeight = (topLeftCorner, detail) => topLeftCorner.y - detail.height >= 0;

    render() {
        const { canvases } = this.state;

        return (
            <>
                <div ref={this.container}>
                    {canvases.map((canvas, index) => {
                        return (
                            <Canvas canvasInfo={canvas} key={index} />
                        );
                    })}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        canvas: state.canvas,
        details: state.details
    }
};

export default withStyles(styles)(connect(mapStateToProps)(withSnackbar(FirstSuitable)));