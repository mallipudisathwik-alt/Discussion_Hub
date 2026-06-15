# Discussion Forum - Backend (Spring Boot)

## Overview
Core backend service handling authentication, posts, categories, and users. Uses PostgreSQL for data storage.

## Prerequisites
- Java 17+
- Maven
- PostgreSQL with database `discussion_forum_db`

## Setup

1. Open as Maven project in Spring Tool Suite or IntelliJ
2. Update `src/main/resources/application.properties` with your PostgreSQL credentials and JWT secret
3. Run `ForumApplication.java` as Spring Boot App

Runs on http://localhost:8080

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login, returns JWT
- GET /api/auth/me - Get current user (auth required)

### Posts
- GET /api/posts - Paginated posts (filter by categoryId, tag, page, size)
- GET /api/posts/{id} - Get single post
- POST /api/posts - Create post (auth required)
- PUT /api/posts/{id} - Update post (owner or ADMIN)
- DELETE /api/posts/{id} - Delete post (owner or ADMIN)
- POST /api/posts/{id}/upvote - Upvote
- POST /api/posts/{id}/downvote - Downvote
- POST /api/posts/{id}/pin - Toggle pin (ADMIN only)
- POST /api/posts/{id}/close - Toggle closed (ADMIN only)

### Categories
- GET /api/categories - List all
- POST /api/categories - Create (ADMIN only)
- DELETE /api/categories/{id} - Delete (ADMIN only)
- GET /api/categories/{slug}/posts - Posts in category

### Users
- GET /api/users/{id} - Get user profile
- PUT /api/users/{id} - Update profile (own only)
- GET /api/users/{id}/posts - User's posts

## Dependencies
- Spring Boot 3.2, Spring Data JPA, Spring Security, JJWT, PostgreSQL, Lombok
