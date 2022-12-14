const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Upper left and lower right points of box.
const screenWidth = screen.width;
const screenHeight = screen.height;
var canvasWidth = Math.min(screenWidth / 2, screenHeight / 2);
if (canvasWidth < 300) {
    canvasWidth = Math.min(screenWidth, screenHeight);
}
const x0 = 20, y0 = 20, x1 = canvasWidth, y1 = canvasWidth;

canvas.setAttribute('width', x0 + x1);
canvas.setAttribute('height', y0 + y1);

const boxWidth = x1 - x0;
const boxHeight = y1 - y0;

// Global configuration

// Second box sizes
const secondBoxHeight = 20;
const secondBoxWidth = 6;

// Breathing box
const inhaleSeconds = 4;
const holdInhaleSeconds = 4;
const exhaleSeconds = 6;
const holdExhaleSeconds = 2;
const totalSeconds = inhaleSeconds + holdInhaleSeconds + exhaleSeconds + holdExhaleSeconds;

const numberOfBoxCycles = 10;
const displayRemaining = 2; // Show remaining cycles after each displayRemaining cycles.
const helpBreaths = 3;

function drawBox() {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x0, y1);
    ctx.lineTo(x0, y0);
    ctx.stroke();
}

function drawSecondBox(px, py, orientation, time) {
    if (orientation == 'Horizontal') {
        ctx.fillRect(
            px - secondBoxWidth/2,
            py - time*secondBoxHeight/2,
            secondBoxWidth,
            time*secondBoxHeight
        );
    } else if (orientation == 'Vertical') {
        ctx.fillRect(
            px - time*secondBoxHeight/2,
            py - secondBoxWidth/2,
            time*secondBoxHeight,
            secondBoxWidth,
        );
    }
}

function drawBreath(startx, starty, orientation, numberOfBreaths, time) {
    var secondOrientation, xDistancePerSecondBox, yDistancePerSecondBox;

    if (orientation == 'Right') {
        secondOrientation = 'Horizontal';
        xDistancePerSecondBox = boxWidth / (numberOfBreaths + 1);
        yDistancePerSecondBox = 0;
    } else if (orientation == 'Down') {
        secondOrientation = 'Vertical';
        xDistancePerSecondBox = 0;
        yDistancePerSecondBox = boxHeight / (numberOfBreaths + 1);
    } else if (orientation == 'Left') {
        secondOrientation = 'Horizontal';
        xDistancePerSecondBox = -boxWidth / (numberOfBreaths + 1);
        yDistancePerSecondBox = 0;
    } else if (orientation == 'Up') {
        secondOrientation = 'Vertical';
        xDistancePerSecondBox = 0;
        yDistancePerSecondBox = -boxHeight / (numberOfBreaths + 1);
    }

    [...Array(numberOfBreaths).keys()].map((i) => {
        if (i <= time - 1) {
            drawSecondBox(
                startx + (i + 1)*xDistancePerSecondBox,
                starty + (i + 1)*yDistancePerSecondBox,
                secondOrientation,
                1.0
            );
        } else if (0 <= time - i && time - i <= 1.0) {
            drawSecondBox(
                startx + (i + 1)*xDistancePerSecondBox,
                starty + (i + 1)*yDistancePerSecondBox,
                secondOrientation,
                time - i
            );
        }
    });
}

function hideBreath(startx, starty, orientation, numberOfBreaths, time) {
    var secondOrientation, xDistancePerSecondBox, yDistancePerSecondBox;

    if (orientation == 'Right') {
        secondOrientation = 'Horizontal';
        xDistancePerSecondBox = boxWidth / (numberOfBreaths + 1);
        yDistancePerSecondBox = 0;
    } else if (orientation == 'Down') {
        secondOrientation = 'Vertical';
        xDistancePerSecondBox = 0;
        yDistancePerSecondBox = boxHeight / (numberOfBreaths + 1);
    } else if (orientation == 'Left') {
        secondOrientation = 'Horizontal';
        xDistancePerSecondBox = -boxWidth / (numberOfBreaths + 1);
        yDistancePerSecondBox = 0;
    } else if (orientation == 'Up') {
        secondOrientation = 'Vertical';
        xDistancePerSecondBox = 0;
        yDistancePerSecondBox = -boxHeight / (numberOfBreaths + 1);
    }

    [...Array(numberOfBreaths).keys()].map((i) => {
        drawSecondBox(
            startx + (i + 1)*xDistancePerSecondBox,
            starty + (i + 1)*yDistancePerSecondBox,
            secondOrientation,
            1.0 - time,
        );
    });
}

