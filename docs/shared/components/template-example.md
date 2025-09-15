# Component Template Example

This file shows how to use all the shared components in your documentation.

## Page Header
```html
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Your Page Title
</h1>

<div style="text-align: left; margin: 2rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Your page subtitle or description
  </p>
</div>
```

## Card Container
```html
<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">
  <!-- Cards go here -->
</div>
```

## Feature Card
```html
<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem; margin: 0.25rem 0;">
  <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
    Card Title
  </h3>
  <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
    Card description goes here
  </p>
  <a href="/your-link" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
    Learn more →
  </a>
</div>
```

## Alert
```html
<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 1rem; margin: 1rem 0; border-left: 4px solid #0071F7;">
  <div style="display: flex; align-items: center;">
    <span style="font-size: 18px; margin-right: 8px;">ℹ️</span>
    <p style="margin: 0; color: #666; font-weight: 500;">
      Your alert message goes here
    </p>
  </div>
</div>
```

## Usage Instructions

1. Copy the HTML code from the examples above
2. Replace the placeholder text with your actual content
3. Update the href attributes with your actual links
4. Paste the modified HTML into your markdown files
