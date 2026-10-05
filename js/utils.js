


function escapeHtml(value) {
    const charactersToEscape = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    };
    return String(value).replace(/[&<>'"]/g, character => charactersToEscape[character]);
}


function generateComplaintNumber() {
    const timePart = Date.now().toString(36).toUpperCase().slice(-4);
    const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `CMP-${timePart}-${randomPart}`;
}


function formatDisplayDate(isoDateString) {
    if (!isoDateString) return "—";
    const date = new Date(`${isoDateString}T00:00:00`);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}


function todayAsIsoDate() {
    return new Date().toISOString().split("T")[0];
}
