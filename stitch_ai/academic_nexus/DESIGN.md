---
name: Academic Nexus
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#414750'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#717881'
  outline-variant: '#c0c7d1'
  surface-tint: '#02629e'
  primary: '#005387'
  on-primary: '#ffffff'
  primary-container: '#1b6ca8'
  on-primary-container: '#d9e9ff'
  inverse-primary: '#9acbff'
  secondary: '#5b5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e6'
  on-secondary-container: '#626567'
  tertiary: '#415167'
  on-tertiary: '#ffffff'
  tertiary-container: '#596980'
  on-tertiary-container: '#dbe9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#9acbff'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#004a78'
  secondary-fixed: '#e0e3e6'
  secondary-fixed-dim: '#c4c7ca'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#44474a'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-functioning academic environment, specifically tailored for the Nanjing University AI community. The brand personality is **Intellectual, Visionary, and Methodical**. It aims to evoke a sense of professional rigor while maintaining the accessibility required for a vibrant student-led ecosystem.

The visual style is **Corporate / Modern** with a lean toward **Minimalism**. It prioritizes information density and readability over decorative elements. The UI employs heavy whitespace to separate complex technical discussions, high-quality typography to ensure long-form reading comfort, and a systematic card-based architecture to organize diverse content types—from research papers to event announcements.

## Colors

The color palette is anchored by "Scholar Blue" (#1B6CA8), a professional navy-to-sky hybrid that signals trust and academic authority. 

- **Primary:** Used for key actions, active states, and branding accents.
- **Secondary:** A cool light gray used for subtle backgrounds and container fills to reduce visual noise.
- **Surface:** Pure white is reserved for content cards and modal overlays to provide maximum contrast against the light gray background base.
- **Status:** Utilize standard semantic colors (Success: #10B981, Error: #EF4444) but desaturated by 10% to maintain the calm, academic tone.

## Typography

The typography system is a hybrid approach optimized for both Latin characters and Chinese glyphs. 

1. **Headlines:** Use **Plus Jakarta Sans** for its modern, open counters and professional flair. In implementation, pair this with **PingFang SC Semibold** for Chinese headlines.
2. **Body:** Use **Inter** (paired with **PingFang SC Regular**) for its exceptional legibility in technical documentation and forum threads.
3. **Technical Data:** Use **JetBrains Mono** for code snippets, AI model parameters, and metadata labels to reinforce the "AI/Tech" identity.

Line heights are intentionally generous (1.5x - 1.6x for body text) to accommodate the density of academic prose.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop and a **Fluid Grid** for mobile devices.

- **Desktop (1280px+):** A 12-column grid with a 1280px max-width, 24px gutters, and 40px side margins.
- **Tablet (768px - 1279px):** 8-column fluid grid with 24px margins.
- **Mobile (Up to 767px):** 4-column fluid grid with 16px margins.

Spacing follows an 8px geometric scale. Use `lg` (40px) for section vertical spacing and `md` (24px) for internal card padding to ensure a clean, airy feel that prevents information overload.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** supplemented by **Ambient Shadows**.

1. **Level 0 (Base):** Background color (#F8FAFC).
2. **Level 1 (Cards):** Surface color (#FFFFFF) with a very soft, diffused shadow: `0px 4px 20px rgba(27, 108, 168, 0.05)`. Note the subtle blue tint in the shadow to maintain brand harmony.
3. **Level 2 (Hover/Active):** Increased shadow depth: `0px 10px 30px rgba(27, 108, 168, 0.08)`.
4. **Level 3 (Modals/Popovers):** Standard high-elevation shadow with a 1px soft border (#E2E8F0) to define edges against white surfaces.

Avoid heavy solid borders; use tonal changes to define secondary areas like sidebars or footers.

## Shapes

The shape language is **Rounded**, reflecting a modern and accessible academic environment. 

- **Components (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Containers (Cards, Modals):** 1rem (16px) corner radius.
- **Tags/Chips:** Fully rounded (pill-shaped) to distinguish them from actionable buttons.

This consistent rounding softens the "stiff" nature of academic content, making the community feel more inviting.

## Components

- **Buttons:** Primary buttons use a solid Scholar Blue fill with white text. Secondary buttons use a transparent background with a 1px border in Scholar Blue or a light gray fill for "ghost" actions.
- **Cards:** The primary content vehicle. Cards should have 24px internal padding and use Level 1 elevation. Headers within cards should use `title-md`.
- **Input Fields:** Use a 1px border (#E2E8F0) that transitions to Scholar Blue on focus. Labels should always be visible using `label-md`.
- **Chips/Tags:** Used for "AI Categories" (e.g., NLP, Computer Vision). Use a light tint of the primary color (background: #E8F0F7, text: #1B6CA8) for a refined, low-contrast look.
- **Lists:** Use subtle dividers (1px, #F1F5F9) and generous vertical padding (16px) between list items to maintain readability in research feeds.
- **Additional Components:**
    - **Code Blocks:** Dark themed (Slate 900) to contrast against the light UI, using JetBrains Mono.
    - **Researcher Profiles:** Small circular avatars with integrated "Year/Department" badges.