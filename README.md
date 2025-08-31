# ☁️ SkyForms

A modern, responsive form builder application built with React, TypeScript, Redux, Tailwind CSS, and Material-UI. SkyForms provides an intuitive interface for creating, managing, and deploying custom forms with real-time validation, state management, and a beautiful Material Design aesthetic.

## ✨ Features

### 🚀 Core Functionality
- `**Dynamic Form Creation**` - Build forms with drag-and-drop interface
- `**Multiple Input Types**` - Support for text, email, number, date, checkbox, radio inputs and more
- `**Real-time Validation**` - Client-side validation with instant feedback
- `**Responsive Design**` - Fully responsive layout that works on all devices

### ⚡ Technical Features
- `**Type Safety**` - Built with TypeScript for robust development experience
- `**State Management**` - Redux Toolkit for predictable state updates
- `**Material Design**` - MUI components for consistent, beautiful UI
- `**Utility-First CSS**` - Tailwind CSS for rapid styling and customization
- `**Hot Module Replacement**` - Vite's fast refresh for efficient development

## 🔧 How It Works

1. `**📝 Form Builder**` - Use the visual form builder to add and configure form fields
3. `**👀 Preview**` - Test your form with the built-in preview functionality
4. `**🚀 Deploy**` - Generate standalone form URLs
5. `**📊 Analytics**` - Track form submissions

## 🛠️ Technologies Used

- `**Frontend Framework**`: React ⚛️
- `**Build Tool**`: Vite ⚡
- `**State Management**`: Redux Toolkit 🔄
- `**UI Library**`: Material-UI (MUI) 🎨
- `**Styling**`: Tailwind CSS 💅
- `**Language**`: TypeScript for type safety 🔒
- `**Package Manager**`: npm/yarn 📦

## 🎬 Demo

https://github.com/user-attachments/assets/69095990-73a0-4af1-a4df-ae3c2d9fd552


## ⚙️ Installation & Setup

### 📋 Prerequisites

Make sure you have the following installed on your system:
- `Node.js (version 16 or higher) 🟢`
- `npm or yarn package manager 📦`

### 🚀 Running the Project Locally

To run the full application with mock data, you'll need to start multiple servers:

1. **📥 Clone the repository**
   ```bash
   git clone https://github.com/Khusro-S/FrontendSkyforms.git
   cd FrontendSkyforms
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **🗄️ Start the mock data servers** (in separate terminals):
   ```bash
   # Terminal 1 - Forms data server
   npx json-server -p 4000 -w ./src/data/data.json
   
   # Terminal 2 - Responses data server  
   npx json-server -p 4001 -w ./src/data/responses.json
   
   # Terminal 3 - Authentication data server
   npx json-server -p 4002 -w ./src/data/authData.json
   ```

4. **⚡ Start the React development server** (in a fourth terminal):
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **🌐 Access the application**:
   - **Frontend**: `http://localhost:5173`
   - **Forms API**: `http://localhost:4000`
   - **Responses API**: `http://localhost:4001`
   - **Auth API**: `http://localhost:4002`

The application will automatically reload when you make changes to the source code. ♻️

## 🔧 API Configuration

When running locally with mock data servers, make sure to update your API configuration file to use the local endpoints:


### ⚠️ Important Notes

- **Development Only**: These localhost URLs should only be used for local development
- **Port Consistency**: Ensure the ports match the ones you're running json-server on
- **Environment Variables**: Remember to revert to environment variables for production deployment

---

⭐ If you find this project helpful, please consider giving it a star on GitHub! 🌟
