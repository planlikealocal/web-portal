import { createTheme } from '@mui/material/styles';

const websiteTheme = createTheme({
  // Website-specific theme colors
  palette: {
    primary: {
      main: '#0A2463',
      light: '#1a3a7a',
      dark: '#06152f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F2B544',
      light: '#f5c866',
      dark: '#e8a523',
      contrastText: '#000000',
    },
    error: {
      main: '#E85A4F',
      light: '#ed7a72',
      dark: '#ce3d32',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
  },
  // Typography settings
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  // Component overrides
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '1rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F2B544 0%, #E8A523 100%)',
          color: '#000000',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFC947 0%, #F2B544 100%)',
            boxShadow: '0 10px 20px rgba(242, 181, 68, 0.3)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #E85A4F 0%, #ce3d32 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ed7a72 0%, #E85A4F 100%)',
            boxShadow: '0 10px 20px rgba(232, 90, 79, 0.3)',
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0A2463',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0A2463',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0A2463',
          textDecoration: 'none',
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            color: '#F2B544',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  // Shape settings for consistent rounded corners
  shape: {
    borderRadius: 8,
  },
});

export default websiteTheme;

