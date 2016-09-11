/**
 * Created by Dominic on 10/09/2016.
 */
/// <reference path="CanvasElement.ts" />
class CanvasLine extends CanvasElement {
    points: number[][];
    lineWidth: number;
    lineCap: string;

    constructor(x: number, y: number, iconWidth: number = 10, lineWidth: number = 5, lineCap: string = "round") {
        super(x, y, iconWidth);
        this.points = [];
        this.iconWidth = iconWidth;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.lineCap;
        ctx.moveTo(this.x, this.y);
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
        console.log(this);
    }

}