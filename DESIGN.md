# Design System: Trampo (Modern B2B SaaS)

## 1. Visual Theme & Atmosphere

Trampo's website is a masterclass in modern, approachable B2B SaaS design. It balances professional utility with an inviting, lightweight aesthetic. The page opens with a clean, centered hero section that draws the eye directly to the value proposition, supported by a large, high-fidelity UI mockup floating above a soft, glowing turquoise/green radial background. There is no heavy photography; instead, the product interface is the hero. The UI relies on ample white space, gentle curves, and subtle depth to create a frictionless environment that feels powerful yet easy to use.

The color philosophy is bright and focused: a vibrant Primary Green/Turquoise is used for primary calls to action and atmospheric "glow" effects, while deep, stark blacks and grays provide high contrast for typography. The emotional weight is carried by the clarity of the product mockups and the ethereal, soft-blurred gradient backgrounds that break up the stark white canvas. This glowing effect gives the software a feeling of cutting-edge technology and modern cloud infrastructure.

Typography leans heavily on a clean, highly legible neo-grotesque sans-serif (resembling Inter or San Francisco), designed specifically for interface clarity. Headings are bold, tightly tracked, and often centered to command attention, while body copy is airy and comfortable to read. The design system extensively uses soft, diffuse drop shadows to lift interactive elements and product mockups off the page, creating a layered, dimensional space without feeling heavy or skeuomorphic.

**Key Characteristics:**
- Content-driven, centrally aligned hero sections that lead directly into product visualizations.
- Widespread use of soft, large-scale turquoise/green gradient "glows" (`#DDF6F0` to transparent) as background atmospheric elements.
- Floating product mockups layered with soft, diffuse drop shadows to create depth.
- Pill-shaped (fully rounded) primary CTA buttons for marketing touchpoints.
- Generous use of white space to organize complex information and feature sets.
- Clean, semantic UI coloring within the product mockups.
- A stark contrast dark-mode footer (`#010101`) to anchor the bottom of the page.

---

## 2. Color Palette & Roles

### Primary (Turquoise/Green Family)
- **Primary 500 (`#2EAF92`)**: Primary CTA button background and logo accent — a vibrant, energetic green that signals action and interactivity. Used for "Get early access" buttons and key links.
- **Primary 400 (`#4FC8AF`)**: Hover states, highlights, and secondary interactive elements.
- **Primary 600 (`#1A987C`)**: Pressed states and active interactive components.
- **Primary 200 (`#A8E3D8`)**: Soft backgrounds, badges, and subtle highlights.

### Secondary & Atmosphere
- **Atmospheric Turquoise Glow** (Soft radial gradients using light tints like **Primary 50** `#F2FCFA` or **Primary 100** `#DDF6F0` fading to transparent): Used as large background layers to frame UI mockups and add visual interest without cluttering the page.
- **SaaS Semantic Colors** (Visible in UI mockups):
  - *Note: Since the brand primary is green, standard "Success" metrics can utilize the brand's Primary 500 or 600 to reinforce brand identity.*
  - **Warning Yellow/Orange** (e.g., `#F59E0B`): Used for "Pending" or "Nurturing" states.
  - **Danger Red** (e.g., `#EF4444`): Used for "Lost" or "Churned" states.

### Surface & Background
- **Neutral 0 (`#FFFFFF` or `#FEFEFE`)**: Primary page background and card surface.
- **Neutral 50 (`#FAFAFA`)**: Used occasionally for secondary sections, surface layers, or to subtly separate feature blocks.
- **Neutral 900 (`#010101`)**: Deep, absolute dark slate used exclusively for the footer background to provide a heavy, grounding anchor.

### Neutrals & Text
- **Neutral 900 (`#010101`)**: Primary heading text — pure black for maximum contrast and authority.
- **Neutral 600 (`#52525B` or `#9EA4A3`)**: Body text, secondary descriptions, and muted UI text. Provides excellent legibility without the harshness of pure black.
- **Neutral 200 (`#E4E4E7`)**: Used for subtle delineations, feature card borders, and UI mockup structural lines.

