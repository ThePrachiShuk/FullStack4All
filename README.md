# 🎨 AI Full Stack Builder

<div align="center">
  <img width="1200" height="475" alt="AI Full Stack Builder" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A powerful AI-powered page builder with intuitive drag-and-drop functionality, built with React, TypeScript, and Vite. Create beautiful landing pages and web components with the help of AI assistance.

## ✨ Features

- 🤖 **AI-Powered**: Integration with DeepSeek R1 for intelligent component generation
- 🎯 **Drag & Drop Canvas**: Intuitive visual editor with precise component positioning
- 🔧 **Resizable Components**: 8-directional resize handles for perfect layouts
- 🎨 **Modern UI**: Professional design with Tailwind CSS and custom SVG icons
- 📱 **Responsive Design**: Full-height layouts that adapt to any screen size
- 🎛️ **Properties Panel**: Real-time component property editing
- 📦 **Component Library**: Pre-built components (Hero, Heading, Text, Button, Image)
- 🔄 **Auto-Expanding UI**: Smart panel management for better UX

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- DeepSeek API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-full-stack-builder.git
cd ai-full-stack-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Create .env.local file
echo "VITE_API_KEY=your_deepseek_api_key_here" > .env.local
```

4. **Start development server**

```bash
npm run dev
```

5. **Open your browser**
   Visit `http://localhost:5173` to start building!

## 🌐 Deployment to Render

### Method 1: Using render.yaml (Recommended)

1. **Prepare for deployment**

```bash
chmod +x deploy.sh
./deploy.sh
```

2. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

3. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository
   - Render will automatically detect `render.yaml`
   - Set environment variables:
     - `VITE_API_KEY`: Your DeepSeek API key
     - `NODE_ENV`: `production`
   - Click "Create Web Service"

### Method 2: Manual Setup

If you prefer manual configuration:

1. **Build settings**:

   - Build Command: `npm ci && npm run build`
   - Start Command: `npm run start:prod`
   - Publish Directory: `./dist`

2. **Environment Variables**:
   - `VITE_API_KEY`: Your DeepSeek API key
   - `NODE_ENV`: `production`

## 📁 Project Structure

```
ai-full-stack-builder/
├── components/              # React components
│   ├── Canvas.tsx          # Main drag & drop canvas
│   ├── ComponentPalette.tsx # Component selection panel
│   ├── PropertiesPanel.tsx # Property editing panel
│   ├── AiChat.tsx          # AI chat interface
│   └── ...
├── services/               # API services
│   └── geminiService.ts    # AI service integration
├── types.ts               # TypeScript type definitions
├── App.tsx               # Main application component
├── render.yaml           # Render deployment configuration
└── package.json          # Project dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start:prod` - Start production server
- `./deploy.sh` - Deployment preparation script

## 🎯 Usage

1. **Add Components**: Select components from the palette on the left
2. **Drag & Drop**: Use the drag handle to position components on the canvas
3. **Resize**: Use the 8 resize handles around selected components
4. **Edit Properties**: Modify component properties in the right panel
5. **AI Assistance**: Use the AI chat for intelligent component suggestions

## 🛠️ Technologies Used

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Modules
- **AI Integration**: DeepSeek R1 API
- **Build Tool**: Vite
- **Deployment**: Render

## 🚀 Performance Features

- **Fast Build Times**: Vite for lightning-fast development
- **Optimized Bundles**: Tree shaking and code splitting
- **Responsive Design**: Mobile-first approach
- **Efficient Rendering**: React 19 with optimized re-renders

## 🔐 Environment Variables

| Variable       | Description                          | Required |
| -------------- | ------------------------------------ | -------- |
| `VITE_API_KEY` | DeepSeek API key for AI features     | Yes      |
| `NODE_ENV`     | Environment (development/production) | No       |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/ai-full-stack-builder/issues) page
2. Create a new issue with detailed description
3. Include screenshots and error messages

## 🌟 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- AI powered by DeepSeek R1
- Deployed on Render

---

<div align="center">
  Made with ❤️ for the developer community
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18Tfx5DqxOzzPZEIwhHmBrmCj6bCg-655

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `VITE_API_KEY` in [.env.local](.env.local) to your OpenRouter API key
3. Run the app:
   `npm run dev`

## Deploy to Render

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-full-stack-builder.git
   git push -u origin main
   ```

2. **Deploy on Render:**

   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration

3. **Set Environment Variables:**
   - In Render dashboard, go to your service → "Environment"
   - Add: `VITE_API_KEY` = `your-openrouter-api-key`

### Option 2: Manual Deployment

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com) and create a "Static Site"
   - Upload the `dist` folder contents
   - Set environment variable `VITE_API_KEY`

### Configuration Details

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Publish Directory:** `./dist`
- **Environment Variables:** `VITE_API_KEY` (your OpenRouter API key)
