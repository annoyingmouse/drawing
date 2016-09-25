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
        this.background = document.createElement("img");
        this.background.width = this.width;
        this.background.height = this.height;
        this.background.src = imageSrc;
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
                var l = _this.elements.length;
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
                    _this.valid = false;
                }
                else {
                    if (!_this.drawing) {
                        _this.drawing = true;
                        _this.element = new CanvasLine(e.layerX, e.layerY, document.getElementById("colour").value, parseInt(document.getElementById("width").value, 10), document.getElementById("style").value, document.getElementById("arrow").value);
                        var lineWidth = parseInt(document.getElementById("width").value, 10);
                        _this.ctx.lineWidth = lineWidth;
                        _this.ctx.strokeStyle = document.getElementById("colour").value;
                        _this.ctx.setLineDash(getLineDash(document.getElementById("style").value, lineWidth));
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
                    _this.element.points.push([e.layerX, e.layerY]);
                    _this.ctx.lineTo(e.layerX, e.layerY);
                    _this.ctx.stroke();
                }
            }
            _this.draw();
        }, true);
        this.canvas.addEventListener('mouseup', function () {
            _this.dragging = false;
            if (_this.drawing) {
                if (_this.element.points.length > 1) {
                    _this.elements.push(_this.element);
                }
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
        if (firstRun) {
            this.background.onload = function () {
                _this.ctx.drawImage(_this.background, 0, 0);
            };
        }
        else {
            this.ctx.drawImage(this.background, 0, 0);
        }
    };
    CanvasState.prototype.addImage = function (image) {
        this.elements.push(image);
        this.selection = null;
        this.valid = false;
    };
    CanvasState.prototype.setInvalid = function () {
        this.valid = false;
        this.draw();
    };
    CanvasState.prototype.handleColourChange = function (colour) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeColour(this, colour);
        }
    };
    CanvasState.prototype.handleWidthChange = function (width) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeWidth(this, width);
        }
    };
    CanvasState.prototype.handleStyleChange = function (style) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeStyle(this, style);
        }
    };
    CanvasState.prototype.handleArrowChange = function (arrow) {
        if (this.selection && this.selection.type === "line") {
            this.selection.changeArrow(this, arrow);
        }
    };
    CanvasState.prototype.handleDelete = function () {
        if (this.selection) {
            var l = this.elements.length;
            for (var i = l - 1; i >= 0; i--) {
                if (this.elements[i] === this.selection) {
                    this.elements.splice(i, 1);
                    this.selection = null;
                    this.setInvalid();
                    break;
                }
            }
        }
    };
    return CanvasState;
}());
function getLineDash(type, width) {
    var lineTypes = {
        "solid": function () {
            return [0, 0];
        },
        "dots": function () {
            return [width * 2, width * 2];
        },
        "dashed": function () {
            return [width * 4, width * 2];
        }
    };
    return (lineTypes[type] || lineTypes["solid"])();
}
