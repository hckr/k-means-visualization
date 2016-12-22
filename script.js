let canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d');

let dataPoints = [],
    centroids = [];

let colors = [
    '#ED0A3F',
    '#0095B7',
    '#33CC99',
    '#00468C',
    '#0066FF',
    '#EE34D2',
    '#C88A65',
    '#A50B5E',
    '#733380',
    '#87421F'
]

let drawDataPoint = function([x, y]) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

let drawCentroid = function([x, y]) {
    ctx.save()
        ctx.beginPath();
        ctx.save()
            ctx.lineWidth = 2;
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    ctx.restore();
}

let redrawAll = function() {
    canvas.width = canvas.width;
    dataPoints.map(drawDataPoint);
    centroids.map(drawCentroid);
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

let pointClickedOnCanvas = function(e) {
    let canvasRect = canvas.getBoundingClientRect();
    return [
        e.clientX - canvasRect.left - 1,
        e.clientY - canvasRect.top - 1
    ];
};

let addAndDrawNewCentroid = function(point) {
    if (centroids.length >= colors.length) {
        alert(`Sorry, reached limit of ${colors.length} colors.`);
        return false;
    }
    centroids.push(point);
    ctx.save();
        ctx.strokeStyle = ctx.fillStyle = colors[centroids.length - 1]
        drawCentroid(point);
    ctx.restore();
    return true;
}

canvas.addEventListener('click', function(e) {
    let newPoint = pointClickedOnCanvas(e);
    if (addingDataPointsManually) {
        dataPoints.push(newPoint)
        drawDataPoint(newPoint);
    } else if (addingCentroidsManually) {
        addAndDrawNewCentroid(newPoint);
    }
}, false);

let randInt = function(min, max) {
    if (arguments.length == 1) {
        max = arguments[0];
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById('add-data-points-randomly').addEventListener('click', function() {
    let count = +document.getElementById('add-data-points-randomly-count').value;
    for (let i = 0; i < count; ++i) {
        let newPoint;
        do {
            newPoint = [
                randInt(0, canvas.width - 1),
                randInt(0, canvas.height - 1)
            ];
        } while (newPoint in centroids);
        dataPoints.push(newPoint);
        drawDataPoint(newPoint);
    }
}, false);

document.getElementById('add-centroids-randomly').addEventListener('click', function() {
    let count = +document.getElementById('add-centroids-randomly-count').value;
    for (let i = 0; i < count; ++i) {
        let newPoint;
        do {
            newPoint = [
                randInt(0, canvas.width - 1),
                randInt(0, canvas.height - 1)
            ];
        } while (newPoint in centroids);
        if(!addAndDrawNewCentroid(newPoint))
            return;
    }
}, false);
