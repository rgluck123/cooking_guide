# Cooking Guide — Codebase Integration Rules for Figma Design System

**Purpose:** Comprehensive guide for implementing Figma designs using the Model Context Protocol (MCP) with design token mapping, component architecture, and styling patterns.

**Last Updated:** May 4, 2026  
**Project:** Cooking Guide (React + Vite)  
**Design System Reference:** [Figma Design System](https://www.figma.com/design/AOUfZZYXj7EC1kIUSG47HH/HCI-Project)

---

## 1. Design System Structure

### 1.1 Token Definitions

**Location:** `src/index.css` (CSS Custom Properties)  
**Format:** CSS Variables (CSS Custom Properties) in `:root` selector  
**Usage Pattern:** Referenced via `var(--token-name)` throughout codebase

#### Token Categories

**Colors (Semantic):**
```css
/* Primary Brand */
--accent-green: #4A6B44;         /* Warm sage green — primary action, accents */
--accent-green-light: #E8EBE6;   /* Light green — backgrounds, hover states */
--accent-orange: #E07A5F;        /* Orange accent — warnings, active indicators */
--accent-yellow: #F4D35E;        /* Yellow accent — highlights, secondary accents */

/* Functional / Neutral */
--bg: #FAFAF8;                   /* Page background — warm off-white */
--surface: #FFFFFF;              /* Card/surface background */
--text: #3D3D3D;                 /* Primary text — dark warm gray */
--text-light: #7A7A7A;           /* Secondary text — lighter gray */
--border: #EAEAEA;               /* Border and divider lines */
--shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Consistent drop shadow */
```

**Typography:**
```css
--sans: 'Inter', system-ui, sans-serif;      /* Body text, labels, UI */
--heading: 'Nunito', system-ui, sans-serif;  /* H1–H6, large display text */
```

**Spacing & Layout:**
Not explicitly defined in CSS — follows implicit 8pt/4pt grid:
- `4px` — micro gaps, inline spacing
- `8px` — tight spacing (tags, small gaps)
- `12px` — small padding, card inner spacing
- `16px` — standard card padding, gaps
- `24px` — section gaps, major spacing
- `32px` — screen padding, major top-level margins

### 1.2 Token Transformation & Mapping

**MCP Integration Pattern:**

When pulling design tokens from Figma via MCP design context:

1. **Figma Token Format:** Typically WCAG-compliant hex/rgba + semantic name
2. **Mapping Target:** Map Figma tokens to existing CSS custom property names
3. **Fallback Pattern:** If new color/property needed, add to `:root` in `src/index.css`

**Example MCP Workflow:**
```
Figma Token: "color/green/primary" (#4A6B44)
↓ Maps to
CSS Variable: --accent-green (#4A6B44)
↓ Usage in Component
style={{ color: 'var(--accent-green)' }}
```

**No Token Transformation Pipeline:** The codebase does NOT use token generation tools (like Token Studio, Tailwind config generators, etc.). Tokens are manually maintained in CSS and applied inline.

---

## 2. Component Library Architecture

### 2.1 Component Organization

**Location:** `src/components/` (shared reusable components)  
**Location:** `src/pages/` (page-level / route-specific containers)

#### Current Components

| Component | Path | Purpose | Styling Pattern |
|-----------|------|---------|-----------------|
| **RecipeCard** | `src/components/RecipeCard.jsx` | Recipe preview, book link card | Inline styles + conditional SVG |
| **BottomNav** | `src/components/BottomNav.jsx` | Bottom navigation bar | Inline styles + useLocation hook |
| **HorizontalScroll** | `src/components/HorizontalScroll.jsx` | Horizontal carousel wrapper | Inline styles + scroll snap |
| **CookingTimer** | `src/components/CookingTimer.jsx` | Timer countdown component | Inline styles + useState |
| **InteractiveIngredient** | `src/components/InteractiveIngredient.jsx` | Swipeable ingredient item | Inline styles + touch handlers |
| **SubstituteModal** | `src/components/SubstituteModal.jsx` | Modal for ingredient substitution | Inline styles + conditional rendering |
| **DeboningModal** | `src/components/DeboningModal.jsx` | Modal for deboning instructions | Inline styles + conditional rendering |

#### Pages

| Page | Path | Route | Purpose |
|------|------|-------|---------|
| **Home** | `src/pages/Home.jsx` | `/` | Hero, search, recent recipes, cuisines, recipe book |
| **Results** | `src/pages/Results.jsx` | `/results` | Recipe search results grid |
| **Filter** | `src/pages/Filter.jsx` | `/filter` | Advanced recipe filtering |
| **RecipeOverview** | `src/pages/RecipeOverview.jsx` | `/recipe/:id` | Detailed recipe with ingredients |
| **LiveCooking** | `src/pages/LiveCooking.jsx` | `/live-cooking` | Step-by-step cooking guide (full screen) |

### 2.2 Component Architecture Pattern

**Props-based composition:**

```jsx
// RecipeCard — example pattern for all components
const RecipeCard = ({ title, time, image, isBookLink = false, onClick }) => {
  // Conditional rendering based on boolean prop
  if (isBookLink) {
    return <BookVariant />;
  }
  return <CardVariant />;
};
```

**No component abstractions layer:** Components are direct implementations, not wrapped in Storybook or documentation system.

**Styling consistency:** All components use inline `style={{}}` object notation; no external CSS files for component styles (see Section 6).

---

## 3. Frameworks & Libraries

### 3.1 Core Frameworks

**React:** v19.2.5  
- React Router DOM v7.14.2 for SPA routing
- React Compiler enabled (via Babel plugin) for performance optimization

**Bundler:** Vite v8.0.10

### 3.2 Styling & CSS-in-JS

**Pattern:** Inline styles + CSS Custom Properties (no styled-components, CSS Modules, or Tailwind)

```jsx
// Standard inline style pattern
<div style={{
  backgroundColor: 'var(--surface)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border)'
}}>
  Content
</div>
```

**Global CSS:** `src/index.css`
- CSS variables (`:root`)
- Global body/heading styles
- Mobile container layout (max-width 480px)
- Scrollbar hide utility (`.no-scrollbar`)

**Component CSS:** Minimal — only `src/App.css` (currently empty)

### 3.3 Icon System

**Library:** Lucide React v1.14.0 + React Feather v2.0.10

**Usage Pattern:**
```jsx
import { Home, Search, BookOpen, User, Clock } from 'lucide-react';

<Home size={24} color="var(--accent-green)" />
```

**Icon Sizing Convention:**
- `size={10px}` — micro inline (next to text)
- `size={16px}` — small (tags, captions)
- `size={20px}` — standard (nav items, buttons)
- `size={24px}` — large (headers, prominent actions)
- `size={28px}` — extra large (hero icons)

**Color Mapping:**
- `color="var(--text)"` — neutral/default
- `color="var(--accent-green)"` — primary actions
- `color="var(--accent-orange)"` — warnings/active states
- `color="white"` — on dark/colored backgrounds

---

## 4. Asset Management

### 4.1 Asset Storage & References

**Images:** External URLs (Unsplash)  
**Example:** `https://images.unsplash.com/photo-XXXXX?auto=format&fit=crop&w=300&q=80`

**Pattern:** Images referenced inline in component props, not stored locally

```jsx
const cuisines = [
  { 
    name: 'Lebanese', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80' 
  }
];
```

### 4.2 SVG & Custom Graphics

**Book Icon:** Custom SVG generated inline in `RecipeCard.jsx` for "My Recipe Book"

```jsx
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="180" 
  height="220" 
  viewBox="0 0 180 220"
  fill="none" 
  stroke="var(--text)" 
  strokeWidth="1"
>
  {/* Book shape with binding, spine, bookmark */}
</svg>
```

**Pattern:** Custom SVGs defined inline for branding elements; standard icons via Lucide

### 4.3 Asset Optimization

**No local optimization pipeline:** Relies on Unsplash URL parameters:
- `?auto=format` — WebP if supported
- `?fit=crop` — Aspect ratio control
- `?w=WIDTH&q=QUALITY` — Size and quality parameters

---

## 5. Icon System Details

### 5.1 Icon Library Strategy

**Primary:** Lucide React (Feather-style icons, stroke-based)  
**Secondary:** React Feather (fallback, same aesthetic)

**Icon Naming Convention:** None enforced — uses Lucide library names directly
- `Home`, `Search`, `BookOpen`, `User`
- `ChevronLeft`, `ChevronRight`, `Plus`, `X`
- `Clock`, `Clock3`, `Bookmark`, `Play`, `Pause`
- `Pencil`, `Info`, `RotateCcw`, `SlidersHorizontal`

### 5.2 Icon Usage Patterns

**Navigation Icons (BottomNav):**
```jsx
const navItems = [
  { name: 'Home', path: '/', icon: <Home size={24} /> },
  { name: 'Search', path: '/results', icon: <Search size={24} /> },
  { name: 'My Book', path: '#', icon: <BookOpen size={24} /> },
  { name: 'Profile', path: '#', icon: <User size={24} /> }
];
```

**Conditional Icon Coloring (active state):**
```jsx
color={isActive ? 'var(--accent-green)' : 'var(--text-light)'}
fontWeight={isActive ? '700' : '500'}
```

**Icon Buttons:**
```jsx
<button style={{ 
  width: '48px', 
  height: '48px', 
  borderRadius: '50%', 
  backgroundColor: 'var(--accent-green-light)',
  border: 'none',
  cursor: 'pointer'
}}>
  <Pencil size={20} color="var(--accent-green)" />
</button>
```

---

## 6. Styling Approach

### 6.1 CSS Methodology

**Pattern:** Inline styles + CSS Custom Properties (no BEM, SMACSS, or utility-first framework)

**Rationale:**
- Component-scoped styles avoid naming collisions
- CSS variables enable consistent theming
- React inline styles allow dynamic prop-based styling
- Vite/React Compiler optimize inline objects at build time

### 6.2 Global Styles

**File:** `src/index.css`

```css
:root {
  /* Color tokens */
  --accent-green: #4A6B44;
  --accent-green-light: #E8EBE6;
  /* ... other tokens ... */
  
  /* Font families */
  --sans: 'Inter', system-ui, sans-serif;
  --heading: 'Nunito', system-ui, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--sans);
  color: var(--text);
  background-color: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading);
  margin: 0;
  color: var(--text);
}

p { margin: 0; }

.mobile-app-container {
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: var(--bg);
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

### 6.3 Component Styling Pattern

**Inline objects with token references:**

```jsx
// Standard button
style={{
  backgroundColor: 'var(--accent-green)',
  color: 'white',
  border: 'none',
  borderRadius: '24px',
  padding: '16px 24px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: 'var(--shadow)'
}}

// Conditional styling
style={{
  color: isActive ? 'var(--accent-green)' : 'var(--text-light)',
  fontWeight: isActive ? '700' : '500'
}}

// Nested/layout styling
style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '20px',
  backgroundColor: 'var(--surface)',
  borderRadius: '12px'
}}
```

### 6.4 Responsive Design

**Mobile-First Approach:**

- Base breakpoint: `max-width: 480px` (`.mobile-app-container`)
- No media queries in codebase currently
- Flexbox/grid used for adaptive layouts

**Touch Interactions:**
```jsx
const handleTouchStart = (e) => touchStartX = e.touches[0].clientX;
const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) nextStep(); // Swipe left
};
```

**Safe Area Insets (mobile notch support):**
```jsx
padding: '12px 0 calc(12px + env(safe-area-inset-bottom))'
```

---

## 7. Project Structure

### 7.1 Directory Organization

```
cooking_guide/
├── src/
│   ├── assets/              (empty — images via external URLs)
│   ├── components/          (7 reusable components)
│   │   ├── BottomNav.jsx
│   │   ├── CookingTimer.jsx
│   │   ├── DeboningModal.jsx
│   │   ├── HorizontalScroll.jsx
│   │   ├── InteractiveIngredient.jsx
│   │   ├── RecipeCard.jsx
│   │   └── SubstituteModal.jsx
│   ├── pages/               (5 page components / routes)
│   │   ├── Filter.jsx
│   │   ├── Home.jsx
│   │   ├── LiveCooking.jsx
│   │   ├── RecipeOverview.jsx
│   │   └── Results.jsx
│   ├── App.jsx              (root layout, routing)
│   ├── App.css              (empty, reserved for app styles)
│   ├── index.css            (global styles + token definitions)
│   └── main.jsx             (React entry point)
├── other/
│   ├── design_guideline.html (Hi-Fi design system documentation)
│   └── Figma links.txt      (Figma design file URLs)
├── vite.config.js           (Vite build config)
├── eslint.config.js         (ESLint rules)
├── package.json             (dependencies)
├── README.md                (project overview)
└── CLAUDE.md                (this file)
```

### 7.2 Feature Organization Pattern

**Feature ownership by route:**

```
Home (/)
├── Heading + user profile button
├── Search input + filter button
├── Recent Recipes (HorizontalScroll + RecipeCard)
├── Cuisines (HorizontalScroll + category tiles)
└── My Recipe Book (HorizontalScroll + RecipeCard with book variant)

