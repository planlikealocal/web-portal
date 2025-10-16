import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import AdminLayout from '../../Layouts/AdminLayout';

const Countries = ({ countries }) => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Countries
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage countries for destinations
        </Typography>

        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Flag</TableCell>
                    <TableCell>Destinations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {countries.map((country) => (
                    <TableRow key={country.id} hover>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          #{country.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {country.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Avatar 
                          src={country.flag_url} 
                          sx={{ width: 32, height: 20 }}
                          variant="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {country.destinations?.length || 0} destinations
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {countries.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Countries
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    {countries.reduce((total, country) => total + (country.destinations?.length || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Destinations
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    {countries.filter(country => (country.destinations?.length || 0) > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Countries with Destinations
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default Countries;