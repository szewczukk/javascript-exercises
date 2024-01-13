if (!localStorage.getItem('store')) {
	localStorage.setItem(
		'store',
		JSON.stringify([
			{
				id: crypto.randomUUID(),
				title: 'Note #1',
				body: 'Hello from Note #1',
				date: new Date().toString(),
			},
			{
				id: crypto.randomUUID(),
				title: 'Note #2',
				body: 'Hello from Note #2',
				date: new Date().toString(),
			},
		]),
	);
}

const notesStore = JSON.parse(localStorage.getItem('store'));
let focusedNote = notesStore[0];

const asideFilter = document.querySelector('#aside__filter');
const asideList = document.querySelector('.aside__list');
const noteEditable = document.querySelector('.note__editable');

function saveNotesToLocalStorage() {
	localStorage.setItem('store', JSON.stringify(notesStore));
}

function itemOnClick(e) {
	const items = document.querySelectorAll('.aside__item');
	for (const secondItem of items) {
		if (secondItem.getAttribute('id') === focusedNote.id) {
			secondItem.classList.remove('aside__item--focused');
		}
	}

	e.target.classList.add('aside__item--focused');
	focusedNote = notesStore.find((n) => n.id === e.target.getAttribute('id'));

	noteEditable.innerHTML = focusedNote.body;
}

function updateAsideItems(notes) {
	const items = [];

	for (const note of notes) {
		const item = document.createElement('li');
		item.classList.add('aside__item');
		item.setAttribute('id', note.id);
		item.addEventListener('click', itemOnClick);

		item.textContent = `${note.title} (${new Date(note.date).toDateString()})`;

		if (note === focusedNote) {
			item.classList.add('aside__item--focused');
		}

		items.push(item);
	}

	asideList.replaceChildren(...items);
}

updateAsideItems(notesStore);
noteEditable.innerHTML = focusedNote.body;

asideFilter.addEventListener('input', (e) => {
	const filter = e.target.value;
	const filteredNotes = notesStore.filter((note) =>
		note.title.includes(filter),
	);

	updateAsideItems(filteredNotes);
});

noteEditable.addEventListener('input', (e) => {
	focusedNote.body = e.target.innerHTML;
	saveNotesToLocalStorage();
});

noteEditable.focus();
