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
    function CanvasLine(x, y, lineColour, lineWidth, lineStyle, arrow, iconWidth, lineCap) {
        if (lineColour === void 0) { lineColour = "#000000"; }
        if (lineWidth === void 0) { lineWidth = 10; }
        if (lineStyle === void 0) { lineStyle = "solid"; }
        if (arrow === void 0) { arrow = "none"; }
        if (iconWidth === void 0) { iconWidth = 10; }
        if (lineCap === void 0) { lineCap = "round"; }
        _super.call(this, x, y, iconWidth);
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
    CanvasLine.prototype.drawArrowhead = function (ctx, x, y, radians) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(radians);
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 40);
        ctx.lineTo(-15, 40);
        ctx.closePath();
        ctx.restore();
        ctx.fillStyle = this.lineColour;
        ctx.setLineDash(getLineDash("solid", this.lineWidth));
        ctx.stroke();
        ctx.fill();
    };
    CanvasLine.calculateRadions = function (points, x, y, start, smoothing) {
        var limit = (Math.floor(points.length / 3) >= smoothing) ? smoothing : Math.floor(points.length / 3);
        var averageArray = (start) ? [[x, y]] : [];
        for (var i = (start) ? 0 : points.length - limit; i < ((start) ? limit - 1 : points.length); i++) {
            averageArray.push(points[i]);
        }
        var average = [averageArray.reduce(function (p, c) { return p + c[0]; }, 0) / limit];
        average.push(averageArray.reduce(function (p, c) { return p + c[1]; }, 0) / limit);
        var radians = Math.atan((average[1] - y) / (average[0] - x));
        radians += ((average[0] > x) ? -90 : 90) * Math.PI / 180;
        return radians;
    };
    CanvasLine.prototype.draw = function (ctx) {
        if (typeof this.startRadians === "undefined") {
            this.startRadians = CanvasLine.calculateRadions(this.points, this.x, this.y, true, 15);
            this.endRadians = CanvasLine.calculateRadions(this.points, this.points[this.points.length - 1][0], this.points[this.points.length - 1][1], false, 15);
        }
        ctx.setLineDash(getLineDash(this.lineStyle, this.lineWidth));
        if (this.selected) {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth + 4;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = invertColor(this.lineColour, true);
            ctx.shadowBlur = 20;
            ctx.moveTo(this.x, this.y);
            for (var i = 0; i < this.points.length; i++) {
                var point = this.points[i];
                ctx.lineTo(point[0], point[1]);
            }
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = this.lineColour;
        ctx.moveTo(this.x, this.y);
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            ctx.lineTo(point[0], point[1]);
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
    };
    CanvasLine.prototype.contains = function (mx, my, ctx) {
        var l = this.points.length;
        var x1 = this.x;
        var y1 = this.y;
        var x2, y2;
        for (var i = 0; i < l; i++) {
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
    };
    CanvasLine.prototype.containsDelete = function (mx, my) {
        return containedWithin(new BoundingBox(this.x, this.x + this.iconWidth, this.y - this.iconWidth, this.y), mx, my);
    };
    CanvasLine.prototype.setSelected = function (ctx) {
        var _this = this;
        this.selected = true;
        this.draw(ctx);
        var lineStyle = "\n            fill: none;\n            fill-rule: evenodd;\n            stroke: #000000;\n            stroke-width: 2;\n            stroke-linecap: round;\n            stroke-linejoin: miter;\n            stroke-opacity: 1;\n            stroke-miterlimit: 4;";
        var data = "\n            <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"" + this.iconWidth + "\" width=\"" + this.iconWidth + "\">\n                <path d=\"M 1.5,1.5 8.5,8.5\" style=\"" + lineStyle + "\" />\n                <path d=\"M 1.5,8.5 8.5,1.5\" style=\"" + lineStyle + "\" />\n            </svg>";
        var img = new Image();
        var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(svg);
        img.onload = function () {
            ctx.drawImage(img, _this.x, _this.y - 10);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };
    CanvasLine.prototype.changeColour = function (state, colour) {
        this.lineColour = colour;
        state.setInvalid();
    };
    CanvasLine.prototype.changeWidth = function (state, width) {
        this.lineWidth = width;
        state.setInvalid();
    };
    CanvasLine.prototype.changeStyle = function (state, style) {
        this.lineStyle = style;
        state.setInvalid();
    };
    CanvasLine.prototype.changeArrow = function (state, arrow) {
        this.arrow = arrow;
        state.setInvalid();
    };
    return CanvasLine;
}(CanvasElement));
/*
 * http://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
 */
function invertColor(hex, bw) {
    var r, g, b;
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
    var rI = parseInt(hex.slice(0, 2), 16), gI = parseInt(hex.slice(2, 4), 16), bI = parseInt(hex.slice(4, 6), 16);
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
function padZero(str, len) {
    if (len === void 0) { len = 2; }
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}
