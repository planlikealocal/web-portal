import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const Step2Destination = ({ data, setData, errors }) => {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Where do you want to go?"
                    value={data.destination}
                    onChange={(e) => setData('destination', e.target.value)}
                    error={!!errors.destination}
                    helperText={errors.destination}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Need help choosing where to go?{' '}
                    <a href="#" style={{ color: '#1976d2' }}>Click here</a> to help figure out what you may be interested in.
                </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="What are your dates of travel"
                    value={data.travel_dates}
                    onChange={(e) => setData('travel_dates', e.target.value)}
                    error={!!errors.travel_dates}
                    helperText={errors.travel_dates}
                />
            </Grid>
        </Grid>
    );
};

export default Step2Destination;

