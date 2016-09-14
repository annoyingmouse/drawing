/**
 * Created by Dominic on 10/09/2016.
 */
class CanvasElement {
    x: number;
    y: number;
    iconWidth: number;
    type: string;
    points: number[][];

    constructor(x: number, y: number, iconWidth: number = 10) {
        this.x = x;
        this.y = y;
        this.iconWidth = iconWidth;
    }

    draw(ctx: CanvasRenderingContext2D){
        console.log("Drawing the element");
    }

    contains(mx: number, my: number, ctx?: CanvasRenderingContext2D){
        console.log("Check to see if mouse click is contained within element");
    }

    containsDelete(mx: number, my: number){
        console.log("Check to see if mouse click is contained within the element delete icon");
    }

    setSelected(ctx: CanvasRenderingContext2D){
        console.log("Setting selected element");
    }
}
