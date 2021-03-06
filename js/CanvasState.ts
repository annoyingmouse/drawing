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
    drawing: boolean;
    background: HTMLImageElement;

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
        this.background = document.createElement("img");
        this.background.width = this.width;
        this.background.height = this.height;
        this.background.src = imageSrc;

        this.canvas.addEventListener("drop", (e)=> {
            e.preventDefault();
            this.addImage(new CanvasImage(e.layerX - parseInt(e.dataTransfer.getData("x"), 10), e.layerY - parseInt(e.dataTransfer.getData("y"), 10), e.dataTransfer.getData("text")));
        }, false);
        this.canvas.addEventListener("dragover", (e)=> e.preventDefault(), false);
        this.canvas.addEventListener("selectstart", (e)=> {
            e.preventDefault();
            return false;
        }, false);
        this.canvas.addEventListener("mousedown", (e)=> {
            if (!e.button) {
                var mx = e.layerX;
                var my = e.layerY;
                var l: number = this.elements.length;
                for (var i = l - 1; i >= 0; i--) {
                    if (this.elements[i].contains(mx, my)) {
                        if (this.elements[i].type === "image") {
                            this.drawX = mx - this.elements[i].x;
                            this.dragY = my - this.elements[i].y;
                            this.dragging = true;
                        } else if (this.elements[i].type === "line") {
                            (<HTMLSelectElement>document.getElementById("colour")).value = this.elements[i].lineColour;
                            (<HTMLInputElement>document.getElementById("width")).value = this.elements[i].lineWidth.toString();
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
                    this.valid = false;
                } else {
                    if (!this.drawing) {
                        this.drawing = true;
                        this.element = new CanvasLine(
                            e.layerX,
                            e.layerY,
                            (<HTMLSelectElement>document.getElementById("colour")).value,
                            parseInt((<HTMLInputElement>document.getElementById("width")).value, 10),
                            (<HTMLSelectElement>document.getElementById("style")).value,
                            (<HTMLSelectElement>document.getElementById("arrow")).value
                        );
                        var lineWidth = parseInt((<HTMLInputElement>document.getElementById("width")).value, 10);
                        this.ctx.lineWidth = lineWidth;
                        this.ctx.strokeStyle = (<HTMLSelectElement>document.getElementById("colour")).value;
                        this.ctx.setLineDash(getLineDash((<HTMLSelectElement>document.getElementById("style")).value, lineWidth));
                        this.ctx.beginPath();
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
        this.canvas.addEventListener('mouseup', ()=> {
            this.dragging = false;
            if (this.drawing) {
                if(this.element.points.length > 1){
                    this.elements.push(this.element);
                }
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
        if (firstRun) {
            this.background.onload = ()=> {
                this.ctx.drawImage(this.background, 0, 0);
            };
        } else {
            this.ctx.drawImage(this.background, 0, 0);
        }
    }

    addImage(image) {
        this.elements.push(image);
        this.selection = null;
        this.valid = false;
    }

    setInvalid() {
        this.valid = false;
        this.draw();
    }

    handleColourChange(colour: string) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeColour(this, colour);
        }
    }

    handleWidthChange(width: number) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeWidth(this, width);
        }
    }

    handleStyleChange(style: string) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeStyle(this, style);
        }
    }

    handleArrowChange(arrow: string) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeArrow(this, arrow);
        }
    }

    handleDelete() {
        if (this.selection) {
            var l: number = this.elements.length;
            for (var i = l - 1; i >= 0; i--) {
                if (this.elements[i] === this.selection) {
                    this.elements.splice(i, 1);
                    this.selection = null;
                    this.setInvalid();
                    break;
                }
            }
        }
    }
}

function getLineDash(type: string, width: number) : number[] {
    var lineTypes = {
        "solid": function(){
            return [0, 0];
        },
        "dots": function(){
            return [width * 2, width * 2];
        },
        "dashed": function(){
            return [width * 4, width * 2];
        }
    };
    return (lineTypes[type] || lineTypes["solid"])();
}