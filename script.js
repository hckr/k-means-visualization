let canvas = document.getElementsByTagName('canvas')[0],
    ctx = canvas.getContext('2d');

let dataPoints = [],
    centroids = [],
    dataPointsAssignedCentroids = {}; // { dataPointIndex: centroidIndex }

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

let drawDataPoint = function([x, y], index) {
    ctx.save();
        ctx.fillStyle = colors[dataPointsAssignedCentroids[index]];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    ctx.restore();
}

let drawCentroid = function([x, y], index) {
    ctx.save()
        ctx.strokeStyle = ctx.fillStyle = colors[index];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.save();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
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
    if (!addingCentroidsManually && isCentroidLimitReached()) {
        showCentroidLimitReachedMessage();
        return;
    }
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

let isCentroidLimitReached = () => centroids.length >= colors.length;

let tryAddNewCentroid = function(point) {
    if (isCentroidLimitReached()) {
        return false;
    }
    centroids.push(point);
    return true;
}

let showCentroidLimitReachedMessage = function() {
    // using timeout to show alert after canvas is refreshed
    setTimeout(() => alert(`Sorry, reached limit of ${colors.length} colors.`), 10);
}

canvas.addEventListener('click', function(e) {
    let newPoint = pointClickedOnCanvas(e);
    if (addingDataPointsManually) {
        dataPoints.push(newPoint);
    } else if (addingCentroidsManually) {
        if (!tryAddNewCentroid(newPoint)) {
            showCentroidLimitReachedMessage();
            toggleAddingCentroidsManually();
        }
    }
    redrawAll();
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
    }
    redrawAll();
}, false);

document.getElementById('add-centroids-randomly').addEventListener('click', function() {
    let count = +document.getElementById('add-centroids-randomly-count').value,
        limitReached = false;
    for (let i = 0; i < count; ++i) {
        let newPoint;
        do {
            newPoint = [
                randInt(0, canvas.width - 1),
                randInt(0, canvas.height - 1)
            ];
        } while (newPoint in centroids);
        if (!tryAddNewCentroid(newPoint)) {
            limitReached = true;
            break;
        }
    }
    redrawAll();
    if (limitReached) {
        showCentroidLimitReachedMessage();
    }
}, false);

document.getElementById('remove-all-data-points').addEventListener('click', function() {
    dataPoints = [];
    dataPointsAssignedCentroids = {};
    redrawAll();
}, false);

document.getElementById('remove-all-centroids').addEventListener('click', function() {
    centroids = [];
    dataPointsAssignedCentroids = {};
    redrawAll();
}, false);

let distance = (point1, point2) => {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
};

let reassignDataPoints = function() {
    dataPoints.map((point, pointIndex) => {
        let smallestDistance = Number.MAX_SAFE_INTEGER,
            closestCentroidIndex = undefined;
        centroids.map((centroid, centroidIndex) => {
            let dist = distance(point, centroid);
            if (dist < smallestDistance) {
                smallestDistance = dist;
                closestCentroidIndex = centroidIndex;
            }
        });
        dataPointsAssignedCentroids[pointIndex] = closestCentroidIndex;
    });
    redrawAll();
};
document.getElementById('reassign-data-points').addEventListener('click', reassignDataPoints, false);

let updateCentroidsPositions = function() {
    centroids.map((centroid, centroidIndex) => {
        let assignedPoints = dataPoints.filter((_, pointIndex) => dataPointsAssignedCentroids[pointIndex] == centroidIndex),
            sumX = 0,
            sumY = 0;
        if (assignedPoints.length == 0)
            return;
        assignedPoints.map(([x, y]) => {
            sumX += x;
            sumY += y;
        });
        centroid[0] = sumX / assignedPoints.length;
        centroid[1] = sumY / assignedPoints.length;
    });
    redrawAll();
};
document.getElementById('update-centroids-positions').addEventListener('click', updateCentroidsPositions, false);

let steps = [
        reassignDataPoints,
        updateCentroidsPositions
    ],
    currentStep,
    nextAfter,
    timeout,
    loopRunning = false;

let enqueNextStep = function(overrideAfter) {
    let delay = overrideAfter != undefined ? overrideAfter : nextAfter;
    timeout = setTimeout(() => {
        steps[currentStep]();
        currentStep = (currentStep + 1) % steps.length;
        enqueNextStep();
    }, delay);
};

document.getElementById('run-steps-in-loop').addEventListener('click', function() {
    toggleButtonText(this);
    if (!loopRunning) {
        loopRunning = true;
        currentStep = 0;
        nextAfter = +document.getElementById('run-steps-in-loop-milliseconds').value;
        if (isNaN(nextAfter) || nextAfter <= 0) {
            alert('Wrong value!');
            return;
        }
        enqueNextStep(0);
    } else {
        clearTimeout(timeout);
        loopRunning = false;
    }
}, false);
