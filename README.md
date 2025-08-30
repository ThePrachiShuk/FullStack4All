# 🧠 AI Full Stack Builder

AI Full Stack Builder is a modern, open-source web app for visually building landing pages and web components using drag-and-drop, resize, and AI-powered features. It’s built with React, TypeScript, Vite, and Tailwind CSS, and integrates with DeepSeek R1 for smart component suggestions.

## 🚀 What is this product?

- **Visual Page Builder:** Drag, drop, and resize components on a canvas to create custom layouts.
- **AI Assistance:** Get intelligent suggestions and generate components using DeepSeek R1.
- **Component Palette:** Choose from Hero, Heading, Text, Button, Image, and more.
- **Properties Panel:** Edit properties of selected components in real time.
- **Collapsible Panels:** Organize your workspace with collapsible side panels.
- **Responsive Design:** All layouts are mobile-friendly and adapt to any screen size.
- **Professional UI:** Styled with Tailwind CSS and custom SVG icons.
- **Easy Deployment:** Ready for cloud deployment (Render, Vercel, Netlify, etc.).

---

## �️ How to Install and Run

### Prerequisites

- Node.js (v18 or newer)
- npm (comes with Node.js)
- DeepSeek API key (for AI features)

---

### 💻 Windows & macOS Instructions

#### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-full-stack-builder.git
cd ai-full-stack-builder
```

#### 2. **Install dependencies**

```bash
npm install
```

#### 3. **Set up environment variables**

Create a file named `.env.local` in the project root and add your DeepSeek API key:

```
VITE_API_KEY=your_deepseek_api_key_here
```

#### 4. **Run the app in development mode**

```bash
npm run dev
```

- Open your browser and go to: [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build for Production

```bash
npm run build
```

- The production build will be in the `dist/` folder.

---

## 🌐 Deploy to Render

1. **Push your code to GitHub.**
2. **Connect your repo to Render.**
3. **Render will auto-detect the `render.yaml` file.**
4. **Set the environment variable `VITE_API_KEY` in Render dashboard.**
5. **Your app will be deployed and live!**

---

## 🛠️ Troubleshooting

- If you see errors about missing dependencies, run `npm install` again.
- If the app doesn’t start, check your Node.js version (`node -v`).
- For API errors, make sure your `VITE_API_KEY` is correct.

---

## 📚 More Info

- **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, DeepSeek R1
- **License:** MIT

---

## ⚖️ License  

© 2025 **Vibe Killers** (Arnav Bansal, Nakul Tanwar, Prachetas Shukla, Ranbir Singh)<br>
All rights reserved. This project is for educational and research purposes only.<br>
Unauthorized copying, modification, or distribution of this project is prohibited without explicit permission.
