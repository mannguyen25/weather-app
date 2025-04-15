import "../src/assets/styles/styles.css";
import "../src/assets/styles/header.css";
import "../src/assets/styles/body.css";

import weatherHandler from "./assets/components/weatherHandler";
import locationHandler from "./assets/components/locationHandler";

function screenController() {
	const searchbar = document.getElementById("searchbar");
	const searchInput = document.getElementById("search");
	const clearSearch = document.getElementById("clear-icon");
	const tempUnit = document.getElementById("temp-unit");
	const loader = document.querySelector(".loader");
	const main = document.getElementById("content");
	const iconConverter = {
		"clear-night": "bedtime",
		rain: "rainy",
		"partly-cloudy-day": "partly_cloudy_day",
		"partly-cloudy-night": "partly_cloudy_night",
		"clear-day": "clear_day",
		cloudy: "cloud",
	};
	// listen for clear button search
	clearSearch.addEventListener("click", () => {
		searchInput.value = "";
		clearSearch.classList.remove("active");
		loader.classList.remove("hide");
		main.classList.remove("active");
	});
	// activate clear button search
	searchbar.addEventListener("input", (e) => {
		clearSearch.classList.toggle("active", e.target.value !== "");
	});
	// listen for clear button search
	searchbar.addEventListener("submit", async (e) => {
		e.preventDefault();
		loader.classList.remove("hide");
		main.classList.remove("active");
		const location = searchInput.value;
		if (location !== "") {
			const data = await weatherHandler(
				location,
				tempUnit.checked ? "metric" : "us"
			);
			searchInput.value = "";
			updateScreen(data);
		}
	});
	async function updateScreen(data) {
		try {
			const locationObject = await locationHandler(
				data.latitude,
				data.longitude
			);
			const cityName = locationObject.results[0].address_components.find(
				({types}) =>
					types.includes("postal_town") ||
					(types.includes("locality") &&
						types.includes("political"))
			).long_name;
			const currentHour = new Date(Date.now()).getHours();
            // 1. populate my location container
            // 2. populate hourly container
            // 3. populate 10-day forecase
			updateMyLocation(data.days[0], cityName, currentHour);
			createHourlyCards(
				data.days[0].hours.concat(data.days[1].hours),
				currentHour,
				data.days[0].description
			);
			createDayCards(data.days);
			loader.classList.add("hide");
			main.classList.add("active");
			return;
		} catch (error) {
			alert(error);
		}
	}
	function updateMyLocation(data, cityName, currentHour) {
		const currentLocation = document.getElementById("my-current-location");
		const currentTemp = document.getElementById("my-current-temp");
		const currentDesc = document.getElementById("my-current-description");
		const currentMax = document.getElementById("my-current-high");
		const currentMin = document.getElementById("my-current-low");
		const currentTime = data.hours.find(
			(hour) => Number(hour.datetime.split(":")[0]) == currentHour
		);
		currentLocation.textContent = cityName;
		currentTemp.textContent = Math.round(currentTime.temp);
		currentDesc.textContent = currentTime.icon
			.split("-")
			.slice(0, 2)
			.join(" ");
		currentMax.textContent = `H:${Math.round(data.tempmax)}`;
		currentMin.textContent = `L:${Math.round(data.tempmin)}`;
	}
	function createHourlyCards(days, currentHour, description) {
		const hourTemplate = document.querySelector(
			"[data-hour-card-template]"
		);
		const hourlyContainer = document.getElementById(
			"hourly-weather-container"
		);
		const dailyDescription = document.getElementById("daily-description");
		dailyDescription.textContent = description;
		// remove previous cards except template
		while (hourlyContainer.childElementCount > 1) {
			hourlyContainer.removeChild(hourlyContainer.lastChild);
		}
		// filter 24hr period
		const hours = days.slice(currentHour, currentHour + 24);

		hours.forEach((hour, index) => {
			const card = hourTemplate.content.cloneNode(true);
			const time = card.querySelector("[data-time]");
			const icon = card.querySelector("[data-icon]");
			const temp = card.querySelector("[data-temp]");
			const dateTime = Number(hour.datetime.split(":")[0]);
			const suffix = dateTime >= 12 ? "PM" : "AM";
			time.textContent =
				index == 0
					? "Now"
					: dateTime % 12 != 0
					? `${dateTime % 12}${suffix}`
					: `12${suffix}`;
			temp.textContent = Math.round(hour.temp);
			icon.textContent = iconConverter[hour.icon];
			if (hour.icon == "clear-day") icon.classList.add("clear_day");
			hourlyContainer.appendChild(card);
		});
	}
	function createDayCards(days) {
		const dayCardContainer = document.getElementById("day-card-container");
		// remove previous cards except template
		while (dayCardContainer.childElementCount > 1) {
			dayCardContainer.removeChild(dayCardContainer.lastChild);
		}
		const dayTemplate = document.querySelector("[data-day-card-template]");
		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		days.forEach((day, index) => {
			const dateTime = daysOfWeek[new Date(day.datetime).getDay()];
			const card = dayTemplate.content.cloneNode(true);
			const date = card.querySelector("[data-date]");
			const icon = card.querySelector("[data-date-icon]");
			const min = card.querySelector(".min-temp");
			const max = card.querySelector(".max-temp");
			const point = card.querySelector(".indicator");
			date.textContent = index == 0 ? "Today" : dateTime;
			icon.textContent = iconConverter[day.icon];
			if (day.icon == "clear-day") icon.classList.add("clear_day");
			min.textContent = Math.round(day.tempmin);
			max.textContent = Math.round(day.tempmax);
			point.style.left = `${Math.round(
				((day.temp - day.tempmin) / (day.tempmax - day.tempmin)) * 100
			)}%`;
			dayCardContainer.appendChild(card);
		});
	}
}
screenController();
