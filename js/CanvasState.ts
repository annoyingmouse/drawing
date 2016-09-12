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
        this.imageSrc = imageSrc;

        var tempLine = [
            [676,76],
            [606,106],
            [518,123]
        ];
        this.line = new CanvasLine(722, 54);
        this.lines.push(this.line);
        for(var i = 0; i < tempLine.length; i++){
            this.line.points.push(tempLine[i]);
        }
        this.draw();





        this.canvas.addEventListener('selectstart', (e)=> {
            e.preventDefault();
            return false;
        }, false);
        this.canvas.addEventListener('mousedown', (e)=> {
            var mx = e.layerX;
            var my = e.layerY;
            var l:number;

            l = this.lines.length;
            console.log(l);
            for (var i = l - 1; i >= 0; i--) {
                if (this.lines[i].contains(mx, my, this.ctx)) {
                    console.log("clicked a line");
                }
            }




            l = this.images.length;
            for (var i = l - 1; i >= 0; i--) {
                if (this.images[i].contains(mx, my)) {
                    this.drawX = mx - this.images[i].x;
                    this.dragY = my - this.images[i].y;
                    this.dragging = true;
                    this.selection = this.images[i];
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
                this.selection.setSelected(this.ctx);
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
