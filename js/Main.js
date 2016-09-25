/**
 * Created by Dominic on 21/09/2016.
 */
/// <reference path="CanvasState.ts" />
(function () {
    var canvas = new CanvasState(document.getElementById('canvas'), "img/pitch.jpg");
    var images = document.querySelectorAll(".moveable");
    for (var i = 0; i < images.length; i++) {
        images[i].addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text", e.target.id);
            e.dataTransfer.setData("x", e.layerX.toString());
            e.dataTransfer.setData("y", e.layerY.toString());
        }, false);
    }
    document.getElementById("colour").addEventListener("change", function (e) {
        canvas.handleColourChange(e.target.value);
    }, false);
    document.getElementById("width").addEventListener("change", function (e) {
        canvas.handleWidthChange(parseInt(e.target.value, 10));
    }, false);
    document.getElementById("style").addEventListener("change", function (e) {
        canvas.handleStyleChange(e.target.value);
    }, false);
    document.getElementById("arrow").addEventListener("change", function (e) {
        canvas.handleArrowChange(e.target.value);
    }, false);
    document.addEventListener("keydown", function (e) {
        var key = e.keyCode || e.charCode;
        if (key === 46) {
            canvas.handleDelete();
        }
    }, false);
})();
