import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import ImageCarousel from './ImageCarousel.jsx';
const OverviewTab = ({ destination }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destination.overview_title && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {destination.overview_title}
                        </Typography>
                        {destination.overview && (
                            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                {destination.overview}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )}
                {destination.images && (
                                <ImageCarousel images={destination.images} />

                )}
            
            </div>

            {destination.description && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {destination.description}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            
        </div>
    );
};

export default OverviewTab;


