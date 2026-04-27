# Arithmos | Premium MVC Calculator with Express Backend

This is a full-stack calculator application using the Model-View-Controller (MVC) architecture.

## Features
- **MVC Architecture**: Clean separation of concerns.
- **Express.js Backend**: Handles API requests for history management.
- **SQLite Database**: Persistent storage for calculation history.
- **RESTful API**: Endpoints for fetching, saving, and clearing history.
- **Premium UI**: Modern design with glassmorphism and smooth animations.

## Project Structure
- `public/`: Contains frontend files (HTML, CSS, JS).
- `database/`: Contains the SQLite database file.
- `server.js`: The Express server and API logic.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## API Routes
- `GET /api/history`: Fetch latest 20 records.
- `POST /api/history`: Save a new calculation.
- `DELETE /api/history`: Clear all history.
