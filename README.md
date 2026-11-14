# Pharmacy Tracker UI

A React frontend dashboard built with **Vite** that connects to the [PharmacyTrackerApi](https://github.com/KimS-WT/PharmacyTrackerApi) to view patient records, add prescriptions, and process refills in real time.

## Tech Stack
* **Framework:** React (JavaScript)
* **Build Tool:** Vite
* **API Communication:** Fetch API (`GET`, `POST`, `PUT`)

## Features
* **Patient & Medication Dashboard:** Fetches and displays patient profiles alongside their active prescriptions (`GET /api/Patients`).
* **One-Click Refill Processing:** Sends `PUT /api/Prescriptions/{id}/refill` requests and displays real-time validation error banners when no refills remain.
* **Prescription Entry Form:** Submits new prescriptions linked to existing patient IDs (`POST /api/Prescriptions`).

## Quick Start
1. **Start the Backend API first:** Ensure `PharmacyTrackerApi` is running on `http://localhost:5029`.
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run the Frontend:**
   ```bash
   npm run dev
   ```
4. **Open in Browser:** Navigate to `http://localhost:5173`.
