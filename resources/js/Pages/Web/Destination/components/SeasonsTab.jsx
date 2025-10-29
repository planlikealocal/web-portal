import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

const SeasonsTab = ({ seasons }) => {
    return seasons && seasons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasons.map((season) => (
                <Card key={season.id} variant="outlined">
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6">{season.name}</Typography>
                            <Chip
                                label={season.status ? 'Active' : 'Inactive'}
                                size="small"
                                color={season.status ? 'success' : 'default'}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Duration: {season.duration}
                        </Typography>
                        {season.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {season.description}
                            </Typography>
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
                No seasons available
            </Typography>
        </Box>
    );
};

export default SeasonsTab;


