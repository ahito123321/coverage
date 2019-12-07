import React, { Component } from 'react';
// material UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        display: 'inline-block',
        marginRight: 10
    },
    canvas: {
        border: '1px solid #000000'
    }
};

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            totalSquare: 0,
            totalSquareMin: 0,
            detailsSquare: 0
        };
    }

    randomColor = () => {
        var allowed = "ABCDEF0123456789", S = "#";
     
        while(S.length < 7) {
            S += allowed.charAt(Math.floor((Math.random()*16)+1));
        }
        return S;
    };

    componentDidMount() {
        let ctx = this.canvas.current.getContext('2d');

        let totalSquare = this.props.canvasInfo.rootSizes.width * this.props.canvasInfo.rootSizes.height;
        let detailsSquare = this.props.canvasInfo.details.reduce((accum, detail) => {
            let width = +detail.points.bottomRight.x - +detail.points.topLeft.x;
            let height = +detail.points.bottomRight.y - +detail.points.topLeft.y;

            return accum + width * height;
        }, 0);

        let detailsWithMinY = this.props.canvasInfo.details[0];
        let detailsWithMaxX = this.props.canvasInfo.details[0];

        this.props.canvasInfo.details.forEach(detail => {
            detailsWithMinY = detailsWithMinY.points.topLeft.y > detail.points.topLeft.y ? detail : detailsWithMinY;
            detailsWithMaxX = detailsWithMaxX.points.bottomRight.x < detail.points.bottomRight.x ? detail : detailsWithMaxX;
        });
        let totalSquareMin = detailsWithMaxX.points.bottomRight.x * 
                (this.props.canvasInfo.rootSizes.height - detailsWithMinY.points.topLeft.y);

        this.setState({
            totalSquare,
            detailsSquare,
            totalSquareMin
        });

        this.props.canvasInfo.details.forEach(detail => {

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;

            ctx.fillStyle = this.randomColor();
            ctx.fillRect(detail.points.topLeft.x, 
                    detail.points.topLeft.y, 
                    detail.points.bottomRight.x - detail.points.topLeft.x, 
                    detail.points.bottomRight.y - detail.points.topLeft.y);

            ctx.shadowColor = "#000000";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 2;
            ctx.fillStyle = this.randomColor();
            ctx.strokeStyle = this.randomColor();
            ctx.font = "italic 11pt Arial";
            ctx.fillText(detail.id, detail.points.topLeft.x + 2, detail.points.bottomRight.y - 2);
        });


    }

    render() {
        const { classes, canvasInfo } = this.props;
        const { totalSquare, detailsSquare, totalSquareMin } = this.state;

        return (
            <div className={classes.root}>
                <Typography component="div" variant="subtitle2">
                    Площадь деталей: {detailsSquare}
                </Typography>
                <Typography component="div" variant="subtitle2">
                    Общая площадь: {totalSquare} | {totalSquareMin}
                </Typography>
                <Typography component="div" variant="subtitle2">
                    Остатки: {totalSquare - detailsSquare} | {totalSquareMin - detailsSquare}
                </Typography>
                <canvas className={classes.canvas} width={canvasInfo.width} height={canvasInfo.height} ref={this.canvas}></canvas>
            </div>
        );
    }
};

export default withStyles(styles)(Canvas);