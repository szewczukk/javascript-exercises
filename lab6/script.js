class Ball {
	/** @param balls {Ball[]} */
	constructor(balls) {
		this.balls = balls;

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

		for (const ball of this.balls) {
			const d = Math.sqrt(
				Math.pow(ball.posX - this.posX, 2) + Math.pow(ball.posY - this.posY, 2),
			);

			if (d < 75) {
				ctx.beginPath();
				ctx.moveTo(this.posX, this.posY);
				ctx.lineTo(ball.posX, ball.posY);
				ctx.fillStyle = 'black';
				ctx.stroke();
			}
		}

		ctx.beginPath();
		ctx.arc(this.posX, this.posY, 5, 0, Math.PI * 2, true);

		ctx.fillStyle = 'red';
		ctx.fill();
	}
}

/** @type{HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');

const ctx = canvas.getContext('2d');

const balls = [];

for (let i = 0; i < 50; i++) {
	balls.push(new Ball(balls));
}

function draw() {
	ctx.clearRect(0, 0, 800, 600);

	for (const ball of balls) {
		ball.render(ctx);
	}

	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
