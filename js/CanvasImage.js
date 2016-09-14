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
        this.type = "image";
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
        var _this = this;
        ctx.strokeStyle = this.selectionColor;
        ctx.lineWidth = this.selectionWidth;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        var lineStyle = "\n            fill: none;\n            fill-rule: evenodd;\n            stroke: #000000;\n            stroke-width: 2;\n            stroke-linecap: round;\n            stroke-linejoin: miter;\n            stroke-opacity: 1;\n            stroke-miterlimit: 4;";
        var data = "\n            <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"" + this.iconWidth + "\" width=\"" + this.iconWidth + "\">\n                <path d=\"M 1.5,1.5 8.5,8.5\" style=\"" + lineStyle + "\" />\n                <path d=\"M 1.5,8.5 8.5,1.5\" style=\"" + lineStyle + "\" />\n            </svg>";
        var img = new Image();
        var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(svg);
        img.onload = function () {
            ctx.drawImage(img, _this.x + _this.w, _this.y - 10);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };
    return CanvasImage;
}(CanvasElement));
