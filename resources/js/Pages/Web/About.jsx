import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import WebsiteLayout from '../../Layouts/WebsiteLayout.jsx';

const About = () => {
  return (
    <WebsiteLayout>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        <Container maxWidth="md">
          <Typography variant="body1" paragraph>
            Web Portal is a comprehensive platform designed to connect businesses with qualified specialists
            from around the world. Our mission is to bridge the gap between organizations and expert talent,
            facilitating successful project collaborations.
          </Typography>
          <Typography variant="body1" paragraph>
            Founded with the vision of creating a global network of verified specialists, we ensure that
            every professional on our platform meets our stringent quality standards. Our platform serves
            as a trusted intermediary, providing both clients and specialists with the tools they need
            to succeed.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're looking for technical expertise, creative solutions, or specialized knowledge,
            our diverse pool of specialists is ready to help you achieve your goals.
          </Typography>
        </Container>
      </Box>
    </WebsiteLayout>
  );
};

export default About;
