# Troubleshooting Database Connection Issues

## Quick Diagnostic Steps

### 1. Check Health Endpoint
Visit: `https://ai-recommendation-app-azure.vercel.app/health`

This will show:
- Whether `MONGO_URI` is set
- Current database connection state
- Preview of connection string (first/last characters)

### 2. Test Database Connection
Visit: `https://ai-recommendation-app-azure.vercel.app/api/test-db`

This endpoint will:
- Show detailed connection diagnostics
- Attempt to connect and show the result
- Display specific error messages

## Common Issues and Solutions

### Issue 1: MONGO_URI Not Set
**Symptoms:**
- `hasMONGO_URI: false` in health check
- Error: "MONGO_URI is not defined in environment variables"

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `MONGO_URI` with your MongoDB connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
4. Redeploy the application

### Issue 2: MongoDB Atlas IP Whitelist
**Symptoms:**
- Error: "MongoServerSelectionError" or "ENOTFOUND"
- Connection timeout errors

**Solution:**
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Access List
3. Click "Add IP Address"
4. Add `0.0.0.0/0` to allow all IPs (required for Vercel serverless)
5. Or add specific Vercel IP ranges (less secure but more restrictive)

### Issue 3: Invalid Connection String
**Symptoms:**
- Error: "MongoAuthenticationError"
- Connection fails immediately

**Solution:**
1. Verify your MongoDB connection string format
2. Check username/password are correct
3. Ensure database name is correct
4. Format should be: `mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority`

### Issue 4: Connection Timeout
**Symptoms:**
- Error: "Connection timeout"
- Takes too long to connect

**Solution:**
1. Check MongoDB Atlas cluster status
2. Verify network connectivity
3. Check if MongoDB Atlas allows connections from your region
4. Try increasing timeout in connection settings (already set to 15s)

## Step-by-Step Fix

1. **Check Environment Variables in Vercel:**
   ```
   Vercel Dashboard → Project → Settings → Environment Variables
   ```
   Ensure these are set:
   - `MONGO_URI` (required)
   - `JWT_SECRET` (required)
   - `NODE_ENV=production` (optional but recommended)

2. **Verify MongoDB Atlas Settings:**
   - Network Access: Allow `0.0.0.0/0` (all IPs)
   - Database Access: User has read/write permissions
   - Cluster is running and accessible

3. **Test Connection:**
   - Visit `/api/test-db` endpoint
   - Check the response for specific error details

4. **Check Vercel Logs:**
   - Vercel Dashboard → Project → Functions → View Logs
   - Look for connection error messages
   - Check for specific error codes

5. **Redeploy:**
   - After fixing environment variables, trigger a new deployment
   - Vercel will pick up the new environment variables

## Expected Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/myapp?retryWrites=true&w=majority
```

## Testing Locally

If it works locally but not on Vercel:
1. Check if local `.env` file has correct `MONGO_URI`
2. Verify Vercel environment variables match local `.env`
3. Ensure MongoDB Atlas IP whitelist includes Vercel IPs (or 0.0.0.0/0)

## Still Having Issues?

1. Check the `/api/test-db` endpoint response
2. Review Vercel function logs for detailed error messages
3. Verify MongoDB Atlas cluster is running
4. Test connection string in MongoDB Compass or similar tool
5. Ensure database user has correct permissions

