import React, { Component } from 'react';
// material UI
import { withStyles } from '@material-ui/core/styles';

const styles = {
    canvas: {
        border: '1px solid #000000'
    }
};

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
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
        this.props.canvasInfo.details.forEach(detail => {
            ctx.fillStyle = this.randomColor();
            ctx.fillRect(detail.point1.x, detail.point1.y, detail.point2.x - detail.point1.x, detail.point2.y - detail.point1.y);
        });
    }

    render() {
        const { classes, canvasInfo } = this.props;

        return (
            <>
                <canvas className={classes.canvas} width={canvasInfo.width} height={canvasInfo.height} ref={this.canvas}></canvas>
            </>
        );
    }
};

export default withStyles(styles)(Canvas);