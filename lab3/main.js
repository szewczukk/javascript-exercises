const KeyToSound = {
	a: document.querySelector('#s1'),
	s: document.querySelector('#s2'),
	d: document.querySelector('#s3'),
	f: document.querySelector('#s4'),
	g: document.querySelector('#s5'),
	h: document.querySelector('#s6'),
	j: document.querySelector('#s7'),
	k: document.querySelector('#s8'),
	l: document.querySelector('#s9'),
};

let channels = [
	{
		id: 0,
		activated: true,
		sounds: [
			{ id: 0, key: 'a' },
			{ id: 1, key: 's' },
			{ id: 2, key: 'd' },
		],
	},
];
let currentChannel = undefined;

function onKeyPress(event) {
	const sound = KeyToSound[event.key];
	if (!sound) {
		return;
	}

	playSound(sound);

	if (currentChannel) {
		currentChannel.sounds.push({
			id: currentChannel.sounds.length,
			key: event.key,
		});
	}
	rebuildChannelList();
}

function playSound(sound) {
	sound.currentTime = 0;
	sound.play();
}

function rebuildChannelList() {
	const newChannels = [];
	for (const channel of channels) {
		const channelDiv = document.createElement('div');
		channelDiv.textContent = `Channel #${channel.id}`;

		const soundList = document.createElement('div');

		for (const sound of channel.sounds) {
			soundList.textContent += sound.key;
		}

		channelDiv.appendChild(soundList);

		const recordButton = document.createElement('button');
		if (currentChannel === undefined || currentChannel !== channel) {
			recordButton.textContent = 'Record';
		} else {
			recordButton.textContent = 'Stop';
		}

		recordButton.addEventListener('click', function () {
			if (currentChannel === undefined) {
				currentChannel = channel;
				this.textContent = 'Stop';
			} else {
				currentChannel = undefined;
				this.textContent = 'Record';
			}
		});

		channelDiv.appendChild(recordButton);

		const playButton = document.createElement('button');
		playButton.textContent = 'Play';

		playButton.addEventListener('click', () => {
			for (const sound of channel.sounds) {
				setTimeout(() => {
					playSound(KeyToSound[sound.key]);
				}, sound.id * 1000);
			}
		});

		channelDiv.appendChild(playButton);

		const removeChannelButton = document.createElement('button');
		removeChannelButton.textContent = 'Delete';

		removeChannelButton.addEventListener('click', () => {
			channels = channels.filter((ch) => ch.id !== channel.id);

			rebuildChannelList();
		});

		channelDiv.appendChild(removeChannelButton);

		const clearButton = document.createElement('button');
		clearButton.textContent = 'Clear';

		clearButton.addEventListener('click', () => {
			channel.sounds = [];

			rebuildChannelList();
		});

		channelDiv.appendChild(clearButton);

		const stateButton = document.createElement('button');
		if (channel.activated) {
			stateButton.textContent = 'On';
		} else {
			stateButton.textContent = 'Off';
		}

		stateButton.addEventListener('click', () => {
			channel.activated = !channel.activated;

			rebuildChannelList();
		});

		channelDiv.appendChild(stateButton);

		newChannels.push(channelDiv);
	}

	channelsContainer.replaceChildren(...newChannels);
}

const channelsContainer = document.querySelector('#channels');
const newChannelButton = document.querySelector('#new-channel');
const playAllButton = document.querySelector('#play-all');

newChannelButton.addEventListener('click', () => {
	channels.push({ id: channels.length, sounds: [], activated: true });

	rebuildChannelList();
});

playAllButton.addEventListener('click', () => {
	console.log(channels);
	for (const channel of channels.filter((ch) => ch.activated)) {
		for (const sound of channel.sounds) {
			setTimeout(() => {
				playSound(KeyToSound[sound.key]);
			}, sound.id * 1000);
		}
	}
});

document.addEventListener('keypress', onKeyPress);

rebuildChannelList();