RecipeOverview (/recipe/:id)
├── Hero image
├── Recipe metadata (time, difficulty, servings)
├── Deboning info banner
├── Interactive ingredients list
└── Start Cooking button (navigate to /live-cooking)

LiveCooking (/live-cooking)
├── Header with back/home buttons
├── Progress bar
├── Large step number (02)
├── Instruction card
├── Timer (conditional)
├── Modify button (round icon)
└── Previous/Next pill buttons
```

### 7.3 Routing Architecture

**File:** `src/App.jsx`  
**Router:** React Router DOM v7

```jsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  <AppLayout />
  {!shouldHideNav && <BottomNav />}
</BrowserRouter>

// Routes
<Route path="/" element={<Home />} />
<Route path="/filter" element={<Filter />} />
<Route path="/results" element={<Results />} />
<Route path="/recipe/:id" element={<RecipeOverview />} />
<Route path="/live-cooking" element={<LiveCooking />} />
```

**Navigation Patterns:**
- `useNavigate()` hook for programmatic navigation
- `useLocation()` hook for current route detection
- `hideNavRoutes` array to conditionally show/hide BottomNav

### 7.4 State Management

**No centralized state manager (Redux, Zustand, etc.)**

**Pattern:** Component-level `useState()` hooks

**Example (LiveCooking):**
```jsx
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
```

**Example (RecipeOverview):**
```jsx
const [ingredients, setIngredients] = useState(initialIngredients);
const [isSubModalOpen, setIsSubModalOpen] = useState(false);
```

---

## 8. Build & Deployment

### 8.1 Build Pipeline

**Bundler:** Vite v8.0.10  
**Framework Plugin:** @vitejs/plugin-react v6.0.1  
**Transpiler:** Babel with React Compiler preset

**Build Commands:**
```bash
npm run dev      # Start dev server (HMR enabled)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run deploy   # Build + push to GitHub Pages
```

**Output:** Static SPA deployed to GitHub Pages at `https://rgluck123.github.io/cooking_guide`

