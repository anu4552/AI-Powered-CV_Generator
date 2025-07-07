
# 📝 AI-Powered CV Generator

This project is an intelligent, user-friendly web application that generates professional resumes (CVs) using AI model **Ollama** ( DeepSeek). Users can fill out a form with their personal and professional details, and the system automatically produces a clean, formatted resume — which can be previewed live and downloaded in **PDF** or **DOCX** format.

---


## 🚀 Features

- 🔍 Real-time preview of the generated resume (HTML)
- 🧠 AI-generated professional summary and content
- 📸 Upload and embed a profile photo
- 📥 Download resume as PDF or Word (.docx)
- 💬 Prompt templating for high-quality AI responses
- 🌐 Full-stack integration with React + Flask + Ollama

---

## 📁 Project Structure

cv-generator/
├── frontend/
│ ├── public/
│ └── src/
│ └── App.jsx # React form 
│ └── main.jsx
├── backend/
│ ├── app.py # Flask backend logic
│ ├── prompt_template.txt # Prompt for the LLM
| |── preview.html # Template for parsing
│ └── cv-template.docx # Word template with placeholders
└── README.md

---

## 🛠️ Technologies Used

| Layer         | Tech Stack                     |
|---------------|--------------------------------|
| **Frontend**  | React, TailwindCSS, Axios      |
| **Backend**   | Python, Flask, Flask-CORS      |
| **LLM**       |  Ollama                        |
| **Resume Format** | HTML (preview) + DOCX      |
| **PDF Export** | weasyprint                    |
| **Image Handling** | Base64 & `python-docx`    |

---

## 🔧 Installation & Setup

requirement.txt

---

## 📤 How It Works
User fills out a detailed form including personal data, skills, education, experience, and uploads a photo.

The frontend sends the data as FormData to the Flask backend.

The backend fills a prompt using prompt_template.txt and sends it to a large language model.

The LLM generates structured, professional CV content.

The content is injected into an HTML or DOCX template.

The result is returned to the frontend for live preview and can be downloaded as:

✅ PDF (rendered from HTML)

✅ DOCX (filled from Word template)
----

## ✍️ Author
| [![Anu's GitHub](https://avatars.githubusercontent.com/anu4552?s=80)](https://github.com/anu4552) |
| :-----------------------------------------------------------------------------------------------: |
|                                           **Anu Kumari**                                          |
|                            [GitHub Profile](https://github.com/anu4552)                           |



📄 License
This project is open-source under the MIT License.

----


