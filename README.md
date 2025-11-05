# Interactive Prototypes

A collection of interactive web prototypes and UI experiments for TestifySec.

## Projects

### 🔐 TestifySec Login Page (`testifysec-login/`)

A beautiful glass morphism login page featuring:

- **Animated wave background** with authentic TestifySec spectrum wave animation
- **Frosted glass design** with TestifySec brand gradient colors
- **OAuth integration** with GitHub, GitLab, and Google
- **Interactive elements** with TestifySec orange highlights
- **Responsive design** optimized for all devices

**Features:**
- Canvas-based wave animation with vertical breathing motion
- Glass morphism login container with backdrop blur
- Brand-consistent orange (#FFA624) focus states
- Subtle gradient glow effects matching wave colors
- Professional form validation and loading states

**Technologies:**
- Vanilla HTML5, CSS3, and JavaScript
- Canvas 2D API for wave animations
- CSS backdrop-filter for glass effects
- Responsive CSS Grid layout

**Demo:** Open `testifysec-login/index.html`

---

### 📋 SSP Pitch Demo (`ssp-pitch-demo/`)

An interactive demonstration of the proposed 5-minute onboarding journey from signup to first SSP generation.

- **4-phase onboarding flow** with realistic browser mockups
- **GitHub/GitLab integration** simulation with OAuth flows
- **Interactive repository selection** with search and filtering
- **Real-time SSP generation** with AI agent progress visualization
- **Professional Heroicons** throughout the interface
- **Optimized form layouts** to reduce vertical scrolling

**Features:**
- Complete signup and organization setup simulation
- Dual GitHub/GitLab app installation flows
- Smart repository discovery and product creation
- Live AI agent with progress tracking and activity logs
- Responsive design with side-by-side form layouts on desktop
- Tailwind CSS integration with custom TestifySec theme
- Educational content explaining each step of the process

**Use Case:**
This prototype demonstrates the streamlined user experience proposed in GitHub issue #2069, designed to reduce time-to-first-SSP from hours to under 5 minutes.

**Technologies:**
- HTML5, CSS3, JavaScript
- Tailwind CSS with custom configuration
- Heroicons SVG icon library
- Responsive CSS Grid and Flexbox
- Interactive browser mockup interface

**Demo:** Open `ssp-pitch-demo/index.html`

## Getting Started

Each project is self-contained and can be run independently:

1. **TestifySec Login:** Open `testifysec-login/index.html` in any modern web browser
2. **SSP Pitch Demo:** Open `ssp-pitch-demo/index.html` in any modern web browser

## Browser Compatibility

All prototypes support modern web browsers including:
- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Repository Structure

```
/
├── README.md
├── testifysec-login/          # Glass morphism login page
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── hero-background.js
│   └── assets/
└── ssp-pitch-demo/           # Interactive SSP onboarding demo
    ├── index.html
    ├── styles.css
    ├── script.js
    └── testifysec-logo.png
```

---

Built with ❤️ for TestifySec