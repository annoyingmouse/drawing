/**
 * Created by Dominic on 06/09/2016.
 */
/// <reference path="CanvasElement.ts" />
class CanvasImage extends CanvasElement {
    w: number;
    h: number;
    img: HTMLImageElement;
    selectionColor: string;
    selectionWidth: number;

    constructor(x: number, y: number, id: string, iconWidth: number = 10) {
        super(x, y, iconWidth);
        this.type = "image";
        var original: HTMLElement = document.getElementById(id);
        var img: HTMLImageElement = document.createElement("img");
        img.width = +original.getAttribute("width");
        img.height = +original.getAttribute("height");
        img.src = original.getAttribute("src");
        this.w = +original.getAttribute("width");
        this.h = +original.getAttribute("height");
        this.img = img;
        this.selectionColor = "#000";
        this.selectionWidth = 1;
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

    setSelected(ctx: CanvasRenderingContext2D){
        ctx.strokeStyle = this.selectionColor;
        ctx.lineWidth = this.selectionWidth;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        var lineStyle: string = `
            fill: none;
            fill-rule: evenodd;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: miter;
            stroke-opacity: 1;
            stroke-miterlimit: 4;`;
        var data: string = `
            <svg xmlns="http://www.w3.org/2000/svg" height="${this.iconWidth}" width="${this.iconWidth}">
                <path d="M 1.5,1.5 8.5,8.5" style="${lineStyle}" />
                <path d="M 1.5,8.5 8.5,1.5" style="${lineStyle}" />
            </svg>`;
        var img: HTMLImageElement = new Image();
        var svg: any = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        var url = URL.createObjectURL(svg);
        img.onload = ()=> {
            ctx.drawImage(img, this.x + this.w, this.y - 10);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
}