---

## 3. Typography Rules

### Font Family
- **Primary Typeface**: A modern sans-serif like Inter, San Francisco, or Roboto. Used universally across headings, body text, and product UI to maintain strict consistency between the marketing site and the actual application.

### Hierarchy

| Role | Size | Weight | Color | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | ~56px (3.5rem) | 700 (Bold) | Neutral 900 | Centered, tight line-height (e.g., 1.1) |
| **Section Heading** | ~40px (2.5rem) | 700 (Bold) | Neutral 900 | Centered, used for "Prospect.", "Close.", "Retain." |
| **Subtitle/Body** | ~18px (1.125rem) | 400 (Regular) | Neutral 600 | Relaxed line-height (e.g., 1.5) for readability |
| **Small Label** | ~14px (0.875rem) | 500 (Medium) | Neutral 600 | Used in UI mockups for column headers, tags |
| **Button Text** | ~16px (1rem) | 500 (Medium) | Neutral 0 | Centered within pill-shaped buttons |

### Principles
- **Centered Alignment**: Marketing copy (Hero, Section introductions) is predominantly center-aligned, creating a balanced, formal presentation.
- **High Contrast**: Headings use thick, bold weights to establish a clear visual hierarchy against the lighter body copy.
- **Utilitarian UI Typography**: Inside the product mockups, text is smaller, denser, and relies on color and subtle weight shifts (e.g., bolding user names or deal values) to guide the eye.

---

## 4. Component Stylings

### Buttons
**Primary CTA** (Marketing Site):
- **Default**: bg Primary 500 (`#2EAF92`), text Neutral 0 (`#FFFFFF`), padding roughly 12px 24px.
- **Hover**: bg Primary 400 (`#4FC8AF`).
- **Active/Pressed**: bg Primary 600 (`#1A987C`).
- **Shape**: Pill-shaped (e.g., `border-radius: 9999px`).
- **Used for**: "Get early access" or "Start now".

**Secondary UI Buttons** (Inside Mockups):
- **Shape**: Rounded rectangles (e.g., `border-radius: 6px` or `8px`).
- **Styles**: Varying from solid muted grays (Neutral 100) to outlined buttons with Neutral 200 borders.

### Cards & Containers
**Feature Cards** (Bottom grid):
- **Background**: Neutral 0 (`#FFFFFF`).
- **Border**: 1px solid Neutral 200 (`#E4E4E7`).
- **Border Radius**: ~12px to 16px.
- **Padding**: Generous interior padding (e.g., 32px).
- **Shadow**: Very subtle, or entirely flat, relying on the border for definition.

**Product Mockups** (Hero and main sections):
- **Background**: Neutral 0 (`#FFFFFF`).
- **Border**: 1px solid extremely light gray (Neutral 100) or transparent.
- **Border Radius**: ~12px.
- **Box Shadow**: Large, soft, and highly diffuse (e.g., `0 25px 50px -12px rgba(0, 0, 0, 0.1)`) to make the UI "float" above the page and background glows.

### Badges & Tags
- **Marketing Badges**: Small pill shapes or inline text blocks with soft backgrounds (e.g., Primary 100 background with Primary 700 text).
- **UI Status Tags**: Pill-shaped, semi-transparent backgrounds with matching text color.

### Footer
- **Background**: Neutral 900 (`#010101`).
- **Text**: Neutral 0 (`#FFFFFF` for headings) and Neutral 400 (`#A1A1AA` for links).
- **Layout**: Simple multi-column grid with a left-aligned logo and right-aligned link lists.

---

## 5. Layout Principles

### Spacing System
- **Macro Spacing**: Extremely generous vertical padding between distinct sections (often 120px to 160px), allowing each "chapter" to breathe and be digested independently.
- **Micro Spacing**: Tight, organized spacing within UI mockups to demonstrate data density and software capability.

