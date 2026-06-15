# Discussion Forum - Frontend (React + Vite)

## Overview
React frontend consuming the FastAPI gateway. Dark-mode first, responsive design with semantic search, threaded comments, and admin panel.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Runs on http://localhost:5173

## Important
All API calls go to the FastAPI gateway at http://localhost:8000. Never call Spring Boot or Node.js directly.

## Pages
- Home - paginated post feed with category filter
- Post Detail - full post with threaded comments
- Create Post - rich text editor with category picker
- Category Browser - grid of all categories
- Search Results - semantic search with match scores
- User Profile - user info and posts
- Login / Register - JWT auth
- Admin Panel - category management and activity logs

## Dependencies
react, react-router-dom, axios, @tanstack/react-query, tailwindcss, vite
