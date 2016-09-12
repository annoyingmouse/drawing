/**
 * Created by Dominic on 10/09/2016.
 */
/// <reference path="CanvasElement.ts" />
class CanvasLine extends CanvasElement {
    points: number[][];
    lineWidth: number;
    lineCap: string;

    constructor(x: number, y: number, iconWidth: number = 10, lineWidth: number = 6, lineCap: string = "round") {
        super(x, y, iconWidth);
        this.type = "line";
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
        for (var i: number = 0; i < this.points.length; i++) {
            var point = this.points[i];
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
    }

    contains(mx, my, ctx) {
        var l: number = this.points.length;
        var x1: number = this.x;
        var y1: number = this.y;
        var wd: number = this.lineWidth;
        var x2:number, y2:number, coordinatesArray = [];
        for (var i: number = 0; i < l; i++) {
            var point = this.points[i];
            x2 = this.points[i][0];
            y2 = this.points[i][1];
            var dx = Math.abs(x2 - x1);
            var dy = Math.abs(y2 - y1);
            var sx = (x1 < x2) ? 1 : -1;
            var sy = (y1 < y2) ? 1 : -1;
            var err = dx - dy;
            // Set first coordinates
            coordinatesArray.push([y1, x1]);
            // Main loop
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
                // Set coordinates
                coordinatesArray.push([y1, x1]);
                ctx.fillStyle = "#f00";
                ctx.fillRect(x1,y1,1,1);
            }
            x1 = this.points[i][0];
            y1 = this.points[i][1];

        }
    }
}


// console.log(calcStraightLine(0,0,3,5));
// console.log(calcLine(0,0,3,5,2));

function calcStraightLine(x1: number, y1: number, x2: number, y2: number) {
    var coordinatesArray = [];
    // Translate coordinates
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push([y1, x1]);
    // Main loop
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
        // Set coordinates
        coordinatesArray.push([y1, x1]);
    }
    // Return the result
    return coordinatesArray;
}

function calcLine(x0: number, y0: number, x1: number, y1: number, wd: number) {
    var coordinatesArray = [];
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = dx - dy, e2, x2, y2;
    /* error value e_xy */
    var ed = dx + dy == 0 ? 1 : Math.sqrt(dx * dx + dy * dy);
    var coordinatesArray = [];
    for (wd = (wd + 1) / 2; ;) {
        coordinatesArray.push([x0, y0]);
        e2 = err;
        x2 = x0;
        if (2 * e2 >= -dx) {                                           /* x step */
            for (e2 += dy, y2 = y0; e2 < ed * wd && (y1 != y2 || dx > dy); e2 += dx)
                coordinatesArray.push([x0, y2 += sy]);
            if (x0 == x1) break;
            e2 = err;
            err -= dy;
            x0 += sx;
        }
        if (2 * e2 <= dy) {                                            /* y step */
            for (e2 = dx - e2; e2 < ed * wd && (x1 != x2 || dx < dy); e2 += dy)
                coordinatesArray.push([x2 += sx, y0]);
            if (y0 == y1) break;
            err += dx;
            y0 += sy;
        }
    }
    return coordinatesArray;
}