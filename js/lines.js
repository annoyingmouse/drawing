/**
 * Created by Dominic on 09/09/2016.
 */
var el = document.getElementById('canvas');
var ctx = el.getContext('2d');
var isDrawing;
var drawing = [];
var line = {};

el.onmousedown = function(e) {
    isDrawing = true;
    line.start = {
        x:e.layerX,
        y:e.layerY
    };
    line.points = [];
    ctx.moveTo(e.layerX, e.layerY);
};
el.onmousemove = function(e) {
    if (isDrawing) {
        line.points.push({
            x:e.layerX,
            y:e.layerY
        });
        ctx.lineTo(e.layerX, e.layerY);
        ctx.stroke();

    }
};
el.onmouseup = function() {
    isDrawing = false;
    drawing.push(line);
    line = {};
    console.log(drawing);
};

var lines = [
    {
        "start": {
            "x": 342,
            "y": 55
        },
        "points": [
            {
                "x": 343,
                "y": 55
            },
            {
                "x": 344,
                "y": 56
            },
            {
                "x": 346,
                "y": 59
            },
            {
                "x": 346,
                "y": 62
            },
            {
                "x": 349,
                "y": 69
            },
            {
                "x": 350,
                "y": 72
            },
            {
                "x": 351,
                "y": 75
            },
            {
                "x": 352,
                "y": 78
            },
            {
                "x": 354,
                "y": 84
            },
            {
                "x": 354,
                "y": 86
            },
            {
                "x": 354,
                "y": 91
            },
            {
                "x": 355,
                "y": 94
            },
            {
                "x": 355,
                "y": 97
            },
            {
                "x": 355,
                "y": 98
            },
            {
                "x": 356,
                "y": 100
            },
            {
                "x": 357,
                "y": 101
            }
        ],
        "iconWidth": 10
    },
    {
        "start": {
            "x": 799,
            "y": 105
        },
        "points": [
            {
                "x": 799,
                "y": 107
            },
            {
                "x": 796,
                "y": 111
            },
            {
                "x": 794,
                "y": 113
            },
            {
                "x": 793,
                "y": 115
            },
            {
                "x": 790,
                "y": 117
            },
            {
                "x": 788,
                "y": 121
            },
            {
                "x": 784,
                "y": 125
            },
            {
                "x": 777,
                "y": 131
            },
            {
                "x": 774,
                "y": 133
            },
            {
                "x": 774,
                "y": 134
            },
            {
                "x": 770,
                "y": 137
            },
            {
                "x": 766,
                "y": 138
            },
            {
                "x": 755,
                "y": 148
            },
            {
                "x": 753,
                "y": 149
            },
            {
                "x": 750,
                "y": 153
            },
            {
                "x": 746,
                "y": 154
            },
            {
                "x": 746,
                "y": 155
            },
            {
                "x": 744,
                "y": 156
            },
            {
                "x": 744,
                "y": 157
            },
            {
                "x": 743,
                "y": 157
            }
        ],
        "iconWidth": 10
    }
];
for(var i = 0; i < lines.length; i++){
    var l = lines[i];
    console.log(l);
    ctx.moveTo(l.start.x, l.start.y);
    for(var x = 0; x < l.points.length; x++){
        var p = l.points[x];
        console.log(p);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }
}