# Weather Forecast App

A beautifully modern, feature-rich React application for viewing 30-day weather forecasts and exploring in-depth temperature stability insights for any city worldwide.

---

## 🌤️ Overview

This app delivers an elegant, ultra-modern weather experience using the latest UI best practices (React + Vite + TypeScript + Tailwind CSS + shadcn/ui). Get up-to-date forecasts, visual temperature charts, and analyze weather stability at a glance through interactive insights.

---

## ✨ Features

- **Modern UI & Visuals**: Polished Appbar, responsive containers, and vibrant gradients powered by shadcn/ui and Tailwind.
- **City Search with Suggestions**: Easily find forecast data for any location worldwide.
- **30-Day Forecast Chart**: Interactive temperature graph with tooltips, clean axis, and clear daily visualization.
- **Advanced Weather Stability Analysis**:
  - Calculates and summarizes trend, volatility, range, and possible anomalies in temperature data.
  - Detects rapid warming/cooling streaks, trends, and flags unstable intervals.
  - Renders stability scores and icons with intuitive badges/colors.
- **Mobile Responsive**: Fully responsive design for all devices.

---

## 📝 Weather Stability Analysis: How It Works

- **Stability Score**: Measures week-to-week temperature fluctuations and overall stability.
- **Trend Detection**: Flags warming, cooling, or stable temperature trends over the forecast period.
- **Volatility**: Shows how much temperatures swing day to day.
- **Anomalies**: Highlights runs of rapid warming/cooling (3+ days), extreme highs/lows, and unusual forecast patterns.
- **Clear Presentation**: Results are rendered as a summary card with color-coded status, helpful tooltips, and visual indicators for quick understanding.

---

## 🚀 Getting Started

1. Clone this repo:
   ```bash
   git clone <your-repo-url>
   cd weather-stability
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Visit [http://localhost:5173](http://localhost:5173) to use the app.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **Charts:** recharts
- **API:** OpenWeatherMap (or similar)

---

## 📸 Screenshots

> **(Add screenshots/GIFs of home, search, weather analysis card, and empty state for best effect.)**

---

## 🙌 Contributing
Contributions, feature requests, and bug reports are welcome! Open an issue or PR. Please see CONTRIBUTING.md if present.

---

## 📄 License
MIT (or specify your license).

