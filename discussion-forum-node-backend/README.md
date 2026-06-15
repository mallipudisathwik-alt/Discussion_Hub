# Discussion Forum - Node.js Backend

## Overview
Handles comments (MongoDB), activity logs (MongoDB), and semantic search via embedding service.

## Setup

```bash
npm install
```

Edit `.env` with your MongoDB URI and JWT secret.

## Run

```bash
node server.js
# or
npm start
```

Runs on http://localhost:3000

## API Endpoints

### Comments
- GET /api/comments/:postId - Get comments for post
- POST /api/comments/:postId - Add comment (auth)
- PUT /api/comments/:commentId - Edit comment (owner)
- DELETE /api/comments/:commentId - Delete (owner/ADMIN)
- POST /api/comments/:commentId/reply - Reply to comment (auth)
- POST /api/comments/:commentId/upvote - Upvote (auth)

### Activity
- GET /api/activity - List activity logs (ADMIN only)
- POST /api/activity - Log activity

### Search
- GET /api/search?q=query - Semantic vector search

## Dependencies
express, mongoose, axios, jsonwebtoken, cors, dotenv, express-validator
