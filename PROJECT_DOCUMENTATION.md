# FC City Boys Zurich - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Routing System](#routing-system)
5. [Internationalization (i18n)](#internationalization-i18n)
6. [Layouts and Components](#layouts-and-components)
7. [Page Breakdown](#page-breakdown)
8. [State Management](#state-management)
9. [Styling System](#styling-system)
10. [Animations and Effects](#animations-and-effects)
11. [Media Handling](#media-handling)
12. [SEO and Performance](#seo-and-performance)
13. [Build and Deployment](#build-and-deployment)
14. [Adding New Features](#adding-new-features)
15. [Common Issues and Solutions](#common-issues-and-solutions)

---

## Project Overview

**FC City Boys Zurich** is a modern, multilingual football club website built with Next.js 16. The website showcases the club's history, team, training programs, gallery, and contact information. It supports English and German languages with a sophisticated routing system and modern UI/UX design.

### Key Features

- 🌍 **Bilingual Support**: English (en) and German (de)
- 🎨 **Modern UI**: Premium design with animations and effects
- 📱 **Responsive**: Mobile-first approach
- ⚡ **Performance Optimized**: Image optimization, code splitting
- 🎭 **Dark Mode Ready**: Theme system in place
- 🎬 **Animations**: Framer Motion for smooth interactions
- 🖼️ **Image Gallery**: Masonry layout with lightbox
- 📧 **Contact Forms**: Interactive contact page

---

## Technology Stack

### Core Framework
- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety

### UI Libraries
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-navigation-menu`
- **Framer Motion 12.29.0** - Animation library
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Utilities
- **clsx** & **tailwind-merge** - Class name utilities
- **class-variance-authority** - Component variants
- **react-masonry-css** - Masonry grid layout

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking

---

## Project Structure

```
fc-city-boys/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Language-based routing
│   │   ├── about/                # About page
│   │   │   └── page.tsx
│   │   ├── contact/               # Contact page
│   │   │   └── page.tsx
│   │   ├── faq/                  # FAQ page
│   │   │   └── page.tsx
│   │   ├── gallery/              # Gallery page
│   │   │   └── page.tsx
│   │   ├── our-team/             # Team page
│   │   │   └── page.tsx
│   │   ├── training/             # Training page
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Language layout wrapper
│   │   └── page.tsx              # Home page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Root redirect
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── scroll-to-top.tsx
│   │   └── textarea.tsx
│   ├── footer.tsx                # Footer component
│   ├── interactive-3d-ball.tsx   # 3D ball animation
│   ├── language-toggle.tsx      # Language switcher
│   ├── navigation.tsx            # Navigation bar
│   ├── premium-image-card.tsx    # Image card with effects
│   ├── spotlight-card.tsx        # Spotlight hover effect
│   ├── theme-provider.tsx        # Theme context
│   └── theme-toggle.tsx          # Theme switcher
│
├── contexts/                     # React contexts
│   └── language-context.tsx      # Language state management
│
├── lib/                          # Utility functions
│   ├── i18n.ts                   # Translation definitions
│   ├── i18n-loader.ts            # Translation loader
│   └── utils.ts                  # General utilities
│
├── messages/                     # Translation JSON files
│   ├── about/
│   │   ├── en.json
│   │   └── de.json
│   ├── contact/
│   │   ├── en.json
│   │   └── de.json
│   ├── faq/
│   │   ├── en.json
│   │   └── de.json
│   ├── gallery/
│   │   ├── en.json
│   │   └── de.json
│   ├── home/
│   │   ├── en.json
│   │   └── de.json
│   ├── navbar/
│   │   ├── en.json
│   │   └── de.json
│   ├── our-team/
│   │   ├── en.json
│   │   └── de.json
│   ├── training/
│   │   ├── en.json
│   │   └── de.json
│   └── footer/
│       ├── en.json
│       └── de.json
│
├── public/                       # Static assets
│   └── images/                   # Image assets
│       ├── about/
│       ├── contact/
│       ├── faq/
│       ├── home/
│       ├── players/
│       ├── sponsers/
│       └── training/
│
├── middleware.ts                 # Next.js middleware for routing
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── components.json              # shadcn/ui configuration
```

---

## Routing System

### Language-Based Routing

The project uses Next.js App Router with a dynamic `[lang]` segment for language-based routing.

#### Middleware (`middleware.ts`)

The middleware handles automatic language detection and redirection:

```typescript
// Key features:
1. Detects language from Accept-Language header
2. Redirects root paths to /[locale]/pathname
3. Excludes static files and API routes
4. Supports 'en' and 'de' locales
```

**Flow:**
1. User visits `/` → Middleware detects language → Redirects to `/en` or `/de`
2. User visits `/about` → Redirects to `/en/about` or `/de/about`
3. Static files (`/images/*`, `/_next/*`) bypass middleware

#### Route Structure

```
/                    → Redirects to /en
/en                  → Home page (English)
/de                  → Home page (German)
/en/about            → About page (English)
/de/about            → About page (German)
/en/contact          → Contact page (English)
/de/contact          → Contact page (German)
... (similar for all pages)
```

#### Root Layout (`app/layout.tsx`)

- Sets up fonts (Geist Sans, Geist Mono)
- Defines global metadata (SEO, OpenGraph)
- Provides base HTML structure

#### Language Layout (`app/[lang]/layout.tsx`)

- Wraps all language-specific pages
- Provides `LanguageProvider` context
- Includes `ScrollToTop` component
- Extracts `lang` from URL params

---

## Internationalization (i18n)

### Architecture

The i18n system uses a **namespace-based** approach with JSON files for translations.

### Translation Files Structure

Each page/component has its own namespace with separate JSON files per language:

```
messages/
├── home/
│   ├── en.json      # English translations for home
│   └── de.json      # German translations for home
├── about/
│   ├── en.json
│   └── de.json
...
```

### Translation Loader (`lib/i18n-loader.ts`)

**Key Functions:**

1. **`getMessages(lang, namespace)`** - Gets all messages for a namespace
2. **`getTranslation(lang, namespace, key)`** - Gets a specific translation

**Example:**
```typescript
getTranslation("en", "home", "hero.title")
// Returns: "FC CITY BOYS"
```

### Language Context (`contexts/language-context.tsx`)

**Features:**
- Extracts language from URL pathname
- Updates HTML `lang` attribute
- Provides translation function `t()`
- Handles language switching via URL updates

**Usage in Components:**
```typescript
// Method 1: Using useLanguage hook
const { t, language, getHref } = useLanguage()
const title = t("home", "hero.title")

// Method 2: Using useTranslations hook (namespace-bound)
const { t } = useTranslations("home")
const title = t("hero.title")
```

### Translation Function API

**Two formats supported:**

1. **Namespace + Key:**
   ```typescript
   t("home", "hero.title")  // Recommended
   ```

2. **Dot-notation (backward compatibility):**
   ```typescript
   t("home.hero.title")  // Falls back to namespace search
   ```

### Adding a New Language

1. **Add locale to middleware:**
   ```typescript
   // middleware.ts
   const locales = ['en', 'de', 'fr']  // Add 'fr'
   ```

2. **Create translation files:**
   ```
   messages/home/fr.json
   messages/about/fr.json
   ...
   ```

3. **Update i18n-loader.ts:**
   ```typescript
   import homeFr from '@/messages/home/fr.json'
   // Add to messages object
   ```

4. **Update language toggle:**
   ```typescript
   // components/language-toggle.tsx
   { code: "fr", label: "Français", codeLabel: "FR" }
   ```

---

## Layouts and Components

### Main Layouts

#### 1. Navigation (`components/navigation.tsx`)

**Features:**
- Fixed header with scroll detection
- Responsive mobile menu
- Active route highlighting
- Language toggle integration
- Logo with club branding

**Key Props:**
- `scrolled` state for background opacity
- `mobileMenuOpen` for mobile menu toggle
- Uses Framer Motion for animations

#### 2. Footer (`components/footer.tsx`)

**Sections:**
- Club branding and description
- Club links (About, History, Stadium, Academy)
- Support links (Contact, Tickets, Membership, FAQ)
- Legal links (Privacy, Terms, Cookies)
- Social media icons
- Copyright information

### Reusable Components

#### 1. PremiumImageCard (`components/premium-image-card.tsx`)

**Features:**
- Hover zoom effect (optional)
- Border glow on hover
- Moving light reflection
- Customizable height and rounded corners

**Props:**
```typescript
interface PremiumImageCardProps {
  src: string
  alt: string
  className?: string
  height?: string
  rounded?: string
  disableHoverZoom?: boolean
  children?: ReactNode
}
```

#### 2. SpotlightCard (`components/spotlight-card.tsx`)

**Features:**
- Interactive spotlight effect following mouse
- Smooth spring animations
- Customizable spotlight color and size

**Usage:**
```typescript
<SpotlightCard
  spotlightColor="rgba(59, 61, 172, 0.5)"
  spotlightSize={400}
>
  <Image ... />
</SpotlightCard>
```

#### 3. LanguageToggle (`components/language-toggle.tsx`)

**Features:**
- Dropdown menu with language options
- Visual indicator for current language
- Globe icon with language code
- Touch-friendly on mobile

#### 4. ScrollToTop (`components/ui/scroll-to-top.tsx`)

- Appears when user scrolls down
- Smooth scroll to top
- Fade in/out animation

### UI Components (shadcn/ui)

Located in `components/ui/`, these are Radix UI-based components:

- **Button** - Various variants (default, ghost, secondary)
- **Card** - Container with header, title, description
- **Dialog** - Modal dialogs
- **Accordion** - Collapsible content (used in FAQ)
- **Input** - Form inputs
- **Textarea** - Multi-line text input
- **DropdownMenu** - Dropdown menus
- **Label** - Form labels

---

## Page Breakdown

### Home Page (`app/[lang]/page.tsx`)

**Sections:**

1. **Hero Section**
   - Full-screen video background
   - Animated title and subtitle
   - Call-to-action buttons
   - Dark overlay for text readability

2. **About Preview**
   - Image with spotlight effect
   - Club description
   - "Learn More" button

3. **More Than a Club**
   - Two-column layout
   - Community-focused content
   - Image with hover effects

4. **Features Section**
   - 4 feature cards in grid
   - Icons and descriptions
   - Hover animations

5. **CTA Section**
   - Background image with overlay
   - Join club call-to-action
   - Contact button

**Animations:**
- Fade in on scroll
- Staggered children animations
- Hover scale effects

### About Page (`app/[lang]/about/page.tsx`)

**Sections:**

1. **Hero**
   - Large title and description
   - Image with diagonal triangle accent
   - Clickable image modal

2. **Stats Section**
   - 4 animated counters
   - Glow border frame
   - Icons and labels

3. **About Cards**
   - Club history
   - Why join us
   - Training philosophy
   - Community impact

4. **Vision & Mission**
   - Two-column cards
   - Icons and descriptions
   - Glow effects

5. **CTA Section**
   - Blue gradient background
   - Diagonal shapes overlay
   - Contact and training buttons

### Team Page (`app/[lang]/our-team/page.tsx`)

**Features:**
- Player cards with images
- Coach information
- Training schedule
- Achievements section
- Testimonials

### Gallery Page (`app/[lang]/gallery/page.tsx`)

**Features:**
- Masonry grid layout
- Filter buttons (All, Training, Match, Event)
- Lightbox modal for full-size images
- Lazy loading images

### Training Page (`app/[lang]/training/page.tsx`)

**Sections:**
- Indoor training schedule (November-April)
- Outdoor training schedule (May-October)
- Trainer profiles
- Location details with addresses

### FAQ Page (`app/[lang]/faq/page.tsx`)

**Features:**
- Accordion component for questions
- Categorized questions:
  - Club Information
  - Membership & Training
  - Matches & Events
  - Youth Academy
  - Contact & Support
  - Training & Academy
  - Match Days

### Contact Page (`app/[lang]/contact/page.tsx`)

**Sections:**

1. **Hero**
   - Large title
   - Description
   - Contact button

2. **Contact Cards**
   - Email card
   - Phone card

3. **Contact Form**
   - Name, Email, Subject, Message fields
   - Send button with loading state
   - Success/error messages

4. **Address Section**
   - Street address
   - City and country
   - Phone and email

5. **Social Media**
   - Facebook, Instagram, Twitter, YouTube links

6. **Office Hours**
   - Weekday hours
   - Weekend status

7. **Map Section**
   - Embedded Google Maps iframe
   - Get directions button

---

## State Management

### Language Context

**Location:** `contexts/language-context.tsx`

**State:**
- `language` - Current language ('en' | 'de')
- `mounted` - Client-side mount status

**Methods:**
- `setLanguage(lang)` - Changes language and updates URL
- `t(namespace, key)` - Translation function
- `getMessages(namespace)` - Get all messages for namespace
- `getHref(path, targetLang?)` - Generate language-prefixed href

**Usage:**
```typescript
const { language, setLanguage, t, getHref } = useLanguage()
```

### Theme Context (Future)

The project includes `theme-provider.tsx` using `next-themes`, but dark mode is not fully implemented in all components yet.

---

## Styling System

### Tailwind CSS 4

The project uses Tailwind CSS 4 with a custom theme configuration.

### Global Styles (`app/globals.css`)

**Key Features:**

1. **CSS Variables:**
   ```css
   --primary: #0054A8
   --primary-gradient-start: #0054A8
   --primary-gradient-mid: #1A5BA7
   --primary-gradient-end: #3061A6
   ```

2. **Dark Mode Support:**
   - Dark mode variables defined
   - Automatic theme switching ready

3. **Custom Utilities:**
   - `.bg-primary-gradient` - Primary gradient background
   - `.text-primary-gradient` - Gradient text
   - `.shadow-premium` - Premium shadow effects
   - `.glass-card` - Glassmorphism effect
   - `.gradient-border` - Animated gradient border

4. **Animations:**
   - Marquee animation for scrolling text
   - Gradient border animation
   - Smooth transitions

5. **Responsive Design:**
   - Mobile-first breakpoints
   - Touch-friendly targets (min 44px)
   - Reduced motion support

### Color Scheme

**Primary Color:** `#3b3dac` (Blue)
- Used for buttons, links, accents
- Consistent throughout the design

**Gradients:**
- Primary: `#0054A8` → `#3061A6`
- Used in backgrounds and text

### Typography

**Fonts:**
- **Geist Sans** - Primary font (via Next.js font optimization)
- **Geist Mono** - Monospace font

**Headings:**
- Large, bold, uppercase for hero sections
- Tracking-tight for modern look

---

## Animations and Effects

### Framer Motion

All animations use Framer Motion for smooth, performant animations.

### Common Animation Patterns

#### 1. **Fade In on Scroll**
```typescript
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

#### 2. **Staggered Children**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

#### 3. **Hover Effects**
```typescript
<motion.div
  whileHover={{ scale: 1.05, y: -8 }}
  transition={{ duration: 0.3 }}
>
```

#### 4. **Slide In**
```typescript
const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
}
```

### Custom Effects

1. **Spotlight Effect** - Mouse-following spotlight on cards
2. **Image Glow** - Border glow on image hover
3. **Gradient Border** - Animated gradient border
4. **Glassmorphism** - Frosted glass effect
5. **Counter Animation** - Number counting animation

---

## Media Handling

### Image Optimization

**Next.js Image Component:**
- Automatic optimization
- Lazy loading
- Responsive images
- WebP/AVIF format support

**Configuration (`next.config.ts`):**
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### Image Structure

```
public/images/
├── about/          # About page images
├── contact/        # Contact page images
├── faq/           # FAQ images
├── home/          # Home page images (including video)
├── players/       # Player photos
├── sponsers/      # Sponsor logos
└── training/      # Training images
```

### Video Handling

**Hero Video:**
- Located at `/images/home/football_video_hd.mp4`
- Autoplay, loop, muted
- Used in home page hero section

### Image Usage Patterns

1. **Standard Images:**
   ```typescript
   <Image
     src="/images/logo.png"
     alt="Logo"
     width={120}
     height={56}
   />
   ```

2. **Fill Images:**
   ```typescript
   <Image
     src="/images/ball.jpg"
     alt="Ball"
     fill
     className="object-cover"
   />
   ```

3. **Premium Image Cards:**
   ```typescript
   <PremiumImageCard
     src="/images/about/ab1.jpg"
     alt="About"
     height="h-[500px]"
   />
   ```

---

## SEO and Performance

### SEO Setup

**Metadata (`app/layout.tsx`):**
```typescript
export const metadata: Metadata = {
  title: "FC City Boys Zurich",
  description: "Official website...",
  keywords: ["football club", ...],
  openGraph: {
    title: "...",
    description: "...",
    images: [...]
  }
}
```

**Features:**
- Dynamic meta tags per page
- OpenGraph tags for social sharing
- Favicon configuration
- Theme color for mobile browsers

### Performance Optimizations

1. **Image Optimization:**
   - Next.js automatic optimization
   - Lazy loading
   - Responsive images

2. **Code Splitting:**
   - Automatic route-based splitting
   - Dynamic imports for heavy components

3. **Font Optimization:**
   - Next.js font optimization
   - Preload critical fonts
   - Display swap for better CLS

4. **Package Optimization:**
   ```typescript
   experimental: {
     optimizePackageImports: ['lucide-react', 'framer-motion']
   }
   ```

5. **Compression:**
   ```typescript
   compress: true
   ```

6. **React Strict Mode:**
   ```typescript
   reactStrictMode: true
   ```

### Performance Best Practices

- Use `priority` prop for above-the-fold images
- Lazy load below-the-fold content
- Use `viewport={{ once: true }}` for scroll animations
- Minimize bundle size with tree-shaking
- Use CSS for simple animations when possible

---

## Build and Deployment

### Development

```bash
npm run dev
# Starts development server at http://localhost:3000
```

### Build

```bash
npm run build
# Creates optimized production build in .next/
```

### Start Production Server

```bash
npm start
# Starts production server (requires build first)
```

### Linting

```bash
npm run lint
# Runs ESLint
```

### Deployment Options

1. **Vercel (Recommended):**
   - Automatic deployments from Git
   - Optimized for Next.js
   - Edge network for fast global delivery

2. **Other Platforms:**
   - Any Node.js hosting (requires `npm start`)
   - Docker containerization possible
   - Static export possible (with limitations)

### Environment Variables

Currently, no environment variables are required. If needed, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## Adding New Features

### Adding a New Page

1. **Create page file:**
   ```
   app/[lang]/new-page/page.tsx
   ```

2. **Create translation files:**
   ```
   messages/new-page/en.json
   messages/new-page/de.json
   ```

3. **Update i18n-loader.ts:**
   ```typescript
   import newPageEn from '@/messages/new-page/en.json'
   import newPageDe from '@/messages/new-page/de.json'
   
   // Add to messages object
   ```

4. **Add to navigation:**
   ```typescript
   // components/navigation.tsx
   const navItems = [
     ...
     { key: "newPage", href: "/new-page" }
   ]
   ```

5. **Add translations to navbar:**
   ```
   messages/navbar/en.json
   messages/navbar/de.json
   ```

### Adding a New Language

1. **Update middleware:**
   ```typescript
   const locales = ['en', 'de', 'new-lang']
   ```

2. **Create translation files for all namespaces:**
   ```
   messages/home/new-lang.json
   messages/about/new-lang.json
   ...
   ```

3. **Update i18n-loader.ts:**
   ```typescript
   import homeNewLang from '@/messages/home/new-lang.json'
   // Add to messages object
   ```

4. **Update language toggle:**
   ```typescript
   { code: "new-lang", label: "Language Name", codeLabel: "NL" }
   ```

### Adding a New Component

1. **Create component file:**
   ```
   components/new-component.tsx
   ```

2. **Follow component patterns:**
   - Use TypeScript
   - Add proper prop types
   - Include accessibility attributes
   - Use Tailwind for styling
   - Add animations with Framer Motion if needed

3. **Export from component:**
   ```typescript
   export function NewComponent({ ...props }) {
     // Component code
   }
   ```

### Adding a New Section to a Page

1. **Create section component or inline JSX**
2. **Add translations to page namespace**
3. **Use Framer Motion for animations**
4. **Follow existing design patterns**

---

## Common Issues and Solutions

### Issue: Language not switching

**Solution:**
- Check middleware is running
- Verify language code in URL matches supported locales
- Check `LanguageProvider` is wrapping the page
- Clear browser cache

### Issue: Images not loading

**Solution:**
- Verify image path starts with `/images/`
- Check image exists in `public/images/`
- Use Next.js `Image` component, not `<img>`
- Check image format is supported

### Issue: Translations missing

**Solution:**
- Verify JSON file exists for namespace and language
- Check JSON syntax is valid
- Verify key exists in JSON file
- Check namespace matches in `i18n-loader.ts`
- Clear `.next` cache and rebuild

### Issue: Build errors

**Solution:**
- Run `npm run lint` to check for errors
- Verify all imports are correct
- Check TypeScript errors with `tsc --noEmit`
- Ensure all dependencies are installed

### Issue: Animations not working

**Solution:**
- Check Framer Motion is imported correctly
- Verify `viewport` prop is set correctly
- Check for CSS conflicts
- Test with reduced motion disabled

### Issue: Mobile menu not closing

**Solution:**
- Check `mobileMenuOpen` state management
- Verify click handlers are attached
- Check for z-index conflicts
- Test touch events on mobile device

### Issue: Styling not applying

**Solution:**
- Verify Tailwind classes are correct
- Check for CSS specificity conflicts
- Ensure `globals.css` is imported
- Check for dark mode class conflicts
- Clear browser cache

### Issue: Performance issues

**Solution:**
- Optimize images (use Next.js Image)
- Check for large bundle sizes
- Use dynamic imports for heavy components
- Enable compression in `next.config.ts`
- Check for memory leaks in useEffect hooks

### Issue: SEO not working

**Solution:**
- Verify metadata is exported from page
- Check OpenGraph tags
- Test with SEO tools (Google Search Console)
- Ensure proper heading hierarchy
- Add alt text to all images

---

## Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

### Project-Specific Notes

- **Primary Color:** `#3b3dac` (used throughout)
- **Default Language:** English (`en`)
- **Supported Languages:** English (`en`), German (`de`)
- **Font:** Geist Sans (via Next.js)
- **Animation Library:** Framer Motion
- **Component Library:** Radix UI + shadcn/ui

---

## Conclusion

This documentation provides a comprehensive overview of the FC City Boys Zurich website. The project follows modern web development best practices with a focus on performance, accessibility, and user experience.

For questions or contributions, please refer to the project repository or contact the development team.

---

**Last Updated:** 2024
**Version:** 1.0.0
**Maintainer:** FC City Boys Development Team
