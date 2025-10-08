# Notification System Documentation

## Overview

The notification system provides a common way to display flash messages from the Laravel backend to the React frontend using Inertia.js. It supports different types of notifications (success, error, warning, info) with automatic styling and animations.

## Components

### Notification Component (`/resources/js/Components/Notification.jsx`)

A reusable React component that automatically displays flash messages from Inertia.js props.

**Features:**
- Automatic detection of flash messages from Inertia.js
- Support for multiple notification types (success, error, warning, info)
- Auto-hide functionality with different durations per type
- Expandable messages for long text (over 100 characters)
- Smooth slide-down animations
- Manual close functionality
- Responsive design

**Supported Flash Message Types:**
- `flash.success` - Green success notifications
- `flash.error` - Red error notifications  
- `flash.warning` - Orange warning notifications
- `flash.info` - Blue info notifications
- `flash.message` - Generic message (defaults to info)

## Usage

### Backend (Laravel)

The notification system works with Laravel's built-in flash messaging:

```php
// Success message
return redirect()->back()->with('success', 'Operation completed successfully!');

// Error message
return redirect()->back()->with('error', 'Something went wrong. Please try again.');

// Warning message
return redirect()->back()->with('warning', 'Please check your input before proceeding.');

// Info message
return redirect()->back()->with('info', 'Here is some useful information.');

// Generic message (will be treated as info)
return redirect()->back()->with('message', 'This is a generic message.');
```

### Frontend (React)

The notification component is automatically included in both layouts:

- **AdminLayout** - For admin pages
- **WebsiteLayout** - For public website pages

No additional setup is required. The component will automatically detect and display flash messages.

## Layout Integration

The notification component has been integrated into both main layouts:

### AdminLayout
```jsx
<Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
  <Toolbar />
  <Notification />
  {children}
</Box>
```

### WebsiteLayout
```jsx
<Container component="main" sx={{ flexGrow: 1, py: 4 }}>
  <Notification />
  {children}
</Container>
```

## Customization

### Auto-hide Durations
- **Error**: 8 seconds (longer for important error messages)
- **Warning**: 6 seconds
- **Success**: 4 seconds
- **Info**: 5 seconds

### Styling
The component uses Material-UI's Alert component with the following severity levels:
- `success` - Green with check circle icon
- `error` - Red with error icon
- `warning` - Orange with warning icon
- `info` - Blue with info icon

### Animation
- Slide-down transition from the top of the page
- Smooth expand/collapse for long messages
- Positioned at the top-center of the viewport

## Testing

A test route has been added for development purposes:

**Route:** `POST /admin/test-notifications`

**Parameters:**
- `type` - Notification type (success, error, warning, info)
- `message` - Message content

**Example:**
```javascript
router.post('/admin/test-notifications', {
    type: 'success',
    message: 'This is a test success message!'
});
```

## Example Usage in Controllers

```php
class SpecialistController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Create specialist logic here
            $specialist = Specialist::create($request->validated());
            
            return redirect()->route('admin.specialists.index')
                ->with('success', 'Specialist created successfully!');
                
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create specialist: ' . $e->getMessage())
                ->withInput();
        }
    }
    
    public function update(Request $request, Specialist $specialist)
    {
        try {
            $specialist->update($request->validated());
            
            return redirect()->route('admin.specialists.index')
                ->with('success', 'Specialist updated successfully!');
                
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update specialist: ' . $e->getMessage())
                ->withInput();
        }
    }
}
```

## Best Practices

1. **Use appropriate message types** - Choose the right severity level for your message
2. **Keep messages concise** - Short messages are more effective, use expandable text for details
3. **Provide actionable information** - Tell users what they can do next
4. **Use consistent language** - Maintain a consistent tone across all notifications
5. **Test thoroughly** - Ensure notifications work correctly across different scenarios

## Troubleshooting

### Notifications not appearing
1. Check that the Notification component is included in your layout
2. Verify that flash messages are being set in the backend
3. Check browser console for any JavaScript errors

### Styling issues
1. Ensure Material-UI theme is properly configured
2. Check for CSS conflicts with custom styles
3. Verify all required Material-UI components are imported

### Animation problems
1. Check that the Slide transition component is working
2. Verify Material-UI version compatibility
3. Test on different browsers and devices
