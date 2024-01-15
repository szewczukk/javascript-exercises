if (!localStorage.getItem('store')) {
	localStorage.setItem(
		'store',
		JSON.stringify([
			{
				id: crypto.randomUUID(),
				title: 'Note #1',
				body: 'Hello from Note #1',
				date: new Date().toString(),
				pinned: false,
				tags: [],
				color: 'red',
				todos: [],
			},
			{
				id: crypto.randomUUID(),
				title: 'Note #2',
				body: 'Hello from Note #2',
				date: new Date().toString(),
				pinned: false,
				tags: [],
				color: 'red',
				todos: [],
			},
		]),
	);
}

let notesStore = JSON.parse(localStorage.getItem('store'));
let focusedNote = notesStore[0];

const asideFilter = document.querySelector('#aside__filter');
const asideList = document.querySelector('.aside__list');
const noteEditable = document.querySelector('.note');
const noteDetailsDate = document.querySelector('.noteDetails__date');
const newNoteButton = document.querySelector('#aside__newNote');
const deleteNoteButton = document.querySelector('#noteDetails__delete');
const pinNoteButton = document.querySelector('#noteDetails__pin');
const noteDetailsTitle = document.querySelector('#noteDetails__title');
const noteDetailsColor = document.querySelector('#noteDetails__color');

const tagList = document.querySelector('#noteDetails__tags__list');
const tagInput = document.querySelector('#noteDetails__tags__input');
const tagButton = document.querySelector('#noteDetails__tags__button');

const todoList = document.querySelector('#noteDetails__todos__list');
const todoInput = document.querySelector('#noteDetails__todos__input');
const todoButton = document.querySelector('#noteDetails__todos__button');

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

	updateNote();
	noteEditable.focus();
}

function updateAsideItems(notes) {
	const items = [];

	for (const note of notes) {
		const item = document.createElement('li');
		item.classList.add('aside__item');
		item.setAttribute('id', note.id);
		item.addEventListener('click', itemOnClick);

		item.textContent = note.title;

		if (note === focusedNote) {
			item.classList.add('aside__item--focused');
		}

		items.push(item);
	}

	asideList.replaceChildren(...items);
}

function updateNote() {
	noteDetailsTitle.value = focusedNote.title;
	noteEditable.innerHTML = focusedNote.body;
	noteDetailsColor.value = focusedNote.color;
	noteDetailsDate.textContent = new Date(focusedNote.date).toLocaleString();

	if (focusedNote.pinned) {
		pinNoteButton.textContent = 'Unpin note';
	} else {
		pinNoteButton.textContent = 'Pin note';
	}

	const tags = [];
	for (const tag of focusedNote.tags) {
		const element = document.createElement('li');
		element.textContent = tag;

		tags.push(element);
	}

	const todos = [];

	const sortedTodos = focusedNote.todos.sort((a, b) => {
		if (a.completed) {
			return -1;
		}

		if (b.completed) {
			return 1;
		}

		return 0;
	});

	for (const todo of sortedTodos) {
		const element = document.createElement('li');
		element.textContent = todo.title;

		if (todo.completed) {
			element.classList.add('noteDetails__todos__list__element--completed');
		}

		const todoButton = document.createElement('button');

		if (todo.completed) {
			todoButton.textContent = 'Redo';
		} else {
			todoButton.textContent = 'Complete';
		}

		todoButton.addEventListener('click', function () {
			const t = focusedNote.todos.find((t) => t.id === todo.id);

			t.completed = !t.completed;

			updateNote();
		});

		element.appendChild(todoButton);

		todos.push(element);
	}

	tagList.replaceChildren(...tags);
	todoList.replaceChildren(...todos);
}

asideFilter.addEventListener('input', (e) => {
	const filter = e.target.value;
	const filteredNotes = notesStore.filter((note) => {
		if (note.title.includes(filter)) {
			return true;
		}

		const date = new Date(note.date).toLocaleString();
		if (date.includes(filter)) {
			return true;
		}

		if (note.body.includes(filter)) {
			return true;
		}

		if (note.tags.includes(filter)) {
			return true;
		}

		if (note.color === filter) {
			return true;
		}

		return false;
	});

	updateAsideItems(filteredNotes);
});

noteEditable.addEventListener('input', (e) => {
	focusedNote.body = e.target.innerHTML;
	saveNotesToLocalStorage();
});

newNoteButton.addEventListener('click', () => {
	notesStore.push({
		id: crypto.randomUUID(),
		title: 'New Note',
		body: '',
		date: new Date().toString(),
		pinned: false,
		tags: [],
		color: 'red',
		todos: [],
	});

	updateAsideItems(notesStore);
	saveNotesToLocalStorage();
});

deleteNoteButton.addEventListener('click', () => {
	notesStore = notesStore.filter((note) => note !== focusedNote);
	focusedNote = notesStore[0];

	updateAsideItems(notesStore);
	saveNotesToLocalStorage();
	updateNote();
});

pinNoteButton.addEventListener('click', function () {
	focusedNote.pinned = !focusedNote.pinned;

	notesStore.sort((a, b) => {
		if (a.pinned) {
			return -1;
		}

		if (b.pinned) {
			return 1;
		}

		return 0;
	});

	updateAsideItems(notesStore);
	saveNotesToLocalStorage();
	updateNote();
});

noteDetailsTitle.addEventListener('input', (e) => {
	focusedNote.title = e.target.value;

	updateAsideItems(notesStore);
	saveNotesToLocalStorage();
	updateNote();
});

tagButton.addEventListener('click', () => {
	const tag = tagInput.value;
	if (!tag.length) {
		return;
	}

	focusedNote.tags.push(`#${tag}`);
	tagInput.value = '';

	saveNotesToLocalStorage();
	updateNote();
});

noteDetailsColor.addEventListener('change', (e) => {
	focusedNote.color = e.target.value;

	saveNotesToLocalStorage();
});

todoButton.addEventListener('click', () => {
	const todoTitle = todoInput.value;

	focusedNote.todos.push({
		id: crypto.randomUUID(),
		title: todoTitle,
		completed: false,
	});

	todoTitle.value = '';

	updateNote();
	saveNotesToLocalStorage();
});

updateAsideItems(notesStore);
updateNote();
noteEditable.focus();
