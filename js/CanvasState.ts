/**
 * Created by Dominic on 06/09/2016.
 */

/// <reference path="CanvasImage.ts" />
/// <reference path="CanvasLine.ts" />

class CanvasState {
    canvas: HTMLElement;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    valid: boolean;
    images: CanvasImage[];
    dragging: boolean;
    selection: CanvasImage;
    drawX: number;
    dragY: number;
    selectionColor: string;
    selectionWidth: number;
    imageSrc: string;
    // Line Drawing
    line: CanvasLine;
    lines: CanvasLine[];
    drawing: boolean;

    constructor(canvas: HTMLCanvasElement, imageSrc: string = "img/grass.jpg") {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = "round";
        this.valid = false;
        this.images = [];
        this.lines = [];
        this.dragging = false;
        this.selection = null;
        this.drawX = 0;
        this.dragY = 0;
        this.selectionColor = "#000";
        this.selectionWidth = 1;
        this.imageSrc = imageSrc;

        this.canvas.addEventListener('selectstart', (e)=> {
            e.preventDefault();
            return false;
        }, false);
        this.canvas.addEventListener('mousedown', (e)=> {
            var mx = e.layerX;
            var my = e.layerY;
            var l = this.images.length;
            for (var i = l - 1; i >= 0; i--) {
                if (this.images[i].contains(mx, my)) {
                    var mySel = this.images[i];
                    this.drawX = mx - mySel.x;
                    this.dragY = my - mySel.y;
                    this.dragging = true;
                    this.selection = mySel;
                    this.valid = false;
                    return;
                } else if (this.images[i].containsDelete(mx, my)) {
                    this.images.splice(i, 1);
                    this.valid = false;
                    break;
                }
            }
            if (this.selection) {
                this.selection = null;
                this.valid = false; // Need to clear the old selection border
            } else {
                if (!this.drawing) {
                    this.drawing = true;
                    this.line = new CanvasLine(e.layerX, e.layerY);
                    this.lines.push(this.line);
                    this.ctx.moveTo(e.layerX, e.layerY);
                }
            }
            this.draw();
        }, true);
        this.canvas.addEventListener('mousemove', (e)=> {
            if (this.dragging) {
                this.selection.x = e.layerX - this.drawX;
                this.selection.y = e.layerY - this.dragY;
                this.valid = false;
            } else {
                if (this.drawing) {
                    this.line.points.push([e.layerX, e.layerY]);
                    this.ctx.lineTo(e.layerX, e.layerY);
                    this.ctx.stroke();
                }
            }
            this.draw();
        }, true);
        this.canvas.addEventListener('mouseup', (e)=> {
            this.dragging = false;
            if (this.drawing) {
                this.drawing = false;
                this.valid = false;
            }
            this.draw();
        }, true);
        this.clear(true);
    }

    draw() {
        if (!this.valid) {
            this.clear(false);
            for (var i = 0; i < this.images.length; i++) {
                var image: CanvasImage = this.images[i];
                if (image.x > this.width || image.y > this.height) {
                    continue;
                }
                this.images[i].draw(this.ctx);
            }
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].draw(this.ctx);
            }
            if (this.selection != null) {
                this.ctx.strokeStyle = this.selectionColor;
                this.ctx.lineWidth = this.selectionWidth;
                var mySel = this.selection;
                this.ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
                this.ctx.beginPath();

                var lineStyle: string = `
                    fill: none;
                    fill-rule: evenodd;
                    stroke: #000000;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: miter;
                    stroke-opacity: 1;
                    stroke-miterlimit: 4;`;
                var iconDimensions: number = 10;
                var data: string = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="${iconDimensions}" width="${iconDimensions}">
                        <path d="M 1.5,1.5 8.5,8.5" style="${lineStyle}" />
                        <path d="M 1.5,8.5 8.5,1.5" style="${lineStyle}" />
                    </svg>`;
                var img: HTMLImageElement = new Image();
                var svg: any = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
                var url = URL.createObjectURL(svg);
                img.onload = ()=> {
                    this.ctx.drawImage(img, mySel.x + mySel.w, mySel.y - 10);
                    URL.revokeObjectURL(url);
                };
                img.src = url;
            }
            this.valid = true;
        }
    }

    clear(firstRun:boolean) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#ddd";
        this.ctx.fillRect(0, 0, this.width, this.height);
        var img: HTMLImageElement = document.createElement("img");
        img.width = this.width;
        img.height = this.height;
        img.src = this.imageSrc;
        if(firstRun){
            img.onload = ()=> {
                this.ctx.drawImage(img, 0, 0);
            };
        }else{
            this.ctx.drawImage(img, 0, 0);
        }

    }

    addImage(image) {
        this.images.push(image);
        this.selection = null;
        this.valid = false;
    }

}
