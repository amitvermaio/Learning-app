<h1 align="center">📚 BrainWaveAI — AI-Powered Document Learning Platform</h1>

<p align="center">
  Upload your documents. Chat with them. Learn smarter.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=fff" alt="Vercel" />
  <img src="https://img.shields.io/badge/API%20on-Azure-0078D4?logo=microsoftazure&logoColor=fff" alt="Azure" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## What is BrainWave AI?

**BrainWave AI** is a full-stack AI-powered learning platform where users upload their study documents and interact with them intelligently. Instead of passively reading, users can have a conversation with their documents, get instant summaries, dive deep into specific topics, test their knowledge with auto-generated quizzes and flashcards, and track their progress — all in one place.

---

## ✨ Features

### 📂 Document Upload & Management
Upload PDFs, Word documents, and other files. All uploads are stored securely and indexed for AI-powered retrieval. Each document gets its own dashboard where you can view insights and interact with the content.

### 💬 Chat with Your Documents
Ask questions directly about your uploaded documents. The AI uses RAG (Retrieval-Augmented Generation) with vector search to answer accurately from the content of your files — not just from general knowledge.

### 📝 AI Summaries
Get concise, well-structured summaries of your documents instantly. Perfect for quickly grasping the key points without reading everything from scratch.

### 🎓 Topic Explanation
Select a specific topic or concept from your document and ask for a detailed explanation. The AI provides clear, in-depth explanations tailored to the content of your material.

### 🃏 Flashcard Generation
Automatically generate flashcards from your documents. Review key terms, definitions, and concepts in an interactive format to reinforce your learning.

### 🧠 Quiz Generation & Scoring
Test yourself with AI-generated quizzes based on your documents. Get instant scores and feedback to identify where you need more practice.

### 📊 Document Dashboard
Each document has a dedicated dashboard giving you a bird's-eye view of your learning activity — chats, summaries, quiz scores, and more.

---

## 🛠 Tech Stack

### Frontend
<div align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=061826" alt="React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff" alt="Vite" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux&logoColor=fff" alt="Redux Toolkit" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind CSS" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=fff" alt="React Router" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&logoColor=fff" alt="Axios" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React%20Hook%20Form-7-EC5990?logo=reacthookform&logoColor=fff" alt="React Hook Form" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React%20Markdown-10-000000?logo=markdown&logoColor=fff" alt="React Markdown" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Lucide%20React-Icons-F56565" alt="Lucide React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Sonner-Toasts-000000" alt="Sonner" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa&logoColor=fff" alt="PWA" /></a>
  <a href="#"><img src="https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=fff" alt="ESLint" /></a>
</div>

### Backend
<div align="center">
  <a href="#"><img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=fff" alt="Node.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=fff" alt="Express" /></a>
  <a href="#"><img src="https://img.shields.io/badge/MongoDB-9-47A248?logo=mongodb&logoColor=fff" alt="MongoDB" /></a>
  <a href="#"><img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=fff" alt="JWT" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Passport.js-Google%20OAuth2-34E27A?logo=passport&logoColor=fff" alt="Passport.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Multer-Uploads-4B5563" alt="Multer" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Resend-Emails-000000?logo=mail.ru&logoColor=fff" alt="Resend" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Azure%20Blob-Storage-0078D4?logo=microsoftazure&logoColor=fff" alt="Azure Blob Storage" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Nodemon-Dev-76D04B?logo=nodemon&logoColor=000" alt="Nodemon" /></a>
</div>

### AI / ML
<div align="center">
  <a href="#"><img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=fff" alt="Google Gemini" /></a>
  <a href="#"><img src="https://img.shields.io/badge/LangChain-RAG-1C3C3C?logo=langchain&logoColor=fff" alt="LangChain" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Pinecone-Vector%20DB-000000" alt="Pinecone" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Upstash%20Redis-Caching-DC382D?logo=redis&logoColor=fff" alt="Upstash Redis" /></a>
</div>

---

## 🏗 Architecture Overview

```
┌─────────────────────┐        ┌──────────────────────────┐
│   React Frontend    │◄──────►│    Express REST API       │
│   (Vercel)          │        │    (Azure App Service)    │
└─────────────────────┘        └──────────┬───────────────┘
                                          │
              ┌───────────────────────────┼────────────────────────┐
              │                           │                        │
    ┌─────────▼────────┐      ┌──────────▼──────────┐  ┌─────────▼────────┐
    │   MongoDB Atlas  │      │  Pinecone Vector DB  │  │  Azure Blob      │
    │   (App Data)     │      │  (Document Chunks)   │  │  Storage (Files) │
    └──────────────────┘      └─────────────────────┘  └──────────────────┘
              │
    ┌─────────▼────────┐
    │  Upstash Redis   │
    │  (Cache Layer)   │
    └──────────────────┘
```

When a user uploads a document, the server parses its text, splits it into chunks, generates vector embeddings via **Google Gemini**, and stores them in **Pinecone**. All subsequent chat, summary, quiz, and flashcard requests use RAG — retrieving the most relevant chunks before generating a response — so answers are always grounded in the actual document content.

---

## 🚀 Deployment

| Layer    | Platform              |
|----------|-----------------------|
| Frontend | **Vercel**            |
| Backend  | **Azure App Service** |
| Database | **MongoDB Atlas**     |
| Storage  | **Azure Blob Storage**|
| Vectors  | **Pinecone**          |
| Cache    | **Upstash Redis**     |

---

## 📄 License

This project is licensed under the **MIT License**.
