var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Dominic on 10/09/2016.
 */
/// <reference path="CanvasElement.ts" />
var CanvasLine = (function (_super) {
    __extends(CanvasLine, _super);
    function CanvasLine(x, y, iconWidth, lineWidth, lineCap) {
        if (iconWidth === void 0) { iconWidth = 10; }
        if (lineWidth === void 0) { lineWidth = 5; }
        if (lineCap === void 0) { lineCap = "round"; }
        _super.call(this, x, y, iconWidth);
        this.points = [];
        this.iconWidth = iconWidth;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
    }
    CanvasLine.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.lineCap;
        ctx.moveTo(this.x, this.y);
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
    };
    CanvasLine.prototype.contains = function (mx, my) {
        var coordinatesArray = [];
        coordinatesArray.push([this.x, this.y]);
    };
    return CanvasLine;
}(CanvasElement));
console.log(calcStraightLine(0, 0, 3, 5));
console.log(calcLine(0, 0, 3, 5, 2));
function calcStraightLine(x1, y1, x2, y2) {
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
function calcLine(x0, y0, x1, y1, wd) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = dx - dy, e2, x2, y2; /* error value e_xy */
    var ed = dx + dy == 0 ? 1 : Math.sqrt(dx * dx + dy * dy);
    var coordinatesArray = [];
    for (wd = (wd + 1) / 2;;) {
        coordinatesArray.push([x0, y0]);
        e2 = err;
        x2 = x0;
        if (2 * e2 >= -dx) {
            for (e2 += dy, y2 = y0; e2 < ed * wd && (y1 != y2 || dx > dy); e2 += dx)
                coordinatesArray.push([x0, y2 += sy]);
            if (x0 == x1)
                break;
            e2 = err;
            err -= dy;
            x0 += sx;
        }
        if (2 * e2 <= dy) {
            for (e2 = dx - e2; e2 < ed * wd && (x1 != x2 || dx < dy); e2 += dy)
                coordinatesArray.push([x2 += sx, y0]);
            if (y0 == y1)
                break;
            err += dx;
            y0 += sy;
        }
    }
    return coordinatesArray;
}
