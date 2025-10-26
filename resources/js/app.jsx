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
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    
    // Try exact path first
    let page = pages[`./Pages/${name}.jsx`]
    
    // If not found and name doesn't contain '/', try in Web folder
    if (!page && !name.includes('/')) {
      page = pages[`./Pages/Web/${name}.jsx`]
    }
    
    // If still not found, try to find it in subdirectories
    if (!page) {
      const pagePath = Object.keys(pages).find(path => 
        path.includes(name) && path.endsWith('.jsx')
      )
      if (pagePath) {
        page = pages[pagePath]
      }
    }
    
    return page
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
