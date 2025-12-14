# Static Images Directory

This directory contains static images used in the website.

## How to Add Images

1. Place your image files in this directory (`public/web/`)
2. Reference them in your React components using the path `/web/your-image-name.jpg`

## Example Usage

```jsx
<Box
    component="img"
    src="/web/your-image-name.jpg"
    alt="Description"
    sx={{
        width: '50%',
        height: 'auto',
        objectFit: 'contain',
    }}
/>
```

## Current Images

- `our-story-image.png` - Image for the "Our Story" section
- `pasindu-avatar.jpeg` - Avatar image for team member

## Notes

- Images in the `public` directory are served directly by Laravel
- Use relative paths starting with `/web/` to reference images
- Supported formats: JPG, JPEG, PNG, GIF, WebP, SVG

