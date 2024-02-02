const newCityForm = document.querySelector('#new_city_form');
const newCityInput = document.querySelector('#new_city_input');
const citiesContainer = document.querySelector('#cities');

const API_KEY = prompt('Enter you API key:');
const CACHE_LIVESPAN = 5 * 60 * 1000;
const MAX_CITIES = 10;

async function fetchWeatherData(cityName) {
	const reponse = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`,
	);
	const data = await reponse.json();

	return {
		id: crypto.randomUUID(),
		name: data.name,
		temp: data.main.temp,
		humidity: data.main.humidity,
		icon: data.weather[0].icon,
		timestamp: Date.now(),
	};
}

async function cacheWeatherData(data) {
	const cache = JSON.parse(localStorage.getItem('cached')) || [];

	localStorage.setItem('cached', JSON.stringify([...cache, data]));

	return data;
}

async function retrieveCachedOrFetchWeatherData(cityName) {
	const cached = JSON.parse(localStorage.getItem('cached'));

	if (!cached || cached.length === 0) {
		const cityData = await fetchWeatherData(cityName);
		cacheWeatherData(cityData);

		return cityData;
	}

	const cachedCity = cached.filter((city) => city.name === cityName);
	if (!cachedCity || cachedCity.length === 0) {
		const cityData = await fetchWeatherData(cityName);
		cacheWeatherData(cityData);

		return cityData;
	}

	if (Date.now() - cachedCity.timestamp > CACHE_LIVESPAN) {
		const cityData = await fetchWeatherData(cityName);
		cacheWeatherData(cityData);

		return cityData;
	}

	return cachedCity;
}

async function removeCity(cityId) {
	const cache = JSON.parse(localStorage.getItem('cached'));
	localStorage.setItem(
		'cached',
		JSON.stringify(cache.filter((city) => city.id !== cityId)),
	);

	await loadWeatherData();
}

function buildNewCity(cityData) {
	const city = document.createElement('div');
	city.classList.add('city');

	const cityNameParagraph = document.createElement('p');
	cityNameParagraph.classList.add('city__name');
	cityNameParagraph.textContent = cityData.name;

	const temperatureParagraph = document.createElement('p');
	temperatureParagraph.classList.add('city__temperature');
	temperatureParagraph.textContent = cityData.temp;

	const humidityParagraph = document.createElement('p');
	humidityParagraph.classList.add('city__humidity');
	humidityParagraph.textContent = cityData.humidity;

	const weatherIcon = document.createElement('img');
	weatherIcon.classList.add('city__weather_icon');
	weatherIcon.src = `https://openweathermap.org/img/wn/${cityData.icon}.png`;

	const timeFetchedParagraph = document.createElement('p');
	timeFetchedParagraph.textContent = `Time fetched: ${new Date(
		cityData.timestamp,
	).toLocaleTimeString()}`;

	const removeCityButton = document.createElement('button');
	removeCityButton.textContent = 'Remove city';
	removeCityButton.addEventListener('click', () => removeCity(cityData.id));

	city.appendChild(cityNameParagraph);
	city.appendChild(temperatureParagraph);
	city.appendChild(humidityParagraph);
	city.appendChild(weatherIcon);
	city.appendChild(timeFetchedParagraph);
	city.appendChild(removeCityButton);

	citiesContainer.appendChild(city);
}

newCityForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	if (citiesContainer.children.length >= MAX_CITIES) {
		alert('Cities limit reached!');
		return;
	}

	const newCityName = newCityInput.value;

	const cityData = await retrieveCachedOrFetchWeatherData(newCityName);

	buildNewCity(cityData);
});

async function loadWeatherData() {
	citiesContainer.innerHTML = '';
	const cache = JSON.parse(localStorage.getItem('cached'));

	if (!cache) {
		return;
	}

	for (const city of cache) {
		if (Date.now() - city.timestamp > CACHE_LIVESPAN) {
			buildNewCity(await fetchWeatherData(city.name));
		} else {
			buildNewCity(city);
		}
	}
}

loadWeatherData();
