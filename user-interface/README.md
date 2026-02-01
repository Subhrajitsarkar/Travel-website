# LuxeStays - Travel User Interface

React-based user interface for browsing and booking travel accommodations.

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

The application will be available at `http://localhost:3001`

## Features

- User authentication (Login & SignUp)
- Browse listings by category
- Price filtering
- Listing details with image gallery
- Booking modal with date selection
- Order history tracking
- Responsive design

## File Structure

```
src/
├── pages/
│   ├── Auth.jsx          # Login/SignUp page
│   ├── Listings.jsx      # Browse listings
│   ├── Details.jsx       # Listing details
│   └── OrderHistory.jsx  # User bookings
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── BookingModal.jsx
├── styles/
│   ├── Auth.css
│   ├── Header.css
│   ├── Listings.css
│   ├── Details.css
│   ├── BookingModal.css
│   └── OrderHistory.css
├── App.jsx
└── main.jsx
```
