

let toastTimeout;


function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = type;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.remove(), 2800);
}

const complaintFormPanel = document.getElementById("complaint-form-panel");
const newComplaintButton = document.getElementById("new-complaint-btn");
const cancelFormButton = document.getElementById("cancel-form-btn");


function openFormForNewComplaint() {
    resetComplaintForm();
    document.getElementById("form-heading").textContent = "File a complaint";
    document.getElementById("submit-btn").textContent = "Submit complaint";
    document.getElementById("complaint-date").value = todayAsIsoDate();
    complaintFormPanel.classList.remove("hidden");
    document.getElementById("complaint-title").focus();
}


function closeComplaintForm() {
    complaintFormPanel.classList.add("hidden");
    resetComplaintForm();
}


function resetComplaintForm() {
    document.getElementById("complaint-form").reset();
    document.getElementById("editing-id").value = "";
    document.getElementById("location-preview").textContent = "";
}

newComplaintButton.addEventListener("click", openFormForNewComplaint);
cancelFormButton.addEventListener("click", closeComplaintForm);
