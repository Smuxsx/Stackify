# Stackify

Stackify is a full-stack marketplace-style web applicaiton where authenticated users can create, manage, and interact with product listings.

This project was built to practice real-world full-stack application architecture, including authentication, relational database design, protected resources, API development, client-side data fetchingm structured logging, and request tracing.

## Features

* User authentication with Clerk
* User synchronization between Clerk and PostgreSQL
* Create, view, edit, and delete product listings
* Ownership protection for product updates and deletions
* User profile page with personal listings
* Product detail pages
* Comment creation and deletion
* Relational user, product, and comment data
* Server-side authorization checks
* React Query caching and mutation handling
* Axios API abstraction
* Request IDs for tracing HTTP requests
* Structured application and database logging
* Responsive UI built with Tailwind CSS and DaisyUI
* Persistent theme selection

## Tech Stack

**Frontend**

* React
* Vite
* React Router
* TanStack React Query
* Axios
* Clerk
* Tailwind CSS
* DaisyUI
* Lucide React

**Backend**

* Node.js
* Express
* TypeScript
* PostgreSQL
* Drizzle ORM
* Clerk Express
* tsup
* Nodemon

## Database Model

Stackify currently uses three primary entities:

**Users**

Stores application users synchronized from clerk.

**Products**

Each product belongs to a user

**Comments**

Each comment to both a user and a product

## Request Logging and Tracing

The backend includes custom request-tracing middleware.

each incomming HTTP request receives a unique request ID. That ID is passed through controllers and databas eoperations so related logs can be correlated.

Logged information can include:

* Request ID
* User ID
* HTTP method
* Endpoint
* Status code
* Response duration
* Controller operation
* Database Operation

This was added mainly for practice but also for debugging and backend behavior easier to follow.

## Getting Started

If you would like to try this project on your environment please follow the next steps:

**Prerequisites**

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL
* A Clerk account

**1. Clone the repository**

git clone https://github.com/Smuxsx/Stackify.git

cd Stackify

**2. Backend Setup**

Move into the backend directory:

cd backend
npm install

Create a `.env` file inside `backend/`

```
PORT=3000
DB_URL=your_postgresql_connection_string
NODE_ENV=development
FRONTEND_URL=http://locahost:5173
CLERK_SECRET_KEY=your_clerk_secret_key
```

> Do not commit your `.env` file.

Push the Drizzle schema to your database:

npm run db:push

Start the backend:

npm run dev:

**3. Frontend setup**

Open another terminal and move into the frontend project:

cd frontend/Stackify-Frontend
npm install

create a `.env` file in the frontend directory:

```
VITE_API_URL=http:locahost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the frontend:

npm run dev

The vite development server will normally be available at 

`http://localhost:5173`