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
        let factor = Math.round(canvasWidth / +this.props.canvas.width);
        let canvasHeight = factor * this.props.canvas.height;

        let detailedParts = [];
        this.props.details.forEach((detail) => {
            for (let index = 0; index < +detail.amount; index++) {
                detailedParts.push({
                    id: index,
                    width: Math.floor(+detail.width * factor),
                    height: Math.floor(+detail.height * factor)
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
                width: Math.ceil(this.state.canvasStyles.width * factor),
                height: Math.ceil(this.state.canvasStyles.height * factor)
            },
            details: detailedParts,
            factor
        }, this.startAlgorithm);
    }

    startAlgorithm = () => {
        let startTime = Date.now();

        const { canvasStyles, details, factor } = this.state;
        let badDetails = [];

        let canvases = [{
            details: [],
            verifiableDetailsOnWidth: [],
            verifiableDetailsOnHeight: [],
            width: canvasStyles.width,
            height: canvasStyles.height
        }];

        let currentCanvasIndex = 0;

        details.forEach((detail, index) => {
            console.log('[INFO] Деталь ' + (index + 1));
            console.log('canvases');
            console.log(canvases);
            let currentCanvas = canvases[currentCanvasIndex];

            if (detail.width > currentCanvas.width || detail.height > currentCanvas.height) {
                console.log('[INFO] Bed Detail ');
                badDetails.push({
                    width: Math.ceil(detail.width / factor),
                    height: Math.ceil(detail.height / factor)
                });
            }

            if (index === 0) {
                console.log('[INFO] index 0 ');
                let tempDetail = {
                    points: {
                        bottomRight: this.getBottomRightPointBySizeAndBottomLeftPoint({
                            x: 0,
                            y: currentCanvas.height
                        }, detail),
                        topLeft: this.getTopLeftPointBySizeAndBottomLeftPoint({
                            x: 0,
                            y: currentCanvas.height
                        }, detail)
                    }
                };
                currentCanvas.verifiableDetailsOnWidth.push(tempDetail);
                currentCanvas.verifiableDetailsOnHeight.push(tempDetail);
                currentCanvas.details.push(tempDetail);
                return;
            }

            let suitableDetailsForWidth = this.getSuitableDetailsForWidth(currentCanvas.details,
                    currentCanvas.verifiableDetailsOnWidth,
                    detail,
                    currentCanvas);
            let suitableDetailsForHeight = this.getSuitableDetailsForHeight(currentCanvas.details,
                    currentCanvas.verifiableDetailsOnHeight,
                    detail,
                    currentCanvas);
            console.log('[INFO] suitableDetailsForWidth ' + suitableDetailsForWidth.length);
            console.log('[INFO] suitableDetailsForHeight ' + suitableDetailsForHeight.length);

            if (suitableDetailsForWidth.length !== 0) {
                console.log('[INFO] Width ok! ');
                let currentDetail = {
                    points: {
                        bottomRight: this.getBottomRightPointBySizeAndBottomLeftPoint(suitableDetailsForWidth[0].points.bottomRight, detail),
                        topLeft: this.getTopLeftPointBySizeAndBottomLeftPoint(suitableDetailsForWidth[0].points.bottomRight, detail)
                    }
                };
                let detailIdToDelete = suitableDetailsForWidth[0].id;

                let detailIndexToDelete = currentCanvas.verifiableDetailsOnWidth.findIndex(detail => detail.id === detailIdToDelete);
                currentCanvas.verifiableDetailsOnWidth.splice(detailIndexToDelete, 1);

                currentCanvas.verifiableDetailsOnWidth.push(currentDetail);
                currentCanvas.verifiableDetailsOnHeight.push(currentDetail);
                currentCanvas.details.push(currentDetail);
            } else if (suitableDetailsForHeight.length !== 0) {
                console.log('[INFO] Height ok! ');
                let currentDetail = {
                    points: {
                        bottomRight: this.getBottomRightPointBySizeAndBottomLeftPoint(suitableDetailsForHeight[0].points.topLeft, detail),
                        topLeft: this.getTopLeftPointBySizeAndBottomLeftPoint(suitableDetailsForHeight[0].points.topLeft, detail)
                    }
                };
                let detailIdToDelete = suitableDetailsForHeight[0].id;

                let detailIndexToDelete = currentCanvas.verifiableDetailsOnHeight.findIndex(detail => detail.id === detailIdToDelete);
                currentCanvas.verifiableDetailsOnHeight.splice(detailIndexToDelete, 1);

                currentCanvas.verifiableDetailsOnWidth.push(currentDetail);
                currentCanvas.verifiableDetailsOnHeight.push(currentDetail);
                currentCanvas.details.push(currentDetail);
            }
            console.log('[INFO] iter end');
            console.log(currentCanvas);
        });
        let endTime = Date.now();

        console.log('[INFO] END');
        console.log(canvases);
        console.log(badDetails);
        
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

    getSuitableDetailsForWidth = (details, verifiableDetailsOnWidth, sizes, canvas) => {
        console.log('[INFO] getSuitableDetailsForWidth');
        console.log({...canvas});
        let supportDetails = [];

        let sortedDetails = verifiableDetailsOnWidth.sort((a, b) => {
                if (a.points.bottomRight.y > b.points.bottomRight.y) return -1;
                if (a.points.bottomRight.y < b.points.bottomRight.y) return 1;
                return 0;
            }).sort((a, b) => {
                if (a.points.bottomRight.x < b.points.bottomRight.x) return -1;
                if (a.points.bottomRight.x > b.points.bottomRight.x) return 1;
                return 0;
            }).reverse();

        sortedDetails.forEach(sortedDetail => {
            let tempDetail = {
                points: {
                    topLeft: this.getTopLeftPointBySizeAndBottomLeftPoint(sortedDetail.points.bottomRight, sizes),
                    bottomRight: this.getBottomRightPointBySizeAndBottomLeftPoint(sortedDetail.points.bottomRight, sizes)
                }
            };
            
            if (tempDetail.points.bottomRight.x <= canvas.width &&
                !details.some(detail => this.isCrossed(tempDetail, detail))) {
                supportDetails.push(sortedDetail);
            }
            console.log('[INFO forEach] sortedDetails');
        });

        return supportDetails;
    };

    getSuitableDetailsForHeight = (details, verifiableDetailsOnHeight, sizes, canvas) => {
        console.log('[INFO] getSuitableDetailsForHeight');
        console.log({...canvas});
        let supportDetails = [];

        let sortedDetails = verifiableDetailsOnHeight.sort((a, b) => {
                if (a.points.topLeft.x > b.points.topLeft.x) return -1;
                if (a.points.topLeft.x < b.points.topLeft.x) return 1;
                return 0;
            })
            .sort((a, b) => {
                if (a.points.topLeft.y < b.points.topLeft.y) return -1;
                if (a.points.topLeft.y > b.points.topLeft.y) return 1;
                return 0;
            }).reverse();

        sortedDetails.forEach(sortedDetail => {
            let tempDetail = {
                points: {
                    topLeft: this.getTopLeftPointBySizeAndBottomLeftPoint(sortedDetail.points.topLeft, sizes),
                    bottomRight: this.getBottomRightPointBySizeAndBottomLeftPoint(sortedDetail.points.topLeft, sizes)
                }
            };

            if (tempDetail.points.topLeft.y <= canvas.height && 
                !details.some(detail => this.isCrossed(tempDetail, detail))) {
                supportDetails.push(sortedDetail);
            }
            console.log('[INFO forEach] sortedDetails');
        });

        return supportDetails;
    };

    getTopLeftPointBySizeAndBottomLeftPoint = (leftBottomPoint, sizes) => {
        return {
            x: leftBottomPoint.x,
            y: leftBottomPoint.y - sizes.height
        };
    };

    getBottomRightPointBySizeAndBottomLeftPoint = (leftBottomPoint, sizes) => {
        return {
            x: sizes.width + leftBottomPoint.x,
            y: leftBottomPoint.y
        };
    };

    isCrossed = (detail1, detail2) => {

        let detail1Width = detail1.points.bottomRight.x - detail1.points.topLeft.x;
        let detail1Height = detail1.points.bottomRight.y - detail1.points.topLeft.y;

        let detail2Width = detail2.points.bottomRight.x - detail2.points.topLeft.x;
        let detail2Height = detail2.points.bottomRight.y - detail2.points.topLeft.y;

        let widthDiff = Math.max(detail1.points.bottomRight.x, detail2.points.bottomRight.x) -
            Math.min(detail1.points.topLeft.x, detail2.points.topLeft.x);
        let heightDiff = Math.max(detail1.points.bottomRight.y, detail2.points.bottomRight.y) -
            Math.min(detail1.points.topLeft.y, detail2.points.topLeft.y);

        return detail1Width + detail2Width > widthDiff &&
            detail1Height + detail2Height > heightDiff;
    };

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

/*
    Структура объекта detail
    
    {
        id: 1,
        points: {
            topLeft: { 
                x: 0,
                y: 0
            },
            bottomRight: {
                x: 0,
                y: 0
            }
        }
    }

    Структура объекта canvas 
    
    {
        verifiableDetailsOnWidth: [],
        verifiableDetailsOnHeight: [],
        details: [],
        width: 0,
        height: 0
    }
*/