# Dogstudio Clone 🐾

A frontend clone of [dogstudio.co](https://dogstudio.co/) — a multidisciplinary creative studio website — built as a learning project to practice 3D web development, animations, and modern frontend techniques.


## Original Site

[https://dogstudio.co/](https://dogstudio.co/)



## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) — React renderer for Three.js
- [Three.js](https://threejs.org/) — 3D graphics library
- CSS — Custom styling with pseudo-elements, fixed positioning, and scroll-based interactions



## Features

- 3D model rendered with React Three Fiber
- Fixed canvas background with transparent overlay
- Scroll-based section transitions
- Hover-triggered background image switching (Section 2)
- Custom typography with GT Sectra Display & Heebo fonts
- Responsive layout

---

## Project Structure

```
├── app/
│   ├── page.tsx          # Main app layout
│   ├── globals.css       # Global styles
│   └── components/
│       └── hero.tsx      # 3D Hero component (R3F)
├── public/
│   ├── backgrounds/      # Section 2 background images
│   ├── fonts/            # Custom fonts
│   └── background-l.png  # Main background image
```


## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/dogstudio-clone.git

# Navigate into the project
cd agency

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## What I Learned

- How React Three Fiber integrates with Next.js
- Why `::after` pseudo-elements don't work on `<canvas>` in Chrome/Firefox (only Safari)
- How to layer fixed elements using z-index for background effects
- How to use CSS `:has()` selector for hover-triggered image transitions
- The difference between replaced elements and regular HTML elements in CSS

## Disclaimer

This project is for **educational purposes only**. All design credits go to [Dogstudio](https://dogstudio.co/). No commercial use intended.
