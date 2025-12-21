📧 BulkMail Application

BulkMail is a simple MERN stack project to send multiple emails at once using an Excel file.

🚀 Features

Upload Excel file with email IDs

Type one message → send to all emails

Uses Gmail + Nodemailer

Frontend: React

Backend: Node.js + Express

Database: MongoDB

🛠 Tech Stack

Frontend: React, Axios, XLSX

Backend: Node.js, Express, Nodemailer

Database: MongoDB

Mail Service: Gmail (App Password)

📂 Project Structure
BulkMail/
│
├── frontend/
│   └── App.js
│
├── backend/
│   └── index.js
│
└── README.md

⚙️ Backend Setup
1️⃣ Install dependencies
npm install express cors nodemailer mongoose

2️⃣ Start MongoDB

Make sure MongoDB is running locally:

mongodb://127.0.0.1:27017/passkey

3️⃣ MongoDB Collection

Create a collection bulkmail with data like:

{
  "user": "yourgmail@gmail.com",
  "pass": "your_app_password"
}


⚠️ Use Gmail App Password, not normal password.

4️⃣ Run Backend
node index.js


Server will run on:

http://localhost:5000

🎨 Frontend Setup
1️⃣ Install dependencies
npm install axios xlsx

2️⃣ Start React App
npm start


Runs on:

http://localhost:3000

📄 Excel File Format

Only email IDs

Must be in Column A

Example:

A
--------------
test1@gmail.com
test2@gmail.com
test3@gmail.com

📤 How It Works

Type email message

Upload Excel file

Click Send

Emails sent one by one

Alert message shown after completion

⚠️ Important Note (undefined issue explained)

Backend sometimes sends:

{ success, message }

or true / false

Frontend safely handles both

So no undefined error

✅ Status

✔ Emails sending correctly
✔ UI unchanged
✔ Beginner friendly
✔ Works on localhost

👩‍💻 Author

Gayathri Devi
BulkMail Project 💙

If you want 👉

GitHub README style

Short version

Tamil READM
