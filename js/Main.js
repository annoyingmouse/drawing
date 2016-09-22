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
})();
