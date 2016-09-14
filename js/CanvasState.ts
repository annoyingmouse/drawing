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
    elements: CanvasElement[];
    dragging: boolean;
    selection: CanvasElement;
    element: CanvasElement;
    drawX: number;
    dragY: number;
    imageSrc: string;
    drawing: boolean;

    constructor(canvas: HTMLCanvasElement, imageSrc: string = "img/grass.jpg") {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = "round";
        this.valid = false;
        this.elements = [];
        this.dragging = false;
        this.selection = null;
        this.drawX = 0;
        this.dragY = 0;
        this.imageSrc = imageSrc;

        this.canvas.addEventListener('selectstart', (e)=> {
            e.preventDefault();
            return false;
        }, false);
        this.canvas.addEventListener('mousedown', (e)=> {
            if (!e.button) {
                var mx = e.layerX;
                var my = e.layerY;
                var l: number;
                l = this.elements.length;
                for (var i = l - 1; i >= 0; i--) {
                    if (this.elements[i].contains(mx, my)) {
                        if (this.elements[i].type === "image") {
                            this.drawX = mx - this.elements[i].x;
                            this.dragY = my - this.elements[i].y;
                            this.dragging = true;
                        }
                        this.selection = this.elements[i];
                        this.valid = false;
                        return;
                    } else if (this.elements[i].containsDelete(mx, my)) {
                        this.elements.splice(i, 1);
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
                        this.element = new CanvasLine(e.layerX, e.layerY);
                        this.elements.push(this.element);
                        this.ctx.moveTo(e.layerX, e.layerY);
                    }
                }
                this.draw();
            }
        }, true);
        this.canvas.addEventListener('mousemove', (e)=> {
            if (this.dragging) {
                this.selection.x = e.layerX - this.drawX;
                this.selection.y = e.layerY - this.dragY;
                this.valid = false;
            } else {
                if (this.drawing) {
                    this.element.points.push([e.layerX, e.layerY]);
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
            for (var i = 0; i < this.elements.length; i++) {
                var image: CanvasElement = this.elements[i];
                if (image.x > this.width || image.y > this.height) {
                    continue;
                }
                this.elements[i].draw(this.ctx);
            }
            if (this.selection != null) {
                this.selection.setSelected(this.ctx);
            }
            this.valid = true;
        }
    }

    clear(firstRun: boolean) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#ddd";
        this.ctx.fillRect(0, 0, this.width, this.height);
        var img: HTMLImageElement = document.createElement("img");
        img.width = this.width;
        img.height = this.height;
        img.src = this.imageSrc;
        if (firstRun) {
            img.onload = ()=> {
                this.ctx.drawImage(img, 0, 0);
            };
        } else {
            this.ctx.drawImage(img, 0, 0);
        }

    }

    addImage(image) {
        this.elements.push(image);
        this.selection = null;
        this.valid = false;
    }

}