### Grid & Container
- **Max Width**: Content is typically constrained to a central column (around 1024px to 1200px wide).
- **Layout Patterns**:
  1. **Centered Flow**: Heading → Subheading → Mockup (stacked vertically and centered).
  2. **Logo Farm**: A horizontal row of monochrome customer logos acting as social proof.
  3. **Bento/Grid**: Smaller feature callouts arranged in a 2-up or multi-column grid towards the bottom of the page.

### Whitespace Philosophy
Whitespace is used to reduce cognitive load. By surrounding complex UI mockups with vast amounts of pure white space (or gentle turquoise glows), the user is not overwhelmed by the density of the SaaS product.

---

## 6. Depth & Elevation

| Level | Treatment | Use |
| :--- | :--- | :--- |
| **Level 0 (Flat)** | Neutral 0, no shadow | Page background, basic text containers |
| **Level 1 (Bordered)** | 1px Neutral 200 border, no shadow | Feature cards, input fields in UI |
| **Level 2 (Floating)** | Large, diffuse drop shadow, 12px radius | Main product UI mockups |
| **Level 3 (Glow)** | Soft radial gradient (Primary 50/100) in background | Atmospheric depth behind hero mockups |

### Shadow Philosophy
Unlike flat design systems, Trampo embraces elevation to distinguish the marketing wrapper from the product itself. The product mockups are treated like physical objects floating on a pristine desk, achieved through broad, soft shadows that simulate diffuse overhead lighting.

---

## 7. Do's and Don'ts

### Do
- Use soft, large turquoise/green radial gradients behind key product mockups to create a "glowing" atmosphere.
- Utilize extensive, diffuse drop shadows to make UI mockups float above the page surface.
- Use pill-shaped (fully rounded) buttons for primary marketing calls to action.
- Center-align main marketing copy (headings and subheadings) to create a confident, structured narrative.
- End the page with a stark, dark-mode footer (`#010101`) for visual grounding.

### Don't
- Use heavy, dark, or sharp drop shadows—shadows should be soft, wide, and light.
- Fill the background with photography or heavy patterns; stick to white space and soft gradient glows.
- Use sharp, 0px border radii on UI cards or buttons—everything should have friendly, slight curves (6px to 16px).
- Overcomplicate the color palette; stick to Trampo Primary Green for brand/action, deep black for text, and semantic colors only where they mean something in the UI.
- Left-align primary hero text; the established pattern relies heavily on central symmetry.

---

## 8. Agent Prompt Guide

### Quick Color Reference
- **Primary Action**: "Primary 500 (`#2EAF92`)"
- **Background**: "Neutral 0 (`#FFFFFF`)"
- **Atmosphere**: "Soft Light Turquoise Glow (`#DDF6F0` or `#F2FCFA`)"
- **Main Heading**: "Neutral 900 (`#010101`)"
- **Body Text**: "Neutral 600 (`#52525B`)"
- **Borders**: "Neutral 200 (`#E4E4E7`)"
- **Footer Background**: "Neutral 900 (`#010101`)"

### Example Component Prompts
- "Create a centered hero section with a bold Neutral 900 (`#010101`) heading at 56px, a Neutral 600 (`#52525B`) subtitle below it, and a pill-shaped Primary 500 (`#2EAF92`) 'Get early access' button. Below the button, place a large product UI mockup that floats using a large, soft drop shadow, backed by an atmospheric soft turquoise radial background glow."
- "Design a 'Features' grid with 4 cards on a Neutral 0 (`#FFFFFF`) background. Each card should have a 1px Neutral 200 (`#E4E4E7`) border, 16px border radius, no drop shadow, and contain a bold Neutral 900 title, a Neutral 600 description, and a small, simplified representation of a UI element."
- "Build a dark-mode footer using a Neutral 900 (`#010101`) background. Include a white logo on the left and a 3-column grid of text links on the right using Neutral 400 (`#A1A1AA`) text."
- "Recreate a UI mockup displaying a sales pipeline. Use a Neutral 0 background, 8px border radius, and include small status badges, using the brand's Primary 200 (`#A8E3D8`) as soft backgrounds for positive tags."