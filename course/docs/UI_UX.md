# UI/UX Guidelines

## Design Principles

### 1. Modern & Professional
- Clean, minimal design
- Consistent spacing dan typography
- Professional color scheme
- High-quality imagery

### 2. Responsive (Mobile-First)
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons (min 44x44px)
- Readable text sizes (min 16px untuk body)

### 3. Card-Based Layout
- Consistent card styling
- Shadow untuk depth
- Hover effects untuk interactivity
- Rounded corners (8-12px)

### 4. Consistent Spacing
- Base spacing unit: 4px
- Common spacing: 4, 8, 12, 16, 24, 32, 48, 64px
- Section padding: 24-48px
- Card padding: 16-24px

### 5. Typography
- Headings: Bold, larger sizes (h1: 3xl-4xl, h2: 2xl-3xl, h3: xl-2xl)
- Body: Regular, readable (16px base)
- Line height: 1.5-1.75 untuk readability
- Font family: System fonts atau web-safe fonts

## Color Scheme

### Primary Colors
- Primary: Blue (#0ea5e9) - untuk CTAs, links, active states
- Secondary: Purple (#8b5cf6) - untuk accents
- Accent: Orange (#f59e0b) - untuk highlights, warnings

### Status Colors
- Success: Green - untuk completed, success messages
- Warning: Yellow/Orange - untuk pending, warnings
- Error: Red - untuk errors, failed states
- Info: Blue - untuk information

### Neutral Colors
- Base-100: White/Light - untuk cards, main background
- Base-200: Light Gray - untuk sections, secondary background
- Base-300: Medium Gray - untuk borders, dividers
- Base-content: Dark - untuk text

## Components

### Buttons
- Primary: Solid background, white text
- Secondary: Outlined, primary border
- Ghost: Transparent, text only
- Sizes: sm, md (default), lg
- States: Default, Hover, Active, Disabled
- Icons: Left atau right alignment

### Cards
- Background: Base-100
- Shadow: Subtle shadow (md)
- Padding: 16-24px
- Border radius: 8-12px
- Hover: Shadow increase, slight lift

### Forms
- Input: Bordered, rounded, focus ring
- Labels: Above input, clear hierarchy
- Error states: Red border, error message below
- Success states: Green border (optional)
- Placeholders: Light gray text

### Navigation
- Sidebar: Fixed left, collapsible on mobile
- Top bar: Sticky, user info right
- Active state: Primary background, white text
- Hover state: Light background change

## Loading States

### Skeleton Loaders
- Animated shimmer effect
- Match content structure
- Gray background dengan animation
- Use untuk: Course cards, tables, content blocks

### Spinners
- Centered loading spinner
- Use untuk: Full page loads, button states
- Size: sm, md, lg

## Empty States

### Design Pattern
- Large icon (64-96px)
- Heading (descriptive)
- Description text
- CTA button (jika applicable)

### Examples
- No courses: "Belum ada course" dengan "Jelajahi Course" button
- No enrollments: "Belum ada course yang diikuti" dengan "Browse Courses" button
- No certificates: "Belum ada sertifikat" dengan info text

## Error Handling

### Error Messages
- Inline: Below form fields (red text)
- Toast: Top-right untuk API errors
- Page-level: Centered card untuk critical errors

### 404 Page
- Large "404" text
- "Page not found" message
- "Back to Home" button

## Dark Mode (Optional)

### Implementation
- Toggle switch di header/settings
- Store preference di localStorage
- Use DaisyUI dark theme
- Smooth transition

### Color Adjustments
- Base-100: Dark background
- Base-content: Light text
- Cards: Darker background
- Maintain contrast ratios

## Accessibility

### WCAG Guidelines
- Color contrast: Min 4.5:1 untuk text
- Keyboard navigation: All interactive elements
- Focus indicators: Visible focus rings
- Alt text: Untuk semua images
- ARIA labels: Untuk icons, buttons

### Best Practices
- Semantic HTML
- Proper heading hierarchy
- Form labels
- Error announcements
- Skip links (optional)

## Animations

### Transitions
- Duration: 150-300ms
- Easing: ease-in-out
- Properties: opacity, transform, color

### Hover Effects
- Scale: 1.02-1.05
- Shadow: Increase
- Color: Slight change

### Page Transitions
- Fade in: 200-300ms
- Slide: Untuk modals, sidebars

## Performance

### Image Optimization
- Lazy loading untuk images
- WebP format (dengan fallback)
- Responsive images (srcset)
- Placeholder images

### Code Splitting
- Route-based code splitting
- Lazy load components
- Optimize bundle size

## User Feedback

### Success Actions
- Toast notification (green)
- Checkmark icon
- Brief message

### Error Actions
- Toast notification (red)
- Error icon
- Clear error message

### Loading Actions
- Button spinner
- Disabled state
- Loading text

