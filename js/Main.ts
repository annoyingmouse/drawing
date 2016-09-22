/**
 * Created by Dominic on 21/09/2016.
 */
/// <reference path="CanvasState.ts" />
(function () {
    let canvas = new CanvasState(<HTMLCanvasElement>document.getElementById('canvas'), "img/pitch.jpg");
    let images: NodeListOf<Element> = document.querySelectorAll(".moveable");
    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener("dragstart", (e)=> {
            (e as DragEvent).dataTransfer.setData("text", (<HTMLImageElement>(e as DragEvent).target).id);
            (e as DragEvent).dataTransfer.setData("x", (e as DragEvent).layerX.toString());
            (e as DragEvent).dataTransfer.setData("y", (e as DragEvent).layerY.toString());
        }, false);
    }
    document.getElementById("colour").addEventListener("change", (e)=> {
        canvas.handleColourChange((<HTMLSelectElement>e.target).value);
    }, false);
})();