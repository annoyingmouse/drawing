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
    CanvasElement.prototype.changeColour = function (state, colour) {
        console.log("Change line colour");
    };
    CanvasElement.prototype.changeWidth = function (state, width) {
        console.log("Change line width");
    };
    CanvasElement.prototype.changeStyle = function (state, style) {
        console.log("Change line style");
    };
    return CanvasElement;
}());
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
