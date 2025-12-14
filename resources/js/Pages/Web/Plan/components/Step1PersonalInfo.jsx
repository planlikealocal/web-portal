import React from 'react';
import { Grid, TextField } from '@mui/material';

const Step1PersonalInfo = ({ data, setData, errors }) => {
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    required
                    label="First Name"
                    value={data.first_name}
                    onChange={(e) => setData('first_name', e.target.value)}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    required
                    label="Last Name"
                    value={data.last_name}
                    onChange={(e) => setData('last_name', e.target.value)}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    required
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    required
                    label="Phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                        startAdornment: <span style={{ marginRight: 8 }}>+1 :</span>,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default Step1PersonalInfo;

