const button = document.querySelector('#button');
const wrapper = document.querySelector('#wrapper');
const min = document.querySelector('#min');
const max = document.querySelector('#max');
const sum = document.querySelector('#sum');
const mean = document.querySelector('#mean');

const values = new Map();

function inputListener() {
	values.set(this.id, this.value);

	const currValues = [...values.values()];
	const sumValue = currValues.reduce((acc, curr) => acc + parseInt(curr), 0);

	min.innerHTML = Math.min(...currValues);
	max.innerHTML = Math.max(...currValues);
	sum.innerHTML = sumValue;
	mean.innerHTML = sumValue / currValues.length;
}

for (const child of wrapper.children) {
	child.addEventListener('change', inputListener);
}

button.addEventListener('click', function () {
	const newInput = document.createElement('input');
	newInput.type = 'number';
	newInput.id = values.size;
	newInput.addEventListener('change', inputListener);
	wrapper.appendChild(newInput);
});
