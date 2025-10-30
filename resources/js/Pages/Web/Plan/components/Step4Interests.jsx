import React from 'react';
import { Grid, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';

const Step4Interests = ({ data, setData, errors, onInterestChange, activities = [] }) => {
    // Use activities from destination if available, otherwise show empty state
    // Debug: Log activities to see what we're receiving
    console.log('Step4Interests - Activities:', activities);
    const hasActivities = Array.isArray(activities) && activities.length > 0;

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    What are your interests?
                </Typography>
                {hasActivities ? (
                    <Grid container spacing={2}>
                        {activities.map((activity) => {
                            // Handle both object format {id, name} and direct activity objects
                            const activityId = activity.id || activity;
                            const activityName = activity.name || activity;
                            
                            return (
                                <Grid size={{ xs: 12, sm: 4 }} key={activityId}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.interests.includes(activityName)}
                                                onChange={() => onInterestChange(activityName)}
                                            />
                                        }
                                        label={activityName}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No activities available for this destination. Please add your other interests below.
                    </Typography>
                )}
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Any Other interests"
                    multiline
                    rows={3}
                    value={data.other_interests}
                    onChange={(e) => setData('other_interests', e.target.value)}
                    error={!!errors.other_interests}
                    helperText={errors.other_interests}
                />
            </Grid>
        </Grid>
    );
};

export default Step4Interests;

