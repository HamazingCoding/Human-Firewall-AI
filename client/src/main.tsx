import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta tags for SEO
const head = document.head;

// Title
const title = document.createElement("title");
title.textContent = "Human Firewall AI - Social Engineering Defense System";
head.appendChild(title);

// Meta description
const description = document.createElement("meta");
description.setAttribute("name", "description");
description.setAttribute("content", "Protect against social engineering threats with advanced AI detection for voice, video, and phishing attacks. Human Firewall AI delivers real-time threat analysis and prevention.");
head.appendChild(description);

// Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.setAttribute("property", "og:title");
ogTitle.setAttribute("content", "Human Firewall AI - Social Engineering Defense System");
head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.setAttribute("property", "og:description");
ogDescription.setAttribute("content", "Protect against social engineering threats with advanced AI detection for voice, video, and phishing attacks. Human Firewall AI delivers real-time threat analysis and prevention.");
head.appendChild(ogDescription);

const ogType = document.createElement("meta");
ogType.setAttribute("property", "og:type");
ogType.setAttribute("content", "website");
head.appendChild(ogType);

// Set favicon
const favicon = document.createElement("link");
favicon.setAttribute("rel", "icon");
favicon.setAttribute("href", "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>");
head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
