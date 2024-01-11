const notes = ['Note #1', 'Note #2'];

const asideFilter = document.querySelector('#aside__filter');
const asideList = document.querySelector('.aside__list');

for (const note of notes) {
	const item = document.createElement('li');

	item.textContent = note;

	asideList.appendChild(item);
}

asideFilter.addEventListener('input', (e) => {
	const newNotes = [];
	const filter = e.target.value;
	const filteredNotes = notes.filter((note) => note.includes(filter));

	for (const note of filteredNotes) {
		const item = document.createElement('li');

		item.textContent = note;

		newNotes.push(item);
	}

	asideList.replaceChildren(...newNotes);
});
