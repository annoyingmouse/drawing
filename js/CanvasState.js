/**
 * Created by Dominic on 06/09/2016.
 */
/// <reference path="CanvasImage.ts" />
/// <reference path="CanvasLine.ts" />
var CanvasState = (function () {
    function CanvasState(canvas, imageSrc) {
        var _this = this;
        if (imageSrc === void 0) { imageSrc = "img/grass.jpg"; }
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
        this.canvas.addEventListener("drop", function (e) {
            e.preventDefault();
            _this.addImage(new CanvasImage(e.layerX - parseInt(e.dataTransfer.getData("x"), 10), e.layerY - parseInt(e.dataTransfer.getData("y"), 10), e.dataTransfer.getData("text")));
        }, false);
        this.canvas.addEventListener("dragover", function (e) { return e.preventDefault(); }, false);
        this.canvas.addEventListener("selectstart", function (e) {
            e.preventDefault();
            return false;
        }, false);
        this.canvas.addEventListener("mousedown", function (e) {
            if (!e.button) {
                var mx = e.layerX;
                var my = e.layerY;
                var l;
                l = _this.elements.length;
                for (var i = l - 1; i >= 0; i--) {
                    if (_this.elements[i].contains(mx, my)) {
                        if (_this.elements[i].type === "image") {
                            _this.drawX = mx - _this.elements[i].x;
                            _this.dragY = my - _this.elements[i].y;
                            _this.dragging = true;
                        }
                        else if (_this.elements[i].type === "line") {
                            document.getElementById("colour").value = _this.elements[i].lineColour;
                            document.getElementById("width").value = _this.elements[i].lineWidth.toString();
                        }
                        _this.selection = _this.elements[i];
                        _this.valid = false;
                        return;
                    }
                    else if (_this.elements[i].containsDelete(mx, my)) {
                        _this.elements.splice(i, 1);
                        _this.valid = false;
                        break;
                    }
                }
                if (_this.selection) {
                    _this.selection = null;
                    _this.valid = false; // Need to clear the old selection border
                }
                else {
                    if (!_this.drawing) {
                        _this.drawing = true;
                        _this.element = new CanvasLine(e.layerX, e.layerY, document.getElementById("colour").value, parseInt(document.getElementById("width").value, 10), document.getElementById("style").value);
                        _this.elements.push(_this.element);
                        _this.ctx.beginPath();
                        _this.ctx.moveTo(e.layerX, e.layerY);
                    }
                }
                _this.draw();
            }
        }, true);
        this.canvas.addEventListener('mousemove', function (e) {
            if (_this.dragging) {
                _this.selection.x = e.layerX - _this.drawX;
                _this.selection.y = e.layerY - _this.dragY;
                _this.valid = false;
            }
            else {
                if (_this.drawing) {
                    var lineWidth = parseInt(document.getElementById("width").value, 10);
                    var lineStyle = document.getElementById("style").value;
                    _this.element.points.push([e.layerX, e.layerY]);
                    _this.ctx.lineWidth = lineWidth;
                    _this.ctx.strokeStyle = document.getElementById("colour").value;
                    if (lineStyle === "solid") {
                        _this.ctx.setLineDash([]);
                    }
                    if (lineStyle === "dots") {
                        _this.ctx.setLineDash([lineWidth * 2, lineWidth * 2]);
                    }
                    if (lineStyle === "dashed") {
                        _this.ctx.setLineDash([lineWidth * 4, lineWidth * 2]);
                    }
                    _this.ctx.lineTo(e.layerX, e.layerY);
                    _this.ctx.stroke();
                }
            }
            _this.draw();
        }, true);
        this.canvas.addEventListener('mouseup', function (e) {
            _this.dragging = false;
            if (_this.drawing) {
                _this.drawing = false;
                _this.valid = false;
            }
            _this.draw();
        }, true);
        this.clear(true);
    }
    CanvasState.prototype.draw = function () {
        if (!this.valid) {
            this.clear(false);
            for (var i = 0; i < this.elements.length; i++) {
                var image = this.elements[i];
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
    };
    CanvasState.prototype.clear = function (firstRun) {
        var _this = this;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#ddd";
        this.ctx.fillRect(0, 0, this.width, this.height);
        var img = document.createElement("img");
        img.width = this.width;
        img.height = this.height;
        img.src = this.imageSrc;
        if (firstRun) {
            img.onload = function () {
                _this.ctx.drawImage(img, 0, 0);
            };
        }
        else {
            this.ctx.drawImage(img, 0, 0);
        }
    };
    CanvasState.prototype.addImage = function (image) {
        this.elements.push(image);
        this.selection = null;
        this.valid = false;
    };
    return CanvasState;
}());
