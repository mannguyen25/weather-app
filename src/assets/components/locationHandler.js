const apiKey = "";
const locationHandler = async (latitude, longitude) => {
	const query = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
	try {
		const response = await fetch(query, { mode: "cors" });
		const data = await response.json();
		return data;
	} catch (error) {
		alert(error);
	}
};

export default locationHandler;
