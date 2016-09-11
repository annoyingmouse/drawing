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
        this.images = [];
        this.lines = [];
        this.dragging = false;
        this.selection = null;
        this.drawX = 0;
        this.dragY = 0;
        this.selectionColor = "#000";
        this.selectionWidth = 1;
        this.imageSrc = imageSrc;
        this.canvas.addEventListener('selectstart', function (e) {
            e.preventDefault();
            return false;
        }, false);
        this.canvas.addEventListener('mousedown', function (e) {
            var mx = e.layerX;
            var my = e.layerY;
            var l = _this.images.length;
            for (var i = l - 1; i >= 0; i--) {
                if (_this.images[i].contains(mx, my)) {
                    var mySel = _this.images[i];
                    _this.drawX = mx - mySel.x;
                    _this.dragY = my - mySel.y;
                    _this.dragging = true;
                    _this.selection = mySel;
                    _this.valid = false;
                    return;
                }
                else if (_this.images[i].containsDelete(mx, my)) {
                    _this.images.splice(i, 1);
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
                    _this.line = new CanvasLine(e.layerX, e.layerY);
                    _this.lines.push(_this.line);
                    _this.ctx.moveTo(e.layerX, e.layerY);
                }
            }
            _this.draw();
        }, true);
        this.canvas.addEventListener('mousemove', function (e) {
            if (_this.dragging) {
                _this.selection.x = e.layerX - _this.drawX;
                _this.selection.y = e.layerY - _this.dragY;
                _this.valid = false;
            }
            else {
                if (_this.drawing) {
                    _this.line.points.push([e.layerX, e.layerY]);
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
        var _this = this;
        if (!this.valid) {
            this.clear(false);
            for (var i = 0; i < this.images.length; i++) {
                var image = this.images[i];
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
                var lineStyle = "\n                    fill: none;\n                    fill-rule: evenodd;\n                    stroke: #000000;\n                    stroke-width: 2;\n                    stroke-linecap: round;\n                    stroke-linejoin: miter;\n                    stroke-opacity: 1;\n                    stroke-miterlimit: 4;";
                var iconDimensions = 10;
                var data = "\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"" + iconDimensions + "\" width=\"" + iconDimensions + "\">\n                        <path d=\"M 1.5,1.5 8.5,8.5\" style=\"" + lineStyle + "\" />\n                        <path d=\"M 1.5,8.5 8.5,1.5\" style=\"" + lineStyle + "\" />\n                    </svg>";
                var img = new Image();
                var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
                var url = URL.createObjectURL(svg);
                img.onload = function () {
                    _this.ctx.drawImage(img, mySel.x + mySel.w, mySel.y - 10);
                    URL.revokeObjectURL(url);
                };
                img.src = url;
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
        this.images.push(image);
        this.selection = null;
        this.valid = false;
    };
    return CanvasState;
}());