# Modern Restaurant Website

A beautiful, modern restaurant website with a full-stack backend for handling reservations.

## Features

- **Modern Design**: Dark luxury theme with smooth animations
- **Fully Responsive**: Works on all devices
- **Menu System**: Toggle between Lunch and Dinner menus
- **Reservation System**: Full backend API for booking tables
- **Gallery**: Image gallery with lightbox
- **Reviews**: Customer testimonials section
- **Location**: Map integration and contact information

## Tech Stack

### Frontend
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- Google Fonts (Playfair Display, Inter)

### Backend
- Node.js
- Express.js
- SQLite3 (for database)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Endpoints

### POST `/api/reservations`
Create a new reservation

**Request Body:**
```json
{
  "date": "2025-01-15",
  "time": "19:00",
  "guests": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "specialRequests": "Window seat preferred"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reservation submitted successfully!",
  "reservationId": 1
}
```

### GET `/api/reservations`
Get all reservations (for admin/management)

### GET `/api/reservations/:id`
Get a specific reservation by ID

### PATCH `/api/reservations/:id/status`
Update reservation status (pending, confirmed, cancelled)

### DELETE `/api/reservations/:id`
Delete a reservation

## Database

The application uses SQLite3. The database file (`reservations.db`) will be created automatically on first run.

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
├── reservations.db     # SQLite database (created automatically)
└── README.md           # This file
```

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --color-black: #0E0E0E;
    --color-gold: #D4AF37;
    --color-white: #FFFFFF;
}
```

### Menu Items
Edit the menu sections in `index.html`

### Images
Replace Unsplash image URLs with your own images

## Deployment

### Option 1: Deploy Frontend Only (Static)
- Deploy to Netlify, Vercel, or GitHub Pages
- Note: Reservations won't work without backend

### Option 2: Full Stack Deployment
- Deploy to Heroku, Railway, or DigitalOcean
- Make sure to set up environment variables
- Database will persist on the server

## License

MIT License - Feel free to use for your restaurant!


