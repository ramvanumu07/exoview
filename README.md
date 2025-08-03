# 💼 ExoView – AI Interview Simulation with Feedback

**ExoView** (short for **External View**) is a smart, AI-powered tool that simulates high-level job interviews. It not only generates challenging role-specific questions, but also evaluates your answers with detailed HR-style feedback.

> "Think of it as your AI-powered mock interview coach."

---

## 🔥 Features

- 🎯 **Job Role–Specific Questions**  
  Generates 5 advanced interview questions based on the role you enter.

- 💬 **Real-Time Answering Experience**  
  Mimics real interviews with one-question-at-a-time flow.

- 🧠 **AI Feedback Engine (via OpenRouter)**  
  Evaluates your answers with:
  - What went well
  - What didn't go well
  - HR-style suggestions
  - Overall rating (optional)

- 🔒 **API Key Secured in Netlify Functions**  
  Your OpenRouter API key is never exposed on the frontend.

---

## ⚙️ Tech Stack

| Layer       | Tech Used                      |
|-------------|-------------------------------|
| Frontend    | HTML, CSS, JavaScript (Modular ES6) |
| Backend     | Netlify Functions (serverless) |
| AI API      | OpenRouter API (AI model)      |
| Deployment  | Netlify                       |

---

## 📁 Folder Structure

```bash
ExoView/
│
├── netlify/
│   └── functions/
│       └── openrouter.mjs           # Secure AI handler with env vars
│
├── node_modules/              # Project dependencies
│
├── src/
│   ├── api/                   # API abstraction layer (frontend → backend)
│   ├── components/            # UI components (question card, feedback block, etc.)
│   ├── pages/                 # Main UI pages (e.g. Home, Interview page)
│   └── utils/                 # Helper logic (formatting, state mgmt, etc.)
│
├── styles/                    # CSS files
│   └── main.css
│
├── package.json
└── README.md                  # ← You're here!
```

---

## 🔐 Secure API Handling via Netlify

Instead of exposing your API key in the frontend, you're using:

✅ **Netlify Functions** (`/netlify/functions/openrouter.mjs`)  
✅ **Environment variables** (`OPENROUTER_API_KEY` set in Netlify UI)

> This keeps your key 100% hidden from users. Smart and secure.

---

## 🧪 How to Run Locally (Dev)

1. **Install dependencies**  
   ```bash
   npm install
   ```

2. **Run a local server (optional)**  
   You can use VS Code Live Server or `serve` to preview frontend

3. **Use Netlify CLI to emulate backend**  
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

---

## 🚀 Live Demo

🔗 [https://exoview.netlify.app](https://exoview.netlify.app)

---

## ✅ Highlights

- Modular structure like a real-world frontend project
- Secure API key management (best practice)
- No frameworks — just clean HTML, CSS, and JavaScript
- Resume + portfolio–ready project for tech interviews

---

## 🧠 Key Prompts (OpenRouter)

### 🟢 Interview Question Generation Prompt
```
You are acting as an experienced HR interviewer and team member preparing a real interview for a fresher applying to the role of ${role}.

    Your task is to ask 5 realistic interview questions that reflect what a candidate would be asked in an actual screening or early-round interview. The questions should:
    - Be behavioral or scenario-based where relevant
    - Each test a **different real-world ability** expected in a fresher for this role
    - Be **aligned with the responsibilities of the role**
    - Avoid textbook or generic “Tell me about yourself” style questions
    - Reflect real workplace thinking or challenges the fresher may face

    Only output plain text as a numbered list like below:
    1. [Your first question here]
    2. ...
    3. ...
    4. ...
    5. ...

    Do NOT include any quotes, markdown, symbols, or extra formatting.
```

### 🔵 Answer Feedback Prompt
```
You are acting as an experienced HR recruiter reviewing a fresher's answer to an interview question.

    Given:
    - The job role: ${role}
    - The interview question: ${question}
    - The candidate's answer: ${answer}

    Only output a valid JSON object exactly in the format shown below. Do NOT write any extra text or explanation.

    {
      "strengths": [],
      "gaps": [],
      "suggestions": [],
      "rating": "X/10"
    }

    Each section must be written from the point of view of a professional HR interviewer.  
    - "strengths" and "gaps" should list precise, evidence-based observations based on the answer.  
    - "suggestions" must be actionable and insightful — not generic.

    explain four key points in "suggestions":
    1. **one ability the question was testing** (e.g., leadership, analytical thinking, communication).  
    2. **one thing the candidate focused on** (was it off-track, partial, or strong).  
    3. **What's one thing that should highlight more clearly** (examples, decisions, impact, thought process).  
    4. **One advice to improve future answers** that would reflect the right abilities and impress real interviewers.

    If the answer is completely invalid (e.g., gibberish), rate it below 2/10 and say ["None"] in strengths.

    Respond only with the raw JSON object. No extra formatting.
```

---

## 📄 License

MIT – Free to use, modify, and learn from.

---

## 🙋‍♂️ Author

Built with 💡 by **Ram Vanumu**  
[LinkedIn](https://www.linkedin.com/in/ramvanumu07/)  

---