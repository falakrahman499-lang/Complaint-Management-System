

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

let lastResolvedLocation = { name: "", latitude: null, longitude: null, displayName: "" };


async function resolveLocation(locationName) {
    const trimmedName = locationName.trim();
    if (!trimmedName) {
        return { name: "", latitude: null, longitude: null, displayName: "" };
    }
    if (lastResolvedLocation.name.toLowerCase() === trimmedName.toLowerCase()
        && lastResolvedLocation.latitude !== null) {
        return lastResolvedLocation;
    }
    try {
        const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmedName)}&count=1&language=en&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Geocoding request failed with status ${response.status}`);
        }
        const data = await response.json();
        const match = data.results?.[0];

        if (!match) {
            lastResolvedLocation = { name: trimmedName, latitude: null, longitude: null, displayName: "" };
            return lastResolvedLocation;
        }
        lastResolvedLocation = {
            name: trimmedName,
            latitude: match.latitude,
            longitude: match.longitude,
            displayName: [match.name, match.admin1, match.country].filter(Boolean).join(", ")
        };
        return lastResolvedLocation;
    } catch (error) {
        console.error("Could not resolve location.", error);
        return { name: trimmedName, latitude: null, longitude: null, displayName: "" };
    }
}


function buildMapUrl(locationName, latitude, longitude) {
    if (latitude !== null && longitude !== null) {
        return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
    }
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(locationName)}`;
}



const locateButton = document.getElementById("locate-btn");
const locationInput = document.getElementById("complaint-location");
const locationPreview = document.getElementById("location-preview");

async function handleLocateClick() {
    const typedLocation = locationInput.value.trim();
    if (!typedLocation) {
        showToast("Type a location first.", "error");
        return;
    }

    locateButton.disabled = true;
    locateButton.textContent = "Locating...";
    locationPreview.textContent = "";

    const result = await resolveLocation(typedLocation);

    if (result.latitude !== null) {
        locationPreview.textContent = `📍 ${result.displayName} (${result.latitude.toFixed(3)}, ${result.longitude.toFixed(3)})`;
    } else {
        locationPreview.textContent = "Could not find that location. The complaint can still be saved with the text as typed.";
    }

    locateButton.disabled = false;
    locateButton.textContent = "Locate";
}
locateButton.addEventListener("click", handleLocateClick);
