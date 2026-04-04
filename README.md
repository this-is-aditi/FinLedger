# 🏦 FinLedger – Banking Ledger Backend with AI

A backend system that simulates how real-world financial systems handle transactions securely and reliably using a ledger-based architecture.

Built with **Node.js, Express, MongoDB**, and enhanced with **AI-powered transaction categorization**.

---

## 🚀 Features

- 🔐 JWT-based Authentication & Authorization  
- 🔑 Secure password hashing using bcrypt  
- 📊 Ledger-based balance calculation using MongoDB Aggregation  
- 💸 Transaction lifecycle management (Pending → Completed)  
- 🔁 Idempotent transaction handling (prevents duplicate payments)  
- 🤖 AI-powered transaction categorization (OpenAI API)  
- 📧 Email notifications using Nodemailer  
- ⚙️ Environment-based configuration using dotenv  

---

## 🧠 Why Ledger System?

Instead of updating balance directly, this system:

- Stores every transaction as a ledger entry  
- Computes balance dynamically using aggregation  

✅ Ensures:
- Data consistency  
- Auditability  
- Safe concurrent transactions  

---

## 🤖 AI Integration

This project integrates AI to automatically classify transactions.

### Example:

| Description           | Category |
|----------------------|---------|
| "Swiggy food order"  | Food    |
| "Uber ride"          | Travel  |
| "Electricity bill"   | Bills   |

AI removes manual categorization and improves user insights.

---

## 🛠 Tech Stack

- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JWT Authentication  
- OpenAI API  
- Nodemailer  
- Postman  

---


