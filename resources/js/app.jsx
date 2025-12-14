import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

createInertiaApp({
  resolve: name => {
    // Use lazy loading instead of eager loading for better code splitting
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: false })
    
    // Try exact path first
    let pagePath = `./Pages/${name}.jsx`
    
    // If not found and name doesn't contain '/', try in Web folder
    if (!pages[pagePath] && !name.includes('/')) {
      pagePath = `./Pages/Web/${name}.jsx`
    }
    
    // If still not found, try to find it in subdirectories
    if (!pages[pagePath]) {
      const foundPath = Object.keys(pages).find(path => 
        path.includes(name) && path.endsWith('.jsx')
      )
      if (foundPath) {
        pagePath = foundPath
      }
    }
    
    // Get the import function for the found path
    const importFn = pages[pagePath]
    
    // Return a promise that resolves to the component
    // This ensures proper async handling for Inertia
    if (importFn) {
      return importFn().then(module => {
        // Ensure we return the default export (the component)
        return module.default || module
      })
    }
    
    // Fallback: try direct import
    return import(`./Pages/${name}.jsx`).then(module => {
      return module.default || module
    })
  },
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App {...props} />
      </ThemeProvider>
    )
  },
})
