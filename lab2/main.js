const slides = document.querySelector('.slides');
const stopButton = document.querySelector('.stop');

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

carousel();

stopButton.addEventListener('click', () => {
	if (!stopped) {
		clearInterval(ref);
		stopped = true;
		return;
	}

	carousel();
});
