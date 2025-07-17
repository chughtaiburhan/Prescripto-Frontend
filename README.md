# Prescripto Frontend

## Overview
This is the frontend for the Prescripto platform, a modern healthcare appointment and doctor discovery web application. It is built with React and provides a seamless user experience for patients to find doctors, book appointments, and manage their profiles.

## Features
- Doctor discovery by specialty
- User registration and login
- Email verification
- Profile management
- Appointment booking and cancellation
- Responsive, modern UI
- Integration with backend APIs

## Folder Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, icons, and static JS assets
│   ├── component/         # Reusable React components
│   ├── pages/             # Page-level React components
│   ├── utils/             # Utility functions
│   ├── context/           # React context providers
│   ├── index.css          # Global styles
│   └── main.jsx           # App entry point
├── package.json           # Project metadata and dependencies
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:5173` by default.

## Tech Stack
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Toastify

## Environment Variables
Create a `.env` file in the root with:
```
VITE_BACKEND_URL=<your-backend-url>
```

## Deployment
- Build for production:
  ```bash
  npm run build
  ```
- Deploy the `dist/` folder to your preferred static hosting (Vercel, Netlify, etc.)

## How to Contribute
1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

## Contact
For questions or support, open an issue or contact the maintainer.

---

### GitHub Short Description
> Modern React frontend for Prescripto: doctor discovery, appointment booking, and patient profile management.
