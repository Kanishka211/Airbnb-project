# 🏜️ Dune Delight

A full-stack accommodation booking platform inspired by Airbnb, built with the MERN stack. Dune Delight allows users to discover, list, and reserve unique stays — with secure authentication, cloud-based image uploads, and a clean responsive interface.

---

## 🚀 Features

- JWT-based user authentication with protected routes
- Create, edit, and delete property listings
- Browse and search available accommodations
- Cloud-based property image uploads via Cloudinary
- Booking and reservation management system
- Fully responsive UI for desktop and mobile
- Proper form validation using Joi
- RESTful API with MVC architecture
- Secure data storage with MongoDB

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js                          |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT (JSON Web Tokens)             |
| Storage    | Cloudinary                        |

---

## 📂 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-link>
   cd dune-delight
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the application**
   ```bash
   # Run backend
   npm start

   # Run frontend (in a separate terminal)
   cd client
   npm start
   ```

   The app will be available at `http://localhost:3000`

---

## 📸 Screenshots

> ![Home Page](screenshots/home.png)
![Listings Page](screenshots/listings.png)

---

## 🌟 Future Improvements

- Payment gateway integration
- Wishlist / saved properties
- Advanced search and filtering
- Map-based property discovery

---

## 👩‍💻 Author

Kanishka Sharma

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Kanishka211)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kanishka-s-2600622b5/)
