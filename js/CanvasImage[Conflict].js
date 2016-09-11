var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Dominic on 06/09/2016.
 */
/// <reference path="CanvasElement.ts" />
var CanvasImage = (function (_super) {
    __extends(CanvasImage, _super);
    function CanvasImage(x, y, id, iconWidth) {
        if (iconWidth === void 0) { iconWidth = 10; }
        _super.call(this, x, y, iconWidth);
        var original = document.getElementById(id);
        var img = document.createElement("img");
        img.width = +original.getAttribute("width");
        img.height = +original.getAttribute("height");
        img.src = original.getAttribute("src");
        this.w = +original.getAttribute("width");
        this.h = +original.getAttribute("height");
        this.img = img;
        this.selectionColor = "#000";
        this.selectionWidth = 1;
    }
    ;
    CanvasImage.prototype.draw = function (ctx) {
        ctx.drawImage(this.img, this.x, this.y);
    };
    CanvasImage.prototype.contains = function (mx, my) {
        return containedWithin(new BoundingBox(this.x, this.x + this.w, this.y, this.y + this.h), mx, my);
    };
    CanvasImage.prototype.containsDelete = function (mx, my) {
        return containedWithin(new BoundingBox(this.x + this.w, this.x + this.w + this.iconWidth, this.y - this.iconWidth, this.y), mx, my);
    };
    CanvasImage.prototype.setSelected = function (ctx) {
        this.ctx.strokeStyle = this.selectionColor;
        this.ctx.lineWidth = this.selectionWidth;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.beginPath();
    };
    return CanvasImage;
}(CanvasElement));
function containedWithin(obj, x, y) {
    return (obj.horizontal.left <= x)
        && (obj.horizontal.right >= x)
        && (obj.vertical.top <= y)
        && (obj.vertical.bottom >= y);
}
var Horizontal = (function () {
    function Horizontal(left, right) {
        this.left = left;
        this.right = right;
    }
    return Horizontal;
}());
var Vertical = (function () {
    function Vertical(top, bottom) {
        this.top = top;
        this.bottom = bottom;
    }
    return Vertical;
}());
var BoundingBox = (function () {
    function BoundingBox(left, right, top, bottom) {
        this.horizontal = new Horizontal(left, right);
        this.vertical = new Vertical(top, bottom);
    }
    return BoundingBox;
}());
