# SOS Monitor — Emergency Tracking System

Emergency SOS Alert System using HTML, CSS, JavaScript and Firebase for real-time alert notifications. It is designed to act as an interface for hardware devices that trigger SOS alerts.

## Features
- **Live Monitoring:** Real-time updates with visual indicators for "Safe" and "Accident" statuses.
- **Summary Statistics:** View total users, safe counts, and accident counts at a glance.
- **Search & Filtering:** Filter users by status or search by phone number/name.
- **Demo Mode:** Built-in demo panel to test adding safe users, triggering SOS alerts, and removing users without needing actual hardware connected.
- **Detailed View:** Click on any user to view detailed information including Device ID and Signal Strength.

## Getting Started
Since this is a frontend-only application using HTML, CSS, and JavaScript, no complex setup is required.

1. Clone the repository.
2. Open `index.html` in your favorite web browser.

## API Integration (Hardware)
The system is designed to be connected to a backend that receives data from hardware devices. To connect your hardware:
- Endpoint: `POST /api/update`
- Body: `{ phone: string, status: "SAFE" | "ACCIDENT", deviceId: string, signal: string }`

*(Note: The backend endpoint needs to be implemented separately to accept these requests and update the data source that this dashboard reads from).*
