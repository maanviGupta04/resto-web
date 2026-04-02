# 🍽️ AI-Powered Restaurant Web Application

A full-stack restaurant web application that allows users to explore dishes, manage authentication, and interact with an AI-powered chatbot for smart food recommendations and assistance.

---

## 🚀 Features

* 🔐 **Authentication System**

  * Login & Signup with validation
  * LocalStorage-based session handling

* 🤖 **AI Chatbot Integration**

  * Integrated with Google Gemini API
  * Provides intelligent dish suggestions, recipes, and menu assistance
  * Handles natural language queries using NLP

* ⚡ **Fallback Mechanism**

  * Rule-based responses when AI service is unavailable
  * Keyword-based suggestions (e.g., desserts, beverages)

* 🍴 **Recipe Management**

  * Users can add and view recipes
  * Dynamic UI updates

* 👨‍🍳 **Admin/Owner Panel**

  * Control dish visibility
  * Set pricing for menu items

* 🎨 **Responsive UI**

  * Clean and modern interface using HTML, CSS, and JavaScript

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI Integration:** Google Gemini API
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```
resto-web/
│── .gitignore
│── package.json
│── package-lock.json
│
├── recipe-project/
│   ├── server.js
│   ├── app.js
│
├── index.html
├── script.js
├── styles.css
```

---

##  Setup Instructions

###  Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd resto-web
```

---

###  Install Dependencies

```bash
npm install
```

---

###  Create Environment Variables

Create a `.env` file in the root folder and add:

```
GEMINI_API_KEY=your_api_key_here
MONGO_URI=your_mongodb_connection_string
```

>  Note: Do NOT upload your `.env` file to GitHub for security reasons.

---

###  Run the Application

```bash
go inside server.js and run
or paste the command below in you new terminal
node server.js
```

---

###  Open in Browser

Open `index.html` in your browser or use Live Server.

---

##  Security Practices

* Sensitive data stored in `.env` file
* `.env` excluded using `.gitignore`
* No API keys exposed in public repository

---

##  AI Integration Details

* Uses Google Gemini API for natural language understanding
* Generates dynamic responses for user queries
* Implements fallback logic for improved reliability

---

## Future Enhancements

* Add JWT-based authentication
* Deploy application (Frontend + Backend)
* Improve chatbot with intent classification
* Add payment integration

---

****Important Note****
The Recipe Management system is powered by MongoDB and requires a valid database connection string.
The AI Chatbot uses the Google Gemini API, which requires an API key.

For security reasons:

API keys and database credentials are stored in a .env file
These sensitive details are not included in this repository

 As a result:

Some features (AI chatbot & database operations) may not work directly after cloning
However, they are fully functional in the developer's local environment

File Storage Note
User-uploaded images (from recipe submissions) are stored locally in an uploads/ directory
This folder is ignored in version control (.gitignore)


Important:

Uploaded images will only persist in the local development environment
They are not stored or served from GitHub

-----To enable this feature, ensure an uploads/ folder exists in the root directory when running the project.

##Author

**Maanvi Gupta**
Artificial Intelligence & Machine Learning Student

---

##  Acknowledgement

This project was developed as part of a technical evaluation to demonstrate full-stack development and AI integration skills.

---
