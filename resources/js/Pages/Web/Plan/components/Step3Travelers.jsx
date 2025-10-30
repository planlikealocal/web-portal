import React from 'react';
import { Grid, TextField } from '@mui/material';

const Step3Travelers = ({ data, setData, errors }) => {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Who will be your traveling?"
                    value={data.travelers}
                    onChange={(e) => setData('travelers', e.target.value)}
                    error={!!errors.travelers}
                    helperText={errors.travelers}
                />
            </Grid>
        </Grid>
    );
};

export default Step3Travelers;

