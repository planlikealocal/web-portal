import {createTheme} from '@mui/material/styles';

const adminTheme = createTheme({
    components: {
        // Override Button component defaults
        MuiButton: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override Fab component defaults
        MuiFab: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override IconButton component defaults
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override TextField component defaults
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                size: 'small',
            },
        },
        // Override Select component defaults
        MuiSelect: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override FormControl component defaults
        MuiFormControl: {
            defaultProps: {
                fullWidth: true,
                size: 'small',
            },
        },
        // Override InputLabel component defaults
        MuiInputLabel: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override OutlinedInput component defaults
        MuiOutlinedInput: {
            defaultProps: {
                fullWidth: true,
                size: 'small',
            },
        },
        // Override Chip component defaults
        MuiChip: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override ToggleButton component defaults
        MuiToggleButton: {
            defaultProps: {
                size: 'small',
            },
        },
        // Override ToggleButtonGroup component defaults
        MuiToggleButtonGroup: {
            defaultProps: {
                size: 'small',
            },
        },
    },
    // Custom admin-specific theme colors
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    // Typography settings
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    // Spacing for consistent layout
    spacing: 8,
});

export default adminTheme;
