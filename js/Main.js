/**
 * Created by Dominic on 21/09/2016.
 */
/// <reference path="CanvasState.ts" />
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("x", ev.layerX);
    ev.dataTransfer.setData("y", ev.layerY);
}
(function () {
    var s = new CanvasState(document.getElementById('canvas'), "img/pitch.jpg");
    // let images : NodeListOf<Element> = document.querySelectorAll(".moveable");
    //
    // //var elementList = document.querySelectorAll(".moveable");
    // console.log(images);
    // for(let i in images){
    //     if(typeof images[i] === "object"){
    //         images[i].addEventListener("dragstart", (e)=>{
    //             console.log((e as DragEvent));
    //             // (e as DragEvent).dataTransfer.setData("text", (e as DragEvent).target.id);
    //             // (e as DragEvent).dataTransfer.setData("x", e.layerX);
    //             // (e as DragEvent).dataTransfer.setData("y", e.layerY);
    //
    //         });
    //     }
    // }
})();
