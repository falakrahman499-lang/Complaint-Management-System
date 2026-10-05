# Complaint Management System

A responsive browser-based complaint tracking application for creating, organizing, and managing complaints from a single dashboard.

## Features

- Create, edit, and delete complaints
- Assign categories, priorities, dates, and statuses
- Track Pending, In Progress, and Resolved complaints
- Search complaints by title or complaint ID
- Filter complaints by status, category, and priority
- View complaint details without leaving the dashboard
- Resolve submitted locations through the Open-Meteo Geocoding API
- Open complaint locations in OpenStreetMap
- Persist complaint data in the browser with `localStorage`
- Responsive interface for desktop and mobile screens

## Live Demo

This project is a static frontend and can be hosted with GitHub Pages, Netlify, Vercel, or any static web server.

## Getting Started

### Prerequisites

- A modern web browser
- An optional local static server for development

### Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/<your-repository>.git
   cd Complaint_Management_System
   ```

2. Start the project with any static server. For example, with VS Code Live Server, open `index.html` and choose **Open with Live Server**.

3. Open the displayed local URL in your browser.

The application does not require a build step, package installation, backend server, or environment variables.

## Usage

1. Select **New complaint**.
2. Enter the complaint title, description, category, priority, date, and location.
3. Select **Locate** to resolve the location and preview its coordinates.
4. Select **Submit complaint**.
5. Use the search bar and filters to find complaints.
6. Update a complaint's status directly from its card, or use **Edit** to change its information.
7. Select **Delete** to remove a complaint after confirmation.

## Location Services

Location lookup uses the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api). The service does not require an API key for this project. Resolved locations are displayed with coordinates and linked to [OpenStreetMap](https://www.openstreetmap.org/).

If a location cannot be resolved, the complaint can still be saved using the location text entered by the user.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- [Tailwind CSS CDN](https://tailwindcss.com/)
- Browser `localStorage`
- Open-Meteo Geocoding API
- OpenStreetMap links

## Project Structure

```text
.
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── complaints.js
│   ├── location.js
│   ├── stats.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
├── .gitignore
├── index.html
└── README.md
```

## Data Storage

Complaint data is stored locally in the browser under the `complaintManagementSystem` `localStorage` key. Data is tied to the browser and device being used; it is not synchronized between users or devices.

Clearing browser site data will remove locally stored complaints.

## Browser Support

The application works in current versions of Chrome, Edge, Firefox, and Safari.

## License

This project is available for personal and educational use. Add a license file to the repository if you plan to distribute or reuse it under specific terms.
