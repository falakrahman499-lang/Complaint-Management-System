

let complaints = [];

const complaintForm = document.getElementById("complaint-form");
const complaintList = document.getElementById("complaint-list");



async function handleComplaintSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("complaint-title").value.trim();
    const description = document.getElementById("complaint-description").value.trim();
    const category = document.getElementById("complaint-category").value;
    const priority = document.getElementById("complaint-priority").value;
    const status = document.getElementById("complaint-status").value;
    const date = document.getElementById("complaint-date").value;
    const locationName = document.getElementById("complaint-location").value.trim();
    const editingId = document.getElementById("editing-id").value;

    if (!title || !description || !category || !priority || !date || !locationName) {
        showToast("Please complete every field.", "error");
        return;
    }

    const submitButton = document.getElementById("submit-btn");
    submitButton.disabled = true;
    const location = await resolveLocation(locationName);
    submitButton.disabled = false;


    const nowIso = new Date().toISOString();
    if (editingId) {
        updateExistingComplaint(editingId, { title, description, category, priority, status, date, location, nowIso });
        showToast("Complaint updated.", "success");
    } else {
        createNewComplaint({ title, description, category, priority, status, date, location, nowIso });
        showToast("Complaint filed successfully.", "success");
    }

    saveComplaints();
    renderComplaints();
    updateStatistics();
    closeComplaintForm();
}
complaintForm.addEventListener("submit", handleComplaintSubmit);


function createNewComplaint({ title, description, category, priority, status, date, location, nowIso }) {
    complaints.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        complaintId: generateComplaintNumber(),
        title,
        description,
        category,
        priority,
        status,
        date,
        locationName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        createdAt: nowIso,
        updatedAt: nowIso
    });
}


function updateExistingComplaint(id, { title, description, category, priority, status, date, location, nowIso }) {
    const complaint = complaints.find(item => item.id === id);
    if (!complaint) return;

    complaint.title = title;
    complaint.description = description;
    complaint.category = category;
    complaint.priority = priority;
    complaint.status = status;
    complaint.date = date;
    complaint.locationName = location.name;
    complaint.latitude = location.latitude;
    complaint.longitude = location.longitude;
    complaint.updatedAt = nowIso;
}


function renderComplaints() {
    complaintList.innerHTML = "";

    const searchTerm = document.getElementById("search-complaint").value.trim().toLowerCase();
    const statusFilter = document.getElementById("filter-status").value;
    const categoryFilter = document.getElementById("filter-category").value;
    const priorityFilter = document.getElementById("filter-priority").value;
    const visibleComplaints = complaints
        .filter(complaint => matchesSearch(complaint, searchTerm))
        .filter(complaint => statusFilter === "all" || complaint.status === statusFilter)
        .filter(complaint => categoryFilter === "all" || complaint.category === categoryFilter)
        .filter(complaint => priorityFilter === "all" || complaint.priority === priorityFilter)
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
    if (visibleComplaints.length === 0) {
        complaintList.innerHTML = `
            <div class="md:col-span-2 border border-dashed border-line rounded-lg p-8 text-center text-ink-soft">
                <strong class="block text-ink mb-1">No matching complaints</strong>
                <span>File a new complaint or adjust your search/filters.</span>
            </div>`;
        return;
    }

    visibleComplaints.forEach(complaint => complaintList.appendChild(buildComplaintCard(complaint)));
}


function matchesSearch(complaint, searchTerm) {
    if (!searchTerm) return true;
    return `${complaint.title} ${complaint.complaintId}`.toLowerCase().includes(searchTerm);
}

const STATUS_CLASS = {
    "Pending": "status-pending",
    "In Progress": "status-progress",
    "Resolved": "status-resolved"
};




