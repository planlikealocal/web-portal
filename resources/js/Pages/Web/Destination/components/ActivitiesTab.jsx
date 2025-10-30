import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

const ActivitiesTab = ({ activities }) => {
    return activities && activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
                <Card key={activity.id}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6">{activity.name}</Typography>
                        </Box>
                        {activity.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {activity.description}
                            </Typography>
                        )}
                        {activity.image_url && (
                            <Box
                                component="img"
                                src={activity.image_url}
                                alt={activity.name}
                                sx={{
                                    width: '100%',
                                    height: 150,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    mt: 1,
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    ) : (
        <Box
            sx={{
                textAlign: 'center',
                py: 8,
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                bgcolor: '#fafafa',
            }}
        >
            <Typography variant="h6" color="text.secondary">
                No activities available
            </Typography>
        </Box>
    );
};

export default ActivitiesTab;


