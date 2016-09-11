/**
 * Created by Dominic on 06/09/2016.
 */
/// <reference path="CanvasElement.ts" />
class CanvasImage extends CanvasElement {
    w: number;
    h: number;
    img: HTMLImageElement;

    constructor(x: number, y: number, id: string, iconWidth: number = 10) {
        super(x, y, iconWidth);
        var original: HTMLElement = document.getElementById(id);
        var img: HTMLImageElement = document.createElement("img");
        img.width = +original.getAttribute("width");
        img.height = +original.getAttribute("height");
        img.src = original.getAttribute("src");
        this.w = +original.getAttribute("width");
        this.h = +original.getAttribute("height");
        this.img = img;
    };

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.x, this.y);
    }

    contains(mx: number, my: number) {
        return containedWithin(new BoundingBox(this.x, this.x + this.w, this.y, this.y + this.h), mx, my);
    }

    containsDelete(mx: number, my: number) {
        return containedWithin(new BoundingBox(this.x + this.w, this.x + this.w + this.iconWidth, this.y - this.iconWidth, this.y), mx, my);
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
