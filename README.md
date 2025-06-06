```# Easy Trader Joe’s College Meals

A full-stack web application designed to help college students find quick, healthy, and affordable meals using Trader Joe’s ingredients. The app features recipe filtering, a shopping list generator, user login, and a clean, student-friendly UI.

## Features

- **Homepage**: Friendly intro to the site’s mission
- **About Page**: Personal background of the project
- **Recipes Page**: Curated, dorm-friendly meals with filters by ingredient, category, or dietary needs
- **My Recipes**: Save your favorite recipes (login required)
- **Shopping Cart**: Generate editable grocery lists from selected recipes
- **Contact Form**: Submit questions or feedback
- **User Authentication**: Register/login with secure JWT-based authentication

---

## Tech Stack

### Frontend
- HTML, CSS
- JavaScript
- Responsive design with Flexbox/Grid
- Google Fonts (`Pacifico`, `Quicksand`)

### Backend
- Node.js + Express.js
- MongoDB Atlas (NoSQL cloud database)
- MongoDB Node.js Driver
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variable management)

---

## Project Structure

/Trader Joes Recipes - 4/
│
├── views/
│   ├── index.html
│   ├── about.html
│   ├── recipes.html
│   ├── myrecipes.html
│   └── shoppingcart.html
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── node_modules/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── recipeController.js
│   │   ├── contactFormController.js
│   │   └── shoppingListController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── contactRoutes.js
│   │   └── shoppingListRoutes.js
│   └── middleware/
│       └── authMiddleware.js
├── Images/
└── auth.js
└── cart.js
└── config.js
└── contact.js
└── recipes.js
└── style.css
└── README.md

## Setup & Installation

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js & npm](https://nodejs.org/)
- [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)
- A code editor like [VSCode](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) (for testing)

### 2. Clone the Repository

git clone https://github.com/your-username/trader-joes-college-meals.git
cd trader-joes-college-meals/backend

### 3. Install Backend Dependencies

npm install

### 4. Create a .env File

Create a `.env` file in `/backend/` with:

PORT=5000
MONGODB_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_key_here

### 5. Start the Backend Server

npm run dev

### 6. Open the Frontend

- Open index.html in the /views/ folder directly in your browser
- Ensure the backend is running at http://localhost:5000 for full functionality like favorites and shopping cart

## API Endpoints

| Method   | Endpoint                       | Description                          |
|----------|--------------------------------|--------------------------------------|
| POST     | `/api/users/register`          | Register a new user                  |
| POST     | `/api/users/login`             | User login                           |
| POST     | `/api/users/logout`            | User logout                          |
| GET      | `/api/users/:userId/favorites` | Get user's favorite recipes          |
| POST     | `/api/users/:userId/favorites` | Add recipe to favorites              |
| DELETE   | `/api/users/:userId/favorites` | Remove a recipe from favorites       |
| POST     | `/api/users/:userId/cart`      | Add recipe ingredients to cart       |
| POST     | `/api/contact`                 | Submit contact form                  |
| GET/POST | `/api/recipes`                 | View or add recipes                  |
| GET/POST | `/api/shopping-list`           | View or update shopping list         |

## Future Improvements

- Add "Forgot Password" functionality
- Improve mobile responsiveness
- Allow user-submitted recipes
- Integrate with Trader Joe’s API (if available)
- Expand recipe library and dietary categories
- Improve accessibility (color contrast, ARIA roles)

## References

- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [MongoDB Node Driver](https://mongodb.github.io/node-mongodb-native/)
- [Node.js API Docs](https://nodejs.org/docs/latest/api/)
- [Express.js Docs](https://expressjs.com/)
- [Postman Learning Center](https://learning.postman.com/)
- [W3Schools](https://www.w3schools.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

## Author

**Claudia Porto**  
CSC 240 – Final Project  
June 2025```