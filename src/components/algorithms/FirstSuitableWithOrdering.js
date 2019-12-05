import React from 'react';
import { connect } from 'react-redux';
//material UI
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
//custom 
import Canvas from './Canvas';
//utils
import { getTopLeftPointBySizeAndBottomLeftPoint, 
        getBottomRightPointBySizeAndBottomLeftPoint,
        getSuitableDetailsForWidth,
        getSuitableDetailsForHeight } from './AlgorithmsUtil';

import { withSnackbar } from 'notistack';

const styles  = {
    listItem: {
        width: '100%'
    },
    colorWhite: {
        color: '#ffffff'
    }
};

class FirstSuitableWithOrdering extends React.Component {

    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            canvasSizes: {
                width: 0,
                height: 0
            },
            details: [],
            badDetails: [],
            canvases: [],
            factor: 1,
        };
    }

    componentDidMount() {
        let canvasWidth, canvasHeight, factor;

        if (this.props.settings.isAdaptiveCanvas) {
            canvasWidth = this.container.current.clientWidth;
            factor = canvasWidth / +this.props.canvas.width;
            canvasHeight = Math.round(factor * this.props.canvas.height);
        } else {
            canvasWidth = +this.props.canvas.width;
            canvasHeight = +this.props.canvas.height;
            factor = 1;
        }

        let detailedParts = [];
        this.props.details.forEach((detail) => {
            for (let index = 0; index < +detail.amount; index++) {
                detailedParts.push({
                    id: `${detail.id}-${index + 1}`,
                    width: Math.round(+detail.width * factor),
                    height: Math.round(+detail.height * factor)
                });
            }
        });
        
        this.setState({
            ...this.state,
            canvasSizes: {
                width: canvasWidth,
                height: canvasHeight
            },
            details: detailedParts,
            factor
        }, this.startAlgorithm);
    }

    startAlgorithm = () => {
        let startTime = Date.now();

        const { canvasSizes, details, factor } = this.state;
        let badDetails = [];

        let canvases = [{
            details: [],
            verifiableDetailsOnWidth: [],
            verifiableDetailsOnHeight: [],
            width: canvasSizes.width,
            height: canvasSizes.height,
            rootSizes: {
                width: this.props.canvas.width,
                height: this.props.canvas.height
            },
            factor
        }];

        details.sort((a, b) => {
                if (a.width * a.height > b.width * b.height) return -1;
                if (a.width * a.height < b.width * b.height) return 1;
                return 0;
            })
            .forEach((detail, index) => {
            console.log(`\n[INFO] detail - ${index + 1} | ${detail.id}`);
            console.log(`[INFO] Всего полотен - ${canvases.length}`);
            let isAdded = false;
            let isBadDetail = false;
            let usedCanvas;

            for (var canvasIndex = 0; canvasIndex < canvases.length; canvasIndex++) {
                console.log(`[INFO] canvas - ${canvasIndex + 1}`);
                var currentCanvas = canvases[canvasIndex];
                usedCanvas = currentCanvas;

                if (detail.width > currentCanvas.width || detail.height > currentCanvas.height) {
                    console.log(`[OPERATION] проверка на неподходящую деталь`);
                    badDetails.push({
                        id: detail.id,
                        width: Math.round(detail.width / factor),
                        height: Math.round(detail.height / factor)
                    });
                    isBadDetail = true;
                    break;
                }

                if (currentCanvas.details.length === 0) {
                    let tempDetail = {
                        id: detail.id,
                        width: Math.round(detail.width / factor),
                        height: Math.round(detail.height / factor),
                        points: {
                            bottomRight: getBottomRightPointBySizeAndBottomLeftPoint({
                                x: 0,
                                y: currentCanvas.height
                            }, detail),
                            topLeft: getTopLeftPointBySizeAndBottomLeftPoint({
                                x: 0,
                                y: currentCanvas.height
                            }, detail)
                        }
                    };
                    currentCanvas.verifiableDetailsOnWidth.push(tempDetail);
                    currentCanvas.verifiableDetailsOnHeight.push(tempDetail);
                    currentCanvas.details.push(tempDetail);
                    isAdded = true;
                    break;
                }

                let suitableDetailForWidth = getSuitableDetailsForWidth(currentCanvas.details,
                        currentCanvas.verifiableDetailsOnWidth,
                        detail,
                        currentCanvas);
                let suitableDetailForHeight = getSuitableDetailsForHeight(currentCanvas.details,
                        currentCanvas.verifiableDetailsOnHeight,
                        detail,
                        currentCanvas);

                console.log(`[INFO] есть подходящая по ширине ${!!suitableDetailForWidth}`);
                console.log(`[INFO] есть подходящая по высоте ${!!suitableDetailForHeight}`);

                if (suitableDetailForWidth) {
                    let currentDetail = {
                        id: detail.id,
                        width: Math.round(detail.width / factor),
                        height: Math.round(detail.height / factor),
                        points: {
                            bottomRight: getBottomRightPointBySizeAndBottomLeftPoint(suitableDetailForWidth.points.bottomRight, detail),
                            topLeft: getTopLeftPointBySizeAndBottomLeftPoint(suitableDetailForWidth.points.bottomRight, detail)
                        }
                    };
                    let detailIdToDelete = suitableDetailForWidth.id;

                    let detailIndexToDelete = currentCanvas.verifiableDetailsOnWidth.findIndex(detail => detail.id === detailIdToDelete);
                    currentCanvas.verifiableDetailsOnWidth.splice(detailIndexToDelete, 1);

                    currentCanvas.verifiableDetailsOnWidth.push(currentDetail);
                    currentCanvas.verifiableDetailsOnHeight.push(currentDetail);
                    currentCanvas.details.push(currentDetail);
                    isAdded = true;
                    break;
                } 
                
                if (suitableDetailForHeight) {
                    let currentDetail = {
                        id: detail.id,
                        width: Math.round(detail.width / factor),
                        height: Math.round(detail.height / factor),
                        points: {
                            bottomRight: getBottomRightPointBySizeAndBottomLeftPoint(suitableDetailForHeight.points.topLeft, detail),
                            topLeft: getTopLeftPointBySizeAndBottomLeftPoint(suitableDetailForHeight.points.topLeft, detail)
                        }
                    };
                    let detailIdToDelete = suitableDetailForHeight.id;

                    let detailIndexToDelete = currentCanvas.verifiableDetailsOnHeight.findIndex(detail => detail.id === detailIdToDelete);
                    currentCanvas.verifiableDetailsOnHeight.splice(detailIndexToDelete, 1);

                    currentCanvas.verifiableDetailsOnWidth.push(currentDetail);
                    currentCanvas.verifiableDetailsOnHeight.push(currentDetail);
                    currentCanvas.details.push(currentDetail);
                    isAdded = true;
                    break;
                }
                if (!isAdded && canvases.length === canvasIndex + 1) break;
            }

            console.log(`[INFO] была добавлена? ${!!isAdded}`);
            console.log(`[INFO] плохая деталь? ${!!isBadDetail}`);

            if (isAdded) {
                console.log('[OPERATION] исключение некорректных деталей из проверочных');
                let detailsIndexToDeleteOnWidth = [];
                usedCanvas.verifiableDetailsOnWidth.forEach((detail, index) => {
                    if (detail.points.bottomRight.x + 1 > usedCanvas.width) {
                        detailsIndexToDeleteOnWidth.push(index);
                    } 
                });
    
                let detailsIndexToDeleteOnHeight = [];
                usedCanvas.verifiableDetailsOnHeight.forEach((detail, index) => {
                    if (detail.points.topLeft.y - 1 < 0) {
                        detailsIndexToDeleteOnHeight.push(index);
                    } 
                });
    
                detailsIndexToDeleteOnWidth.forEach(index => usedCanvas.verifiableDetailsOnWidth.splice(index, 1));
                detailsIndexToDeleteOnHeight.forEach(index => usedCanvas.verifiableDetailsOnHeight.splice(index, 1));
            } 

            if (!isBadDetail && !isAdded) {

                if (!this.props.settings.isMultiCanvases) {
                    badDetails.push({
                        id: detail.id,
                        width: Math.round(detail.width / factor),
                        height: Math.round(detail.height / factor)
                    });
                    return;
                }

                console.log('[OPERATION] добавление нового полотна');
                let newCanvas = {
                    details: [],
                    verifiableDetailsOnWidth: [],
                    verifiableDetailsOnHeight: [],
                    width: canvasSizes.width,
                    height: canvasSizes.height,
                    rootSizes: {
                        width: this.props.canvas.width,
                        height: this.props.canvas.height
                    },
                    factor
                };

                if (detail.width > newCanvas.width || detail.height > newCanvas.height) {
                    badDetails.push({
                        id: detail.id,
                        width: Math.round(detail.width / factor),
                        height: Math.round(detail.height / factor)
                    });
                }    

                let tempDetail = {
                    id: detail.id,
                    width: Math.round(detail.width / factor),
                    height: Math.round(detail.height / factor),
                    points: {
                        bottomRight: getBottomRightPointBySizeAndBottomLeftPoint({
                            x: 0,
                            y: newCanvas.height
                        }, detail),
                        topLeft: getTopLeftPointBySizeAndBottomLeftPoint({
                            x: 0,
                            y: newCanvas.height
                        }, detail)
                    }
                };
                newCanvas.verifiableDetailsOnWidth.push(tempDetail);
                newCanvas.verifiableDetailsOnHeight.push(tempDetail);
                newCanvas.details.push(tempDetail);
                canvases.push(newCanvas);
            }
        });

        console.log(canvases);
        console.log(badDetails);

        let endTime = Date.now();
        
        this.setState({
            ...this.state,
            canvases: canvases
        }, () => {
            this.props.dispatch({
                type: 'CLOSE_SPINNER'
            });
            this.props.enqueueSnackbar(`Время выполнения ${endTime - startTime} мс`, {
                variant: 'success',
                autoHideDuration: 3000,
                action: this.action
            });
        });
    };

    action = key => (
        <>
            <Button className={this.props.classes.colorWhite} onClick={() => { this.props.closeSnackbar(key) }}>
                ОК
            </Button>
        </>
    );

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
        details: state.details,
        settings: state.settings
    }
};

export default withStyles(styles)(connect(mapStateToProps)(withSnackbar(FirstSuitableWithOrdering)));