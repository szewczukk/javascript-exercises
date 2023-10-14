const slides = document.querySelector('.slides');
const stopButton = document.querySelector('.stop');
const controls = document.querySelector('.controls');
const nextButton = document.querySelector('.next');
const previousButton = document.querySelector('.previous');
const identifier = document.querySelector('#identifier');

let currentSlide = 1;
let stopped = false;
let ref;

function updateSlide(prevSlide, currentSlide) {
	slides.classList.remove(`slide${prevSlide}`);
	slides.classList.add(`slide${currentSlide}`);

	identifier.textContent = currentSlide;
}

function nextSlide() {
	const prevSlide = currentSlide;
	currentSlide++;
	if (currentSlide > 6) {
		currentSlide = 1;
	}

	updateSlide(prevSlide, currentSlide);
}

function previousSlide() {
	const prevSlide = currentSlide;
	currentSlide--;
	if (currentSlide === 0) {
		currentSlide = 6;
	}

	updateSlide(prevSlide, currentSlide);
}

function carousel() {
	ref = setInterval(nextSlide, 3000);
}

function stopCarousel() {
	clearInterval(ref);
	stopped = true;
	stopButton.textContent = 'play';
}

carousel();

stopButton.addEventListener('click', () => {
	if (!stopped) {
		stopCarousel();
		return;
	}
	carousel();
	stopButton.textContent = 'stop';
});

[...controls.children].forEach((control, index) => {
	control.addEventListener('click', () => {
		for (let i = 0; i < 6; i++) {
			slides.classList.remove(`slide${i}`);
		}

		updateSlide(0, index);
		stopCarousel();
	});
});

nextButton.addEventListener('click', () => {
	stopCarousel();
	nextSlide();
});

previousButton.addEventListener('click', () => {
	stopCarousel();
	previousSlide();
});
