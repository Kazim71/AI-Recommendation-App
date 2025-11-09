# Product Recommender

A full-stack MERN application that provides intelligent product recommendations through hybrid AI and database integration using Perplexity AI.

## Overview

Product Recommender combines artificial intelligence with traditional database querying to deliver personalized product suggestions. The system features user authentication, recommendation caching, and markdown-formatted insights for comprehensive product analysis.

## Key Features

- Hybrid recommendation system combining AI and database queries
- User authentication and authorization with JWT
- Recommendation caching for improved performance
- Markdown-based insights and detailed product analysis
- Multi-user support with personalized recommendation history
- Responsive web interface with modern UI components
- RESTful API architecture

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Axios, React Router
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Authentication:** JSON Web Tokens (JWT)
**AI Integration:** Perplexity AI API
**Caching:** In-memory caching system

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or cloud instance)
- Perplexity AI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/product-recommender
JWT_SECRET=your-secure-jwt-secret-key
PERPLEXITY_API_KEY=your-perplexity-api-key
PORT=5000
NODE_ENV=development
```

3. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Product Recommender
```

3. Start the development server:
```bash
npm run dev
```

The application will be accessible at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
product-recommender/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── recommendationController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Recommendation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── productRoutes.js
│   ├── services/
│   │   └── perplexityService.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .env
├── .gitignore
└── README.md
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### Recommendation Endpoints
- `POST /api/recommendations` - Generate product recommendations
- `GET /api/recommendations/history` - Retrieve user recommendation history

### Product Endpoints
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product (authenticated)

## Deployment

### Backend Deployment (Render/Railway)

1. Connect your repository to Render or Railway
2. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PERPLEXITY_API_KEY`
   - `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository to Vercel or Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables:
   - `VITE_API_URL` (your deployed backend URL)

## License

MIT License

Copyright (c) 2024 Mohammad Kazim

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.