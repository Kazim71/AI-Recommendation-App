# Vercel Deployment Guide

## Backend Deployment

1. **Deploy Backend to Vercel:**
   - Go to [vercel.com](https://vercel.com) and import your repository
   - Select the `backend` folder as the root directory
   - Vercel will auto-detect the Node.js project

2. **Set Environment Variables in Vercel Dashboard:**
   ```
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   PERPLEXITY_API_KEY=your-perplexity-api-key
   NODE_ENV=production
   ```

3. **Deploy** - Vercel will build and deploy your backend

## Frontend Deployment

1. **Deploy Frontend to Vercel:**
   - Import your repository again
   - Select the `frontend` folder as the root directory
   - Vercel will auto-detect the Vite project

2. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-app.vercel.app
   ```

3. **Deploy** - Vercel will build and deploy your frontend

## Update CORS

After deploying frontend, update the CORS configuration in `backend/api/index.js`:
- Replace `"https://your-frontend-app.vercel.app"` with your actual frontend Vercel URL

## Notes

- Both apps will have separate Vercel URLs
- The regex pattern `/\.vercel\.app$/` allows any .vercel.app subdomain
- Frontend uses SPA routing with the vercel.json configuration