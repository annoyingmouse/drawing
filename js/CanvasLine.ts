/**
 * Created by Dominic on 10/09/2016.
 */
/// <reference path="CanvasElement.ts" />
class CanvasLine extends CanvasElement {
    points: number[][];
    lineWidth: number;
    lineCap: string;
    lineColour: string;
    selected: boolean;
    lineStyle: string;
    startRadians: number;
    endRadians: number;
    arrow: string;

    constructor(x: number, y: number, lineColour: string = "#000000", lineWidth: number = 10, lineStyle: string = "solid", arrow: string = "none", iconWidth: number = 10, lineCap: string = "round") {
        super(x, y, iconWidth);
        this.type = "line";
        this.points = [];
        this.iconWidth = iconWidth;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
        this.lineColour = lineColour;
        this.lineStyle = lineStyle;
        this.arrow = arrow;
        this.selected = false;
    }

    drawArrowhead(ctx: CanvasRenderingContext2D, x: number, y: number, radians: number) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(radians);
        ctx.moveTo(0, -7);
        ctx.lineTo(12, 30);
        ctx.lineTo(-12, 30);
        ctx.closePath();
        ctx.restore();
        ctx.fillStyle = this.lineColour;
        ctx.setLineDash(getLineDash("solid", this.lineWidth));
        ctx.stroke();
        ctx.fill();
    }

    static calculateRadions(points: number[][], x: number, y: number, start: boolean, smoothing: number): number {
        let limit = (Math.floor(points.length / 3) >= smoothing) ? smoothing : Math.floor(points.length / 3);
        let averageArray: number[][] = (start) ? [[x, y]] : [];
        for (let i = (start) ? 0 : points.length - limit; i < ((start) ? limit - 1 : points.length); i++) {
            averageArray.push(points[i]);
        }
        let average: number[] = [averageArray.reduce((p, c)=>p + c[0], 0) / limit];
        average.push(averageArray.reduce((p, c)=>p + c[1], 0) / limit);
        let radians = Math.atan((average[1] - y) / (average[0] - x));
        radians += ((average[0] > x) ? -90 : 90) * Math.PI / 180;
        return radians;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (typeof this.startRadians === "undefined") {
            this.startRadians = CanvasLine.calculateRadions(this.points, this.x, this.y, true, 15);
            this.endRadians = CanvasLine.calculateRadions(this.points, this.points[this.points.length - 1][0], this.points[this.points.length - 1][1], false, 15)
        }
        ctx.setLineDash(getLineDash(this.lineStyle, this.lineWidth));
        if (this.selected) {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth + 4;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = invertColor(this.lineColour, true);
            ctx.shadowBlur = 20;
            ctx.moveTo(this.x, this.y);
            for (var i: number = 0; i < this.points.length; i++) {
                ctx.lineTo(this.points[i][0], this.points[i][1]);
            }
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = this.lineColour;
        ctx.moveTo(this.x, this.y);
        for (var i: number = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.stroke();
        this.selected = false;
        if (this.arrow !== "none") {
            if (this.arrow === "both" || this.arrow === "start") {
                this.drawArrowhead(ctx, this.x, this.y, this.startRadians);
            }
            if (this.arrow === "both" || this.arrow === "end") {
                this.drawArrowhead(ctx, this.points[this.points.length - 1][0], this.points[this.points.length - 1][1], this.endRadians);
            }
        }
    }

    contains(mx: number, my: number, ctx: CanvasRenderingContext2D) {
        var l: number = this.points.length;
        var x1: number = this.x;
        var y1: number = this.y;
        var x2: number, y2: number;
        for (var i: number = 0; i < l; i++) {
            x2 = this.points[i][0];
            y2 = this.points[i][1];
            var dx = Math.abs(x2 - x1);
            var dy = Math.abs(y2 - y1);
            var sx = (x1 < x2) ? 1 : -1;
            var sy = (y1 < y2) ? 1 : -1;
            var err = dx - dy;
            if (Math.sqrt(Math.pow((mx - x1), 2) + Math.pow((my - y1), 2)) < this.lineWidth / 2) {
                return true;
            }
            while (!((x1 == x2) && (y1 == y2))) {
                var e2 = err << 1;
                if (e2 > -dy) {
                    err -= dy;
                    x1 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y1 += sy;
                }
                if (Math.sqrt(Math.pow((mx - x1), 2) + Math.pow((my - y1), 2)) < this.lineWidth / 2) {
                    return true;
                }
            }
            x1 = this.points[i][0];
            y1 = this.points[i][1];
        }
        return false;
    }

    containsDelete(mx: number, my: number) {
        return containedWithin(new BoundingBox(this.x, this.x + this.iconWidth, this.y - this.iconWidth, this.y), mx, my);
    }

    setSelected(ctx: CanvasRenderingContext2D) {
        this.selected = true;
        this.draw(ctx);
        var lineStyle: string = `
            fill: none;
            fill-rule: evenodd;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: miter;
            stroke-opacity: 1;
            stroke-miterlimit: 4;`;
        var data: string = `
            <svg xmlns="http://www.w3.org/2000/svg" height="${this.iconWidth}" width="${this.iconWidth}">
                <path d="M 1.5,1.5 8.5,8.5" style="${lineStyle}" />
                <path d="M 1.5,8.5 8.5,1.5" style="${lineStyle}" />
            </svg>`;
        var img: HTMLImageElement = new Image();
        var svg: any = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        var url = URL.createObjectURL(svg);
        img.onload = ()=> {
            ctx.drawImage(img, this.x, this.y - 10);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    changeColour(state: CanvasState, colour: string) {
        this.lineColour = colour;
        state.setInvalid();
    }

    changeWidth(state: CanvasState, width: number) {
        this.lineWidth = width;
        state.setInvalid();
    }

    changeStyle(state: CanvasState, style: string) {
        this.lineStyle = style;
        state.setInvalid();
    }

    changeArrow(state: CanvasState, arrow: string) {
        this.arrow = arrow;
        state.setInvalid();
    }
}
/*
 * http://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
 */
function invertColor(hex: string, bw: boolean) {
    var r: string, g: string, b: string;
    if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var rI = parseInt(hex.slice(0, 2), 16),
        gI = parseInt(hex.slice(2, 4), 16),
        bI = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (rI * 0.299 + gI * 0.587 + bI * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - rI).toString(16);
    g = (255 - gI).toString(16);
    b = (255 - bI).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str: string, len: number = 2) {
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}