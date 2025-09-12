# Shared Components

This directory contains reusable HTML components for the Agglayer documentation project.

## Structure

```
shared/
├── components/
│   ├── index.md                 # Component documentation
│   ├── template-example.md      # Usage examples
│   ├── page-header.html         # Page header component
│   ├── cta-button.html          # Call-to-action button
│   ├── feature-card.html        # Feature card component
│   └── alert.html               # Alert/notice component
└── README.md                    # This file
```

## Available Components

### 1. Page Header
**File:** `components/page-header.html`
**Purpose:** Consistent page titles and subtitles
**Usage:** Copy HTML and customize title/subtitle text

### 2. Feature Card
**File:** `components/feature-card.html`
**Purpose:** Feature cards with title, description, and link
**Usage:** Copy HTML and customize content

### 3. Alert
**File:** `components/alert.html`
**Purpose:** Important notices and warnings
**Usage:** Copy HTML and customize message

## Usage Guidelines

1. **Copy and Customize:** Copy the HTML from component files and customize the content
2. **Consistent Styling:** All components use the Agglayer design system colors and fonts
3. **Responsive Design:** Components are designed to work across different screen sizes
4. **Accessibility:** Components include proper semantic HTML and ARIA attributes

## Design System

### Colors
- **Primary Blue:** `#0071F7` (headers, buttons, links)
- **Gray Text:** `#666` (subtitles, descriptions)
- **Light Gray:** `#f8f9fa` (card backgrounds)
- **Border Gray:** `#dee2e6` (card borders)

### Typography
- **Headings:** Inter Tight, 700 weight
- **Body Text:** Inter, 400 weight
- **Button Text:** Inter, 600 weight

### Spacing
- **Component Margin:** `3rem` for major sections
- **Card Padding:** `2rem` for internal spacing
- **Button Padding:** `12px 24px` for comfortable click targets

## Adding New Components

1. Create a new `.html` file in the `components/` directory
2. Use consistent naming: `kebab-case.html`
3. Include HTML comments to identify the component
4. Document the component in `index.md`
5. Add usage examples to `template-example.md`

## Best Practices

- Always include HTML comments to identify components
- Use semantic HTML elements
- Maintain consistent spacing and typography
- Test components across different screen sizes
- Keep components focused on a single purpose
