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
        console.log(this);
    };
    return CanvasLine;
}(CanvasElement));
