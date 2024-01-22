class Ball {
	constructor() {
		this.posX = Math.random() * 790;
		this.posY = Math.random() * 590;

		this.directionX = Math.random() * 2 - 1;
		this.directionY = Math.random() * 2 - 1;
	}

	/** @param ctx {CanvasRenderingContext2D} */
	render(ctx) {
		this.posX += this.directionX;
		this.posY += this.directionY;

		if (this.posX <= 5 || this.posX >= 795) {
			this.directionX *= -1;
		}

		if (this.posY <= 5 || this.posY >= 590) {
			this.directionY *= -1;
		}

		this.connectBalls();

		ctx.beginPath();
		ctx.arc(this.posX, this.posY, 5, 0, Math.PI * 2, true);

		ctx.fillStyle = 'red';
		ctx.fill();
	}

	connectBalls() {
		for (const ball of balls) {
			if (ball === this) {
				return;
			}

			if (this.distance(ball) < distance) {
				ctx.beginPath();
				ctx.moveTo(this.posX, this.posY);
				ctx.lineTo(ball.posX, ball.posY);
				ctx.fillStyle = 'black';
				ctx.stroke();
			}
		}
	}

	distance(otherBall) {
		return Math.sqrt(
			Math.pow(otherBall.posX - this.posX, 2) +
				Math.pow(otherBall.posY - this.posY, 2),
		);
	}
}

/** @type{HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');

const startButton = document.querySelector('#start');
const restartButton = document.querySelector('#reset');

const distanceRange = document.querySelector('#distance');

const ctx = canvas.getContext('2d');

/** @type{Ball[]} */
let balls = [];
let distance = 50;
let state = 'paused';

function restart() {
	balls = [];
	for (let i = 0; i < 50; i++) {
		balls.push(new Ball());
	}
}

function draw() {
	ctx.clearRect(0, 0, 800, 600);

	for (const ball of balls) {
		ball.render(ctx);
	}

	if (state === 'running') {
		requestAnimationFrame(draw);
	}
}

restart();
draw();

startButton.addEventListener('click', function () {
	if (state === 'running') {
		state = 'paused';
		this.textContent = 'Start';
		return;
	}

	state = 'running';
	requestAnimationFrame(draw);

	this.textContent = 'Pause';
});

restartButton.addEventListener('click', () => {
	state = 'paused';
	startButton.textContent = 'Start';

	restart();
	draw();
});

distanceRange.addEventListener('input', function () {
	distance = this.value;
});

canvas.addEventListener('click', function (e) {
	const mousePos = { posX: e.offsetX, posY: e.offsetY };

	const clickedBalls = balls.filter((ball) => {
		return ball.distance(mousePos) <= 5;
	});

	if (clickedBalls.length === 0) {
		return;
	}

	for (const ball of clickedBalls) {
		balls = balls.filter((b) => b !== ball);
	}

	for (let i = 0; i < 2; i++) {
		balls.push(new Ball());
	}
});