function buildComplaintCard(complaint) {
    const card = document.createElement("div");
    card.className = "complaint-card";
    card.dataset.priority = complaint.priority;


    const mapUrl = buildMapUrl(complaint.locationName, complaint.latitude, complaint.longitude);



    card.innerHTML = `
        <div class="flex items-start justify-between gap-2 flex-wrap">
            <div>
                <p class="text-xs font-mono text-ink-soft">${escapeHtml(complaint.complaintId)}</p>
                <h3 class="font-display font-bold">${escapeHtml(complaint.title)}</h3>
            </div>
            <span class="priority-tag priority-${complaint.priority.toLowerCase()}">${escapeHtml(complaint.priority)}</span>
        </div>
       

        <p class="text-sm text-ink-soft mt-2">${escapeHtml(complaint.category)} &middot; Filed ${formatDisplayDate(complaint.date)}</p>

        <p class="text-sm text-ink-soft mt-1">
            <a href="${mapUrl}" target="_blank" rel="noopener" class="underline hover:text-brand">${escapeHtml(complaint.locationName)}</a>
        </p>

        <div class="details hidden mt-3 text-sm border-t border-line pt-3" data-role="details">
            ${escapeHtml(complaint.description)}
        </div>



        <div class="flex items-center justify-between flex-wrap gap-2 mt-3 pt-3 border-t border-line">
            <select class="status-pill ${STATUS_CLASS[complaint.status]} border-0" data-action="status" data-id="${complaint.id}" aria-label="Change status for ${escapeHtml(complaint.title)}">
                <option value="Pending" ${complaint.status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="In Progress" ${complaint.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Resolved" ${complaint.status === "Resolved" ? "selected" : ""}>Resolved</option>
            </select>
            <div class="flex gap-3 text-sm">
                <button type="button" data-action="details" data-id="${complaint.id}" class="text-brand hover:underline">View details</button>
                <button type="button" data-action="edit" data-id="${complaint.id}" class="text-ink-soft hover:underline">Edit</button>
                <button type="button" data-action="delete" data-id="${complaint.id}" class="text-high hover:underline">Delete</button>
            </div>
        </div>
    `;

    return card;
}



function handleComplaintListClick(event) {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const { action, id } = actionButton.dataset;

    if (action === "details") {
        toggleComplaintDetails(actionButton);
    } else if (action === "edit") {
        openFormForEdit(id);
    } else if (action === "delete") {
        deleteComplaint(id);
    }
}


function handleComplaintListChange(event) {
    const statusSelect = event.target.closest('[data-action="status"]');
    if (!statusSelect) return;
    changeComplaintStatus(statusSelect.dataset.id, statusSelect.value);
}

complaintList.addEventListener("click", handleComplaintListClick);
complaintList.addEventListener("change", handleComplaintListChange);


function toggleComplaintDetails(button) {
    const card = button.closest(".complaint-card");
    const details = card.querySelector('[data-role="details"]');
    const isHidden = details.classList.toggle("hidden");
    button.textContent = isHidden ? "View details" : "Hide details";
}


function openFormForEdit(id) {
    const complaint = complaints.find(item => item.id === id);
    if (!complaint) return;

    document.getElementById("editing-id").value = complaint.id;
    document.getElementById("complaint-title").value = complaint.title;
    document.getElementById("complaint-description").value = complaint.description;
    document.getElementById("complaint-category").value = complaint.category;
    document.getElementById("complaint-priority").value = complaint.priority;
    document.getElementById("complaint-status").value = complaint.status;
    document.getElementById("complaint-date").value = complaint.date;
    document.getElementById("complaint-location").value = complaint.locationName;
    document.getElementById("location-preview").textContent = complaint.latitude !== null
        ? `📍 Previously resolved to (${complaint.latitude.toFixed(3)}, ${complaint.longitude.toFixed(3)})`
        : "";

    document.getElementById("form-heading").textContent = `Edit complaint ${complaint.complaintId}`;
    document.getElementById("submit-btn").textContent = "Update complaint";

    complaintFormPanel.classList.remove("hidden");
    document.getElementById("complaint-title").focus();
}


function deleteComplaint(id) {
    const complaint = complaints.find(item => item.id === id);
    if (!complaint) return;

    const confirmed = window.confirm(`Delete complaint ${complaint.complaintId} ("${complaint.title}")? This cannot be undone.`);
    if (!confirmed) return;

    complaints = complaints.filter(item => item.id !== id);
    saveComplaints();
    renderComplaints();
    updateStatistics();
    showToast("Complaint deleted.", "success");
}


function changeComplaintStatus(id, newStatus) {
    const complaint = complaints.find(item => item.id === id);
    if (!complaint) return;

    complaint.status = newStatus;
    complaint.updatedAt = new Date().toISOString();

    saveComplaints();
    renderComplaints();
    updateStatistics();
    showToast(`Status updated to "${newStatus}".`, "success");
}

["search-complaint", "filter-status", "filter-category", "filter-priority"].forEach(id =>
    document.getElementById(id).addEventListener("input", renderComplaints)
);
