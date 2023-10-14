const slides = document.querySelector('.slides');
const stopButton = document.querySelector('.stop');
const controls = document.querySelector('.controls');

let currentSlide = 1;
let stopped = false;
let ref;

function carousel() {
	ref = setInterval(() => {
		const prevSlide = currentSlide;
		currentSlide++;
		if (currentSlide > 6) {
			currentSlide = 1;
		}

		slides.classList.remove(`slide${prevSlide}`);
		slides.classList.add(`slide${currentSlide}`);
	}, 3000);
}

function stopCarousel() {
	if (!stopped) {
		clearInterval(ref);
		stopped = true;
		stopButton.textContent = 'play';
		return;
	}

	carousel();
	stopButton.textContent = 'stop';
}

carousel();

stopButton.addEventListener('click', stopCarousel);

[...controls.children].forEach((control, index) => {
	control.addEventListener('click', () => {
		for (let i = 0; i < 6; i++) {
			slides.classList.remove(`slide${i}`);
		}

		slides.classList.add(`slide${index}`);
		stopCarousel();
	});
});