function writeTextFade(text, opacity) {
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    if (opacity < 1.0) {
        ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    }
    ctx.fillText(text, x0 + boxWidth/2, y0 + boxHeight/2 + 5);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
};

function writeText(text) {
    writeTextFade(text, 1.0);
};

function finalLoop(time) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawBox();

    const seconds = time/1000 % totalSeconds;
    if (seconds <= 1) {
        writeTextFade('Congratulations', seconds);
        hideBreath(
            x1, y1, 'Left', holdExhaleSeconds, seconds
        );
    } else if (seconds <= 2) {
        writeTextFade('Congratulations', 2 - seconds);
    } else if (seconds <= 3) {
        writeTextFade('Done', seconds - 2);
    } else {
        writeText('Done');
        return;
    }

    requestAnimationFrame(finalLoop);
}

function renderLoop(time) {
    const numberOfBreaths = Math.floor(time/1000/totalSeconds);
    const remaining = numberOfBoxCycles - numberOfBreaths;

    if (remaining == 0) {
        requestAnimationFrame(finalLoop);
        return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawBox();

    const seconds = time/1000 % totalSeconds;

    if (0 <= seconds & seconds <= inhaleSeconds) {
        if (numberOfBreaths < helpBreaths) {
            writeText('Inhale', seconds);
        } else if (remaining == 1) {
            if (seconds < inhaleSeconds - 1) {
                writeTextFade('Last one', seconds);
            } else {
                writeTextFade('Last one', inhaleSeconds - seconds);
            }
        } else if (remaining % displayRemaining == 0) {
            if (seconds < inhaleSeconds - 1) {
                writeTextFade(remaining + ' left', seconds);
            } else {
                writeTextFade(remaining + ' left', inhaleSeconds - seconds);
            }
        }

        if (numberOfBreaths > 0) {
            hideBreath(
                x1, y1, 'Left', holdExhaleSeconds, seconds/inhaleSeconds
            );
        }
        drawBreath(
            x0, y1, 'Up', inhaleSeconds, seconds
        );
    } else if (inhaleSeconds <= seconds && seconds <= inhaleSeconds + holdInhaleSeconds) {
        if (numberOfBreaths < helpBreaths) {
            writeText('Hold');
        }

        hideBreath(
            x0, y1, 'Up', inhaleSeconds, (seconds - inhaleSeconds)/holdInhaleSeconds
        );
        drawBreath(
            x0, y0, 'Right', holdInhaleSeconds, seconds - inhaleSeconds
        );
    } else if (inhaleSeconds + holdInhaleSeconds <= seconds
            && seconds <= inhaleSeconds + holdInhaleSeconds + exhaleSeconds) {
        if (numberOfBreaths < helpBreaths) {
            writeText('Exhale');
        }
        hideBreath(
            x0, y0, 'Right', holdInhaleSeconds, (seconds - inhaleSeconds - holdInhaleSeconds)/exhaleSeconds
        );
        drawBreath(
            x1, y0, 'Down', exhaleSeconds, seconds - inhaleSeconds - holdInhaleSeconds
        );
    } else {
        if (numberOfBreaths < helpBreaths) {
            if (numberOfBreaths + 1 == helpBreaths && seconds > totalSeconds - 1) {
                writeTextFade('Hold', totalSeconds - seconds);
            } else {
                writeText('Hold');
            }
        }
        hideBreath(
            x1, y0, 'Down', exhaleSeconds, (seconds - inhaleSeconds - holdInhaleSeconds - exhaleSeconds)/holdExhaleSeconds
        );
        drawBreath(
            x1, y1, 'Left', holdExhaleSeconds, seconds - inhaleSeconds - holdInhaleSeconds - exhaleSeconds
        );
    }

    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
