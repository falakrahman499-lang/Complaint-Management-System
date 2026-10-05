

const STORAGE_KEY = "complaintManagementSystem";


function saveComplaints() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}


function loadComplaints() {
    const storedComplaints = localStorage.getItem(STORAGE_KEY);

    if (!storedComplaints) {
        complaints = [];
        return;
    }

    try {
        const parsed = JSON.parse(storedComplaints);
        complaints = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        complaints = [];
        console.error("Could not load saved complaints.", error);
    }
}
