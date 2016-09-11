/**
 * Created by Dominic on 03/09/2016.
 */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("x", ev.layerX);
    ev.dataTransfer.setData("y", ev.layerY);
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev) {
    ev.preventDefault();
    s.addImage(new CanvasImage(ev.layerX - ev.dataTransfer.getData("x"), ev.layerY - ev.dataTransfer.getData("y"), ev.dataTransfer.getData("text")));
}
(function() {
    window.s = new CanvasState(document.getElementById('canvas'), "img/pitch.jpg");
})();
