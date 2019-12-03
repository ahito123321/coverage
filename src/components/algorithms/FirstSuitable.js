import React from 'react';
import { connect } from 'react-redux';
//material UI
import { withStyles } from '@material-ui/core/styles';

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
                width: this.state.canvasStyles.width * factor,
                height: this.state.canvasStyles.height * factor
            },
            details: detailedParts,
            factor
        }, this.startAlgorithm);
    }

    startAlgorithm = () => {
        const { canvasStyles, details, factor } = this.state;
        let badDetails = [];
        let topLeftCorner = {
            x: canvasStyles.width,
            y: 0
        };
        let bottomRightCorner = {
            x: 0,
            y: canvasStyles.height
        }; 

        let canvases = [{
            details: [],
            width: canvasStyles.width,
            height: canvasStyles.height
        }];
        let currentCanvas = 0;

        details.forEach(detail => {
            console.log('detail start');
            let lastCanvasIndex = canvases.length - 1 < 0 ? 0 : canvases.length - 1;
            do {
                console.log('while do');
                if (this.isSuitableForWidth(bottomRightCorner, detail, canvases[currentCanvas])) {
                    console.log('isSuitableForWidth');
                    canvases[currentCanvas].details.push({
                        point1: {
                            x: bottomRightCorner.x,
                            y: bottomRightCorner.y
                        },
                        point2: {
                            x: bottomRightCorner.x + detail.width,
                            y: bottomRightCorner.y - detail.height
                        }
                    });
                    bottomRightCorner = {
                        x: bottomRightCorner.x + detail.width,
                        y: bottomRightCorner.y
                    };
                    topLeftCorner = {
                        x: bottomRightCorner.x - detail.width,
                        y: bottomRightCorner.y - detail.height
                    };
                    break;
                } else if (this.isSuitableForHeight(topLeftCorner, detail, canvases[currentCanvas])) {
                    console.log('isSuitableForWidth');
                    canvases[currentCanvas].details.push({
                        point1: {
                            x: topLeftCorner.x,
                            y: topLeftCorner.y
                        },
                        point2: {
                            x: topLeftCorner.x + detail.width,
                            y: topLeftCorner.y - detail.height
                        }
                    });
                    bottomRightCorner = {
                        x: bottomRightCorner.x + detail.width,
                        y: bottomRightCorner.y
                    };
                    topLeftCorner = {
                        x: bottomRightCorner.x - detail.width,
                        y: bottomRightCorner.y - detail.height
                    };
                    break;
                }
                if (canvases[lastCanvasIndex].details.length !== 0) {
                    console.log('bed');
                    topLeftCorner = {
                        x: canvasStyles.width,
                        y: canvasStyles.height
                    };
                    bottomRightCorner = {
                        x: canvasStyles.width,
                        y: canvasStyles.height
                    };
                    currentCanvas++;
                } else {
                    console.log('add bad details');
                    badDetails.push({
                        width: Math.round(detail.width * factor),
                        height: Math.round(detail.height * factor)
                    });
                    break;
                }
            } while (true)
        });
        console.log('end');
        console.log(details);
        console.log(this.state.factor);
        console.log(this.state.badDetails);
        console.log(canvases);
    };

    isSuitableForWidth = (bottomRightCorner, detail, canvas) => {
        return !(bottomRightCorner.x + detail.width > canvas.width);

    };

    isSuitableForHeight = (topLeftCorner, detail) => {
        return !(topLeftCorner.y - detail.height < 0);
    };

    resetPoints = () => {

    };

    render() {
        return (
            <>
                <div ref={this.container}>

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

export default withStyles(styles)(connect(mapStateToProps)(FirstSuitable));