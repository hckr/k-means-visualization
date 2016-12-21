let canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d');

let points = [];

let randInt = function(min, max) {
    if (arguments.length == 1) {
        max = arguments[0];
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let drawPoints = () => {
    canvas.width = canvas.width;
    for (let point of points) {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
        ctx.fill();
        console.log(point);
    }
}

let addingDataPointsManually = false,
    addingCentroidsManually = false;

let toggleButtonText = function(button) {
    let currentText = button.innerHTML;
    button.innerHTML = button.getAttribute('data-toggle');
    button.setAttribute('data-toggle', currentText);
}

document.getElementById('add-data-points-manually').addEventListener('click', function() {
    addingDataPointsManually = !addingDataPointsManually;
    toggleButtonText(this);
}, false);

document.getElementById('add-centroids-manually').addEventListener('click', function() {
    addingCentroidsManually = !addingCentroidsManually;
    toggleButtonText(this);
}, false);
