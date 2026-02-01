# Travel Admin Panel

React-based admin panel for managing hotels, bookings, and categories.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your Firebase API Key in `src/pages/Auth.jsx`:
```javascript
const FIREBASE_API_KEY = 'YOUR_FIREBASE_API_KEY';
```

3. Update Firebase database URLs in all pages:
```javascript
https://your-firebase-db.firebaseio.com
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

- Admin authentication (Login & SignUp)
- Add, edit, and delete hotel listings
- Manage hotel categories
- View and manage bookings
- Image upload support

## File Structure

```
src/
├── pages/
│   ├── Auth.jsx           # Login/SignUp page
│   ├── Home.jsx           # Dashboard
│   ├── ManageListings.jsx # Add/Edit/Delete listings
│   └── Bookings.jsx       # Booking management
├── styles/
│   ├── Auth.css
│   ├── Home.css
│   ├── ManageListings.css
│   └── Bookings.css
├── App.jsx
└── main.jsx
```
