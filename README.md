

# 🌈 Hello Chrome Extension

A lightweight, modern Chrome Extension that demonstrates popup UI design, theme switching (dark/light), and persistent data storage using the Chrome Storage API.

## 🚀 Features

- Clean and attractive popup UI with dark/light mode
- Persistent settings using chrome.storage
- Modal backdrop for better user experience
- Action buttons with edit/delete functionality
- Optimized for performance and Chrome Manifest V3
- Fully responsive layout with smooth transitions

## 🧩 Tech Stack

- HTML5 / CSS3 – Structured layout and modern UI styling
- JavaScript (ES6+) – Popup logic, DOM manipulation, and Chrome APIs
- Chrome Extension API (Manifest V3) – Secure and optimized extension framework

## 📁 Project Structure

hello-chrome-extension
│
├── icons/
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
├── index.html
├── style.css
├── script.js
├── manifest.json
└── README.md

## ⚙️ Installation

1. Clone or download the repository
   git clone [https://github.com/yourusername/hello-chrome-extension.git](https://github.com/yourusername/hello-chrome-extension.git)

2. Open Chrome and navigate to
   chrome://extensions/

3. Enable Developer Mode (top-right corner)

4. Click “Load unpacked” and select the project folder

5. The extension will appear in your Chrome toolbar

## 🧠 Usage

1. Click the extension icon in your Chrome toolbar
2. The popup window will open
3. Switch between dark and light themes
4. Add, edit, or delete entries
5. All preferences and data are automatically saved in Chrome storage

## 🗃️ Chrome Permissions

"permissions": ["activeTab", "scripting", "storage"]

These allow the extension to:

- Inject scripts into active tabs
- Save user preferences and data securely

## 🧰 Manifest Configuration

Example manifest.json:

{
"manifest_version": 3,
"name": "Hello Chrome Extension",
"version": "1.0",
"description": "A simple demo Chrome extension with theme switching and persistent storage.",
"permissions": ["activeTab", "scripting", "storage"],
"action": {
"default_popup": "index.html",
"default_icon": {
"16": "icons/icon16.png",
"48": "icons/icon48.png",
"128": "icons/icon128.png"
}
}
}

## 🧑‍💻 Development Tips

- Make sure all icons exist in the specified paths
- After any code update, reload the extension in Chrome via chrome://extensions
- Check the Console tab in DevTools (inside popup) for debug logs
- Keep JavaScript logic modular and handle async Chrome APIs properly
