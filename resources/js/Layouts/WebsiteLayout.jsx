import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Fab } from '@mui/material';
import { ContactMail as ContactMailIcon } from '@mui/icons-material';
import websiteTheme from '../themes/websiteTheme';
import Notification from '../Components/Notification';
import ContactUsDialog from '../Components/ContactUsDialog';

const WebsiteLayout = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // Handle scroll to show/hide scroll to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={websiteTheme}>
      <CssBaseline />
      <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#0A2463' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Branding */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F2B544] to-[#E8A523] rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Plan Like A Local
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium">
                About
              </Link>
              <Link href="/what-we-do" className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium">
                What we do
              </Link>
              <Link href="/destinations" className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium">
                Destinations
              </Link>
              <button
                onClick={() => setContactDialogOpen(true)}
                className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium bg-transparent border-none cursor-pointer"
              >
                Contact
              </button>
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center">
              <Link href="/book-appointment" className="btn-primary">
                Plan a trip
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:text-[#F2B544] hover:bg-[#1a3a7a] transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 py-4" style={{ backgroundColor: '#0A2463' }}>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/what-we-do"
                  className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  What we do
                </Link>
                <Link
                  href="/destinations"
                  className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Destinations
                </Link>
                <button
                  onClick={() => {
                    setContactDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#F2B544] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 w-full text-left bg-transparent border-none cursor-pointer"
                >
                  Contact
                </button>
                <Link
                  href="/book-appointment"
                  className="btn-primary mx-3 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plan a trip
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Notification />
        {children}
      </main>

      {/* Floating Contact Us Button */}
      <Fab
        color="primary"
        aria-label="Contact Us"
        onClick={() => setContactDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ContactMailIcon />
      </Fab>

      {/* Contact Us Dialog */}
      <ContactUsDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Footer</p>
            
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="inline-flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors duration-200"
                aria-label="Scroll to top"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  );
};

export default WebsiteLayout;
