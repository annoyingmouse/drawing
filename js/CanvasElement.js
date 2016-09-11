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
    return CanvasElement;
}());
