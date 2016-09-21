/**
 * Created by Dominic on 03/09/2016.
 */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("x", ev.layerX);
    ev.dataTransfer.setData("y", ev.layerY);
}
(function() {
    window.s = new CanvasState(document.getElementById('canvas'), "img/pitch.jpg");
})();