### 8.2 Base Path Configuration

**Vite Config:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: "/cooking_guide"  // GitHub Pages subdirectory
});
```

**React Router:**
```jsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  {/* Routes */}
</BrowserRouter>
```

---

## 9. MCP Integration Guidelines for Figma Design System

### 9.1 Design Context Extraction Workflow

When using MCP `get_design_context` to extract Figma designs:

**Input:**
```
fileKey: "AOUfZZYXj7EC1kIUSG47HH"  (from Figma URL)
nodeId: "page-id:component-id"     (from Figma node selection)
```

**Output Expected:**
- Reference code (React JSX snippet)
- Screenshot (PNG for visual reference)
- Design tokens (colors, typography, spacing)
- Component metadata (props, variants)

### 9.2 Token Mapping Checklist

When integrating new components from Figma:

- [ ] Identify all colors → map to `--accent-*` or `--bg`/`--surface`/`--text`
- [ ] Identify typography → use `fontFamily: 'var(--sans)'` or `'var(--heading)'`
- [ ] Identify spacing → use `8px` grid multiples (8, 12, 16, 24, 32)
- [ ] Identify shadows → use `boxShadow: 'var(--shadow)'`
- [ ] Identify border radius → use `borderRadius: '12px'` (or '16px', '24px' as designed)
- [ ] Identify responsive breakpoints → apply flexbox/grid layout rules

### 9.3 Component Implementation Pattern

**Template for new component from Figma:**

```jsx
import React from 'react';

