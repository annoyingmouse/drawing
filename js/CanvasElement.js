/**
 * Created by Dominic on 10/09/2016.
 */
var CanvasElement = (function () {
    function CanvasElement(x, y, iconWidth) {
        if (iconWidth === void 0) { iconWidth = 10; }
        this.x = x;
        this.y = y;
        this.iconWidth = iconWidth;
    }
    CanvasElement.prototype.draw = function (ctx) {
        console.log("Drawing the element");
    };
    CanvasElement.prototype.contains = function (mx, my, ctx) {
        console.log("Check to see if mouse click is contained within element");
    };
    CanvasElement.prototype.containsDelete = function (mx, my) {
        console.log("Check to see if mouse click is contained within the element delete icon");
    };
    CanvasElement.prototype.setSelected = function (ctx) {
        console.log("Setting selected element");
    };
    return CanvasElement;
}());
