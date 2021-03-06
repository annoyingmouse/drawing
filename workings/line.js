/*
 * Given the image above, the JSON describes the line shown: it starts at x = 6 and y = 7, then the virtual pen moves to
 * x = 12 and y = 17 and through each of the other points until it reaches the last point (x = 23 and y = 29), these
 * points are the red shaded points on the image. After the last coordinate the virtual pen is put down and the virtual
 * line is stroked with a pen that's 2 units wide.
 *
 * I'm trying to capture any interactions in the shaded pen area of the line. So, for instance, if the point where x = 6
 * and y = 5 was chosen the chosen action wouldn't be triggered. If, on the other hand, the point where x = 9 and y = 11
 * was chosen the action would be triggered.
*/
var line = {
    "x": 6,
    "y": 7,
    "points": [
        [12, 17],
        [24, 21],
        [35, 16],
        [39, 8],
        [45, 13],
        [41, 25],
        [23, 29]
    ]
};