const NewComponent = ({ prop1, prop2, variant = 'default' }) => {
  // Conditional rendering for variants
  if (variant === 'special') {
    return <SpecialVariant />;
  }

  return (
    <div style={{
      // Layout
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      
      // Surface
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: 'var(--shadow)',
      
      // Typography (if needed)
      fontFamily: 'var(--sans)',
      color: 'var(--text)',
      fontSize: '14px',
      lineHeight: '1.6'
    }}>
      {/* Content */}
    </div>
  );
};

export default NewComponent;
```

### 9.4 Code Connection Best Practices

**Location:** Components in `src/components/` directory  
**Naming:** PascalCase (e.g., `RecipeCard`, `CookingTimer`)  
**Props:** Destructured from single object parameter  
**Styling:** Inline styles object with CSS variable references  
**Exports:** Default export only  

**Bad Pattern (avoid):**
```jsx
// Multiple exports
export const Component = () => {};
export const Variant = () => {};

// External CSS file
import './styles.css';

// Hard-coded colors
backgroundColor: '#4A6B44'
```

**Good Pattern (follow):**
```jsx
// Single default export
const Component = ({ prop1, prop2 }) => (
  <div style={{ backgroundColor: 'var(--accent-green)' }}>
    Content
  </div>
);

export default Component;
```

---

## 10. Design System Consistency Checklist

Use this checklist when implementing new screens/components from Figma:

### Colors
- [ ] Primary action button → `--accent-green` (#4A6B44)
- [ ] Light backgrounds/hovers → `--accent-green-light` (#E8EBE6)
- [ ] Page background → `--bg` (#FAFAF8)
- [ ] Cards/surfaces → `--surface` (#FFFFFF)
- [ ] Primary text → `--text` (#3D3D3D)
- [ ] Secondary text → `--text-light` (#7A7A7A)
- [ ] Borders → `--border` (#EAEAEA)
- [ ] Shadows → `boxShadow: 'var(--shadow)'`

### Typography
- [ ] Headings (H1–H6) → `fontFamily: 'var(--heading)'` (Nunito)
- [ ] Body text → `fontFamily: 'var(--sans)'` (Inter)
- [ ] All margin/padding reset → applied in global styles

### Spacing
- [ ] Gaps between items → multiples of 8px (8, 12, 16, 24, 32)
- [ ] Card padding → 16px or 20px
- [ ] Section padding → 24px or 32px
- [ ] Border radius → 12px (cards), 16px (larger), 24px (pills)

### Components
- [ ] Mobile-first responsive → max-width 480px container
- [ ] Touch targets → min 44×44px for buttons
- [ ] Icons → via Lucide React, size 16–28px
- [ ] Modals → fixed positioning, backdrop blur optional
- [ ] Buttons → pill-shaped (border-radius: 24px+) or rounded (12–16px)

### Accessibility
- [ ] Images have alt text (or aria-hidden if decorative)
- [ ] Buttons keyboard accessible
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Font size minimum 14px for body text

---

## 11. Common Patterns & Anti-Patterns

### Pattern: Dynamic Inline Styles with Conditions

**Good:**
```jsx
style={{
  color: isActive ? 'var(--accent-green)' : 'var(--text-light)',
  fontWeight: isActive ? '700' : '500'
}}
```

**Avoid:**
```jsx
style={isActive ? activeStyle : inactiveStyle}  // Style objects in separate vars
className={isActive ? 'active' : 'inactive'}    // Class names (use inline styles)
```

### Pattern: Token References

**Good:**
```jsx
backgroundColor: 'var(--accent-green)'
border: '1px solid var(--border)'
boxShadow: 'var(--shadow)'
```

**Avoid:**
```jsx
backgroundColor: '#4A6B44'
border: '1px solid #EAEAEA'
boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
```

### Pattern: Component Props

**Good:**
```jsx
const RecipeCard = ({ title, time, image, isBookLink = false, onClick }) => {
  // Use props directly
}
```

**Avoid:**
```jsx
const RecipeCard = (props) => {
  // Destructure in multiple places
  const title = props.title;
  const time = props.time;
}
```

### Pattern: Conditional Rendering

**Good:**
```jsx
if (isBookLink) {
  return <BookVariant />;
}
return <CardVariant />;
```

**Avoid:**
```jsx
{isBookLink && <BookVariant />}
{!isBookLink && <CardVariant />}
```

---

## 12. Known Limitations & Future Considerations

### Current Limitations

1. **No token generation pipeline** — tokens manually maintained in CSS
2. **No component storybook** — no documentation/showcase system
3. **No CSS Modules or BEM** — all inline styles (can scale poorly with many components)
4. **No global state management** — each component manages own state
5. **No typed props (TypeScript)** — uses plain JavaScript
6. **No accessibility audit** — manual WCAG compliance checks only
7. **No dark mode** — single light theme only

### Recommended Future Improvements

- [ ] Migrate to CSS Modules or styled-components for scalability
- [ ] Add TypeScript for prop validation
- [ ] Implement Storybook for component documentation
- [ ] Add design token generation from Figma (Token Studio or similar)
- [ ] Centralize state management (Zustand/Context API for complex flows)
- [ ] Add E2E testing (Playwright/Cypress)
- [ ] Add dark mode variant
- [ ] Set up accessibility testing (axe, Pa11y)

---

## 13. Quick Reference: File Editing Workflow

When implementing a new Figma design:

### Step 1: Extract from Figma
```bash
# Use MCP get_design_context with Figma URL
fileKey: "AOUfZZYXj7EC1kIUSG47HH"
nodeId: "extracted-from-figma-url"
```

### Step 2: Map Tokens
Review screenshot + code output, identify:
- Colors → match to CSS variables
- Typography → font + size + weight
- Spacing → 8pt grid multiples
- Shadows/borders → reference existing patterns

### Step 3: Create/Update Component
```bash
# Create new component in src/components/ComponentName.jsx
# OR update existing component in src/pages/PageName.jsx
```

### Step 4: Apply Styling
Use inline `style={{}}` object with token references:
```jsx
<div style={{
  backgroundColor: 'var(--surface)',
  borderRadius: '12px',
  padding: '20px',
  /* ... */
}}>
```

### Step 5: Test Locally
```bash
npm run dev     # Start dev server
# Test at http://localhost:5173/cooking_guide
# Hot reload on file save
```

### Step 6: Deploy
```bash
npm run build   # Production build
npm run deploy  # Push to GitHub Pages
```

---

## 14. References & Resources

**Figma Design Files:**
- [LowFi Prototype](https://www.figma.com/design/AOUfZZYXj7EC1kIUSG47HH/HCI-Project?node-id=0-1)
- [HiFi Design Ideas](https://www.figma.com/design/AOUfZZYXj7EC1kIUSG47HH/HCI-Project?node-id=0-1)

**Design Guideline:** `other/design_guideline.html`

**Documentation in Codebase:**
- `src/index.css` — CSS tokens + global styles
- `vite.config.js` — build configuration
- `README.md` — project overview

**External Libraries:**
- [Lucide React](https://lucide.dev/) — icon library
- [React Router](https://reactrouter.com/) — routing
- [Vite](https://vitejs.dev/) — bundler
- [React Compiler](https://react.dev/learn/react-compiler) — performance optimization

---

**Document Version:** 1.0  
**Last Reviewed:** May 4, 2026  
**Maintained By:** AI Assistant (Copilot)
