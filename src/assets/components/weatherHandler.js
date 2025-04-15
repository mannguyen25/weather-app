const apiKey = "";
const weatherHandler = async (location, unit = "us") => {
	const query = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next9days?unitGroup=${unit}&key=${apiKey}&include=hours,days&elements=datetime,temp,tempmax,tempmin,feelslike,description,precip,icon`;
	try {
		const response = await fetch(query, { mode: "cors" });
		const data = await response.json();
		return data;
	} catch (error) {
		alert(error);
	}
};

export default weatherHandler;
