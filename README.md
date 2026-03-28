# 📅 Scheduler App (Cal.com Clone)

A full-stack scheduling application that allows users to create events, manage availability, and book time slots dynamically.

## 🌐 Live Demo

🔗 https://scheduler-app-zeta-one.vercel.app/

## 🚀 Features

### 🎯 Event Management

* Create multiple event types (e.g., 30-min meeting, 1-hour interview)
* Unique booking link for each event (`/book/:slug`)

### ⏰ Slot Generation

* Dynamic time slot generation based on availability
* Prevents double booking of slots

### 📆 Booking System

* Book appointments with name & email
* Booking confirmation screen with details

### 📊 Dashboard

* View upcoming bookings
* View past bookings
* Cancel bookings
* Delete past bookings

### 🎨 UI/UX

* Clean and responsive UI (Tailwind CSS)
* Inspired by Cal.com design

---

## 🛠 Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL

---

## 📂 Project Structure

```
scheduler-app/
├── backend/
│   ├── config/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/Abhi-10949/scheduler-app.git
cd scheduler-app
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=scheduler
PORT=8000
```

Run server:

```
nodemon server.js
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🧠 Key Learnings

* REST API design
* Relational database modeling (MySQL)
* Slot generation logic
* Preventing double booking
* Environment variable security

---

## 📌 Future Improvements

* Email notifications
* Authentication system
* Calendar integrations
* Timezone support

---

## 👨‍💻 Author

Abhishek Kumar
Chandigarh University

---

## 🔗 GitHub Repo

https://github.com/Abhi-10949/scheduler-app
