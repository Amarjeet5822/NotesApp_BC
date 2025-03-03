# 📝 Note-Taking Application

This is a **full-stack Note-Taking Application** built with **Node.js, Express, and MongoDB**. It allows users to **register, login, and manage their notes** with categories, priorities, and search functionalities.

## 🚀 Features

### 🌟 User Authentication
- **Register**: Users can create an account.
- **Login**: Secure login using JWT.
- **Cookie-based Authentication**: Cookies are signed using a secret key.

### 🗒️ Note Management
- **Create a Note**: Add new notes with title, content, category, and priority.
- **Read Notes**: Fetch all notes by the logged-in user.
- **Update a Note**: Edit existing notes.
- **Delete a Note**: Remove a note.
- **Search Notes**: Find notes by title or content.


## 🌐 API Endpoints

### User Routes
- **POST /api/users/register** — Register a new user
- **POST /api/users/login** — Login a user and set cookie

### Note Routes
- **GET /api/notes** — Get all notes for the logged-in user
- **POST /api/notes** — Create a new note
- **PATCH /api/notes/:id** — Update a note by ID
- **DELETE /api/notes/:id** — Delete a note by ID
- **GET /api/notes/search?title=** — Search notes by title

## 🔧 Configuration

Create a `.env` file with the following variables:
```
PORT=3000
MONGO_URI=your_mongo_db_connection_string
SECRET_KEY=your_secret_key
FE_URL=http://localhost:5173
DEPLOY_FE_URL=your_deployed_frontend_url
```

## 🚢 Run the Project

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm run server
```

3. **API Documentation:**
Swagger documentation will be available at:
```
http://localhost:3000/api-docs
```

## 📦 Packages Used

- **Express** — For creating the server
- **Mongoose** — For interacting with MongoDB
- **dotenv** — To load environment variables
- **cors** — To enable cross-origin requests
- **cookie-parser** — To handle cookies
- **jsonwebtoken** — For JWT authentication
- **swagger-jsdoc & swagger-ui-express** — For API documentation
- **nodemon** — For live server reload during development

## 📚 Folder Structure
```
.
├── dbConnection.js
├── models
│   ├── user.model.js
│   └── note.model.js
├── routes
│   └── index.route.js
├── swaggerConfig.js
├── index.js
├── .env
└── package.json
```

## ✨ Future Enhancements
- Add pagination for notes
- Implement password hashing using bcrypt
- Add role-based access control
- Enhance the frontend with React

## 💡 Contributing
Feel free to fork the repo and submit pull requests. All contributions are welcome!

## 📜 License
This project is licensed under the MIT License.

---
Happy Coding! 🚀

