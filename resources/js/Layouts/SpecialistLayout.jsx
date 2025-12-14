import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  ThemeProvider,
  Chip,
  Alert,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Warning
} from '@mui/icons-material';
import { Link, router } from '@inertiajs/react';
import adminTheme from '../themes/adminTheme';
import Notification from '../Components/Notification';

const drawerWidth = 240;

const SpecialistLayout = ({ children, user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    router.post('/specialist/logout');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/specialist' },
    { text: 'Appointments', icon: <CalendarIcon />, href: '/specialist/appointments' },
    { text: 'Google Calendar', icon: <SettingsIcon />, href: '/specialist/google-calendar-settings' },
    { text: 'Profile', icon: <PersonIcon />, href: '/specialist/profile' },
    { text: 'Back to Website', icon: <HomeIcon />, href: '/' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Specialist Portal
        </Typography>
      </Toolbar>
      
      {/* Google Calendar Status */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Google Calendar Status
          </Typography>
          <Chip
            label={user.hasGoogleCalendarConnected ? 'Connected' : 'Not Connected'}
            color={user.hasGoogleCalendarConnected ? 'success' : 'error'}
            size="small"
            icon={user.hasGoogleCalendarConnected ? <CalendarIcon /> : <Warning />}
          />
          {!user.hasGoogleCalendarConnected && (
            <Button
              size="small"
              component={Link}
              href="/specialist/google-calendar-settings"
              sx={{ mt: 1, width: '100%' }}
            >
              Connect Now
            </Button>
          )}
        </Box>
      )}
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Specialist Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Notification />
        {children}
      </Box>
    </Box>
    </ThemeProvider>
  );
};

export default SpecialistLayout;
