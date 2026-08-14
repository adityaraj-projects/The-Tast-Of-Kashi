# 🪔 The Taste of Kashi

### Discover Food, Culture & Experiences

> **An immersive digital experience for discovering the food, heritage, stories, events, and unique experiences of Kashi (Varanasi).**

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7+-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Project%20Use-lightgrey)](#)

---

## 🌅 Overview

**The Taste of Kashi** is a modern cultural discovery platform inspired by the timeless identity of **Kashi (Varanasi)**.

Instead of treating Varanasi simply as a tourist destination, the platform brings together its **food, temples, ghats, cultural stories, local vendors, events, and experiences** into one immersive digital interface.

The goal is simple:

> **Help people discover Kashi beyond the usual tourist checklist.**

From famous Banarasi food to historic attractions and cultural stories, the application creates a visually rich way to explore the city and plan meaningful experiences.

---

## ✨ Key Features

### 🏠 Immersive Dashboard

* Cinematic Kashi-inspired hero experience
* Personalized welcome section
* Kashi Chronometer
* Today's highlights
* Journey statistics
* Quick access to major discovery sections

### 🍛 Explore Foods

Discover iconic foods and flavors associated with Kashi, including:

* Banarasi Chaat
* Banarasi Paan
* Malaiyyo
* Kachori-Sabzi
* Lassi
* Jalebi & Imarti
* Kulfi-Falooda
* Malpua-Rabri
* Thandai
* And more

### 🛕 Attractions

Explore important cultural and heritage destinations such as:

* Kashi Vishwanath
* Dashashwamedh Ghat
* Manikarnika Ghat
* Assi Ghat
* Sarnath
* Ramnagar Fort
* Swarved Mahamandir
* And other notable locations

### 📖 Stories & Legends

Explore stories connected with the cultural and spiritual identity of Kashi.

The interface organizes stories into thematic experiences so users can discover the meaning behind the places and traditions they encounter.

### 🎉 Events & Aarti

Explore cultural events and spiritual experiences associated with Kashi, including festival and Aarti-oriented information.

### 🗺️ Map Explorer

A dedicated exploration experience for discovering locations across Kashi.

### 🏪 Local Vendors

Discover local food and experience vendors and their relationship with the city's culture.

### ❤️ My Journeys & Wishlist

Users can save interesting discoveries and build their personal Kashi exploration journey.

### 🤖 AI Assistant

An AI-oriented assistant interface designed to make cultural discovery and exploration more interactive.

### 👥 Community

A dedicated space for community-oriented discovery and interaction.

### ⚙️ Settings & Authentication

Includes:

* Login
* Signup
* Forgot Password
* Protected routes
* User settings
* Authentication context

---

## 🎨 Design Philosophy

The interface is designed around the visual identity of Kashi rather than a generic travel-dashboard template.

### Design principles

* 🌑 Dark cinematic interface
* 🪔 Warm gold accents inspired by temple lighting
* 🛕 Heritage-focused imagery
* 🎞️ Immersive visual storytelling
* 📱 Responsive application experience
* 🧭 Exploration-first navigation
* ✨ Premium, modern UI

The design intentionally combines **heritage aesthetics with modern web application patterns**.

---

## 🧩 Application Architecture

The current application is structured as a modern React + Vite frontend:

```text
The-Tast-Of-Kashi/
│
├── public/
│   ├── images/
│   ├── hero-bg.png
│   ├── dashboard-bg.jpg
│   ├── map-bg.png
│   └── ...
│
├── src/
│   ├── components/
│   │   └── ui/
│   │
│   ├── context/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── pages/
│   │   ├── ai-assistant.tsx
│   │   ├── attractions.tsx
│   │   ├── community.tsx
│   │   ├── dashboard.tsx
│   │   ├── events.tsx
│   │   ├── foods.tsx
│   │   ├── map.tsx
│   │   ├── stories.tsx
│   │   ├── vendors.tsx
│   │   └── wishlist.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* Modern component-based architecture
* Responsive UI design

### UI & Styling

* CSS
* Reusable UI components
* Responsive layouts
* Interactive dialogs, cards, navigation and forms

### Development

* **Node.js**
* **npm**
* **Git**
* **GitHub**

---

## 📦 Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* Git installed

### 1. Clone the repository

```bash
git clone https://github.com/adityaraj-projects/The-Tast-Of-Kashi.git
```

### 2. Navigate to the project

```bash
cd The-Tast-Of-Kashi
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available on the local development URL shown by Vite.

---

## 🏗️ Production Build

To verify the application for production:

```bash
npm run build
```

The build process performs the TypeScript check and generates the optimized Vite production bundle.

To preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Environment Variables

If environment-specific configuration is required, create a local `.env` file.

**Never commit real secrets or private API keys to GitHub.**

Example:

```env
# Add project-specific environment variables here
```

The repository's `.gitignore` is configured to keep environment files out of version control.

---

## 📸 Screenshots

### Dashboard

> Add the final production dashboard screenshot here.

### Food Discovery

> Add the food discovery screenshot here.

### Attractions

> Add the attractions screenshot here.

### Stories

> Add the stories screenshot here.

### Map Explorer

> Add the map screenshot here.

---

## 🎯 Project Goals

The platform aims to make cultural exploration of Kashi:

* More discoverable
* More visual
* More interactive
* More accessible
* More personalized

The larger vision is to create a digital bridge between **travel discovery, local culture, food heritage, and modern technology**.

---

## 🗺️ Roadmap

### Phase 1 — Core Experience

* [x] Immersive dashboard
* [x] Food discovery
* [x] Attraction discovery
* [x] Vendor discovery
* [x] Stories & legends
* [x] Events experience
* [x] Map explorer
* [x] Wishlist
* [x] Authentication UI
* [x] AI assistant interface

### Phase 2 — Platform Expansion

* [ ] Production backend integration
* [ ] Persistent user profiles
* [ ] Dynamic cultural content
* [ ] Real-time event information
* [ ] Advanced trip planning
* [ ] Personalized recommendations
* [ ] More intelligent AI-powered discovery

### Phase 3 — Intelligent Cultural Discovery

* [ ] AI-powered itinerary generation
* [ ] Context-aware recommendations
* [ ] Conversational travel planning
* [ ] Local experience discovery
* [ ] Richer cultural knowledge layer

---

## 💡 Why This Project?

Tourists often know **that Varanasi is famous**, but discovering the deeper experience of Kashi can be difficult.

Where should someone start?

What food should they try?

Which places have cultural significance?

What stories are connected to those places?

Which local experiences are worth exploring?

**The Taste of Kashi** aims to bring these discoveries together in one experience.

---

## 👨‍💻 Project

**The Taste of Kashi**

Built as a modern web application focused on:

```text
Food
  +
Culture
  +
Heritage
  +
Stories
  +
Experiences
  +
Technology
```

---

## 📄 License

This project is currently intended for **educational, portfolio, and demonstration purposes**.

Please check the repository before reusing project assets, imagery, or content.

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

**Made with ❤️ for Kashi — the city of timeless stories.**

---

### 🔗 Repository

[The-Tast-Of-Kashi](https://github.com/adityaraj-projects/The-Tast-Of-Kashi)
