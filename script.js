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

let buttonAddDataPointsManually = document.getElementById('add-data-points-manually'),
    buttonAddCentroidsManually = document.getElementById('add-centroids-manually');

let toggleButtonText = function(button) {
    let currentText = button.innerHTML;
    button.innerHTML = button.getAttribute('data-toggle');
    button.setAttribute('data-toggle', currentText);
}

let updateCanvasStyles = function() {
    if (addingDataPointsManually || addingCentroidsManually) {
        canvas.classList.add('canvas-picking-active');
    } else {
        canvas.classList.remove('canvas-picking-active');
    }
}

let toggleAddingDataPointsManually = function() {
    if (addingCentroidsManually) {
        toggleAddingCentroidsManually();
    }
    addingDataPointsManually = !addingDataPointsManually;
    toggleButtonText(buttonAddDataPointsManually);
    updateCanvasStyles();
}

let toggleAddingCentroidsManually = function() {
    if (addingDataPointsManually) {
        toggleAddingDataPointsManually();
    }
    addingCentroidsManually = !addingCentroidsManually;
    toggleButtonText(buttonAddCentroidsManually);
    updateCanvasStyles();
}

buttonAddDataPointsManually.addEventListener('click', toggleAddingDataPointsManually, false);
buttonAddCentroidsManually.addEventListener('click', toggleAddingCentroidsManually, false);
