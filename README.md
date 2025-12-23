# ExoView - AI Interview Practice Platform

**ExoView** is a modern AI-powered interview simulation platform with a ChatGPT-inspired interface. Practice real interview scenarios and receive instant AI feedback to boost your confidence.

🔗 **[Live Demo](https://exoview.netlify.app/)**

---

## Features

- **Smart Interview Simulation**: Role-specific questions tailored to your target position
- **AI-Powered Feedback**: Comprehensive analysis using Groq's lightning-fast LLM API
- **Modern UI**: ChatGPT-inspired dark theme with responsive design
- **Secure & Private**: API keys secured via Netlify Functions, no data storage

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Vanilla JavaScript (ES6), HTML5, CSS3 |
| **Backend** | Netlify Functions (Serverless) |
| **AI API** | Groq API with multiple LLM model fallbacks |
| **Deployment** | Netlify |

---

## Quick Start

### Prerequisites
- Node.js (v14+)
- Netlify CLI
- Groq API key ([Get free key](https://console.groq.com/))

### Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/ramvanumu07/exoview.git
   cd exoview
   npm install
   ```

2. **Set up environment**
   ```bash
   # Create .env file
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Deploy to Netlify**
   - Connect repository to Netlify
   - Set `GROQ_API_KEY` in environment variables
   - Deploy automatically

---

## Project Structure

```
exoview/
├── netlify/functions/groq.mjs     # Secure Groq AI API handler
├── src/
│   ├── api/groqApi.js             # Frontend API abstraction
│   ├── components/                # UI components
│   ├── pages/                     # Main application pages
│   └── utils/                     # Helper functions
├── styles/                        # ChatGPT-inspired styling
└── index.html                     # Application entry point
```

---

## Configuration

### AI Models
The app automatically tries multiple Groq models:
1. **Llama 3.1 70B Versatile** (Primary)
2. **Llama 3.1 8B Instant** (Fast fallback)
3. **Mixtral 8x7B 32K** (Alternative)
4. **Gemma2 9B IT** (Final fallback)

### Customization
- **Colors**: Modify `styles/theme.css`
- **Layout**: Update `styles/main.css`
- **AI Prompts**: Edit `src/api/groqApi.js`

---

## Troubleshooting

**"Service configuration error"**
- Verify `GROQ_API_KEY` is set in Netlify environment variables
- Redeploy after adding the key

**"No questions generated"**
- Check Groq API key validity
- Try a shorter, common job role

**Debug Mode**: Triple-click "Interview Complete!" title to view error logs

---

## License

MIT - Free to use and modify

---

## Author

**Ram Vanumu**  
[LinkedIn](https://www.linkedin.com/in/ramvanumu07/)

---

*Built for job seekers everywhere*