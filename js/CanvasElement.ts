/**
 * Created by Dominic on 10/09/2016.
 */
class CanvasElement {
    x: number;
    y: number;
    iconWidth: number;
    type: string;
    points: number[][];
    lineColour: string;
    lineWidth: number;
    lineStyle: string;

    constructor(x: number, y: number, iconWidth: number = 10) {
        this.x = x;
        this.y = y;
        this.iconWidth = iconWidth;
    }

    draw(ctx: CanvasRenderingContext2D) {
        console.log("Drawing the element");
    }

    contains(mx: number, my: number, ctx?: CanvasRenderingContext2D) {
        console.log("Check to see if mouse click is contained within element");
    }

    containsDelete(mx: number, my: number) {
        console.log("Check to see if mouse click is contained within the element delete icon");
    }

    setSelected(ctx: CanvasRenderingContext2D) {
        console.log("Setting selected element");
    }

    changeColour(state: CanvasState, colour: string) {
        console.log("Change line colour");
    }

    changeWidth(state: CanvasState, width: number) {
        console.log("Change line width");
    }

    changeStyle(state: CanvasState, style: string) {
        console.log("Change line style");
    }
}
function containedWithin(obj: BoundingBox, x: number, y: number) {
    return (obj.horizontal.left <= x)
        && (obj.horizontal.right >= x)
        && (obj.vertical.top <= y)
        && (obj.vertical.bottom >= y);
}
class Horizontal {
    left: number;
    right: number;

    constructor(left: number, right: number) {
        this.left = left;
        this.right = right;
    }
}
class Vertical {
    top: number;
    bottom: number;

    constructor(top: number, bottom: number) {
        this.top = top;
        this.bottom = bottom;
    }
}
class BoundingBox {
    horizontal: Horizontal;
    vertical: Vertical;

    constructor(left: number, right: number, top: number, bottom: number) {
        this.horizontal = new Horizontal(left, right);
        this.vertical = new Vertical(top, bottom);
    }
}
