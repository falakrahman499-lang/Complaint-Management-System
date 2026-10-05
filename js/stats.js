 

const statTotalElement = document.getElementById("stat-total");
const statPendingElement = document.getElementById("stat-pending");
const statInProgressElement = document.getElementById("stat-inprogress");
const statResolvedElement = document.getElementById("stat-resolved");


function updateStatistics() {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === "Pending").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    statTotalElement.textContent = total;
    statPendingElement.textContent = pending;
    statInProgressElement.textContent = inProgress;
    statResolvedElement.textContent = resolved;
}