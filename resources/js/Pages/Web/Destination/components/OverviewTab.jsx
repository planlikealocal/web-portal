import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import ImageCarousel from './ImageCarousel.jsx';
const OverviewTab = ({ destination, className, id }) => {
    return (
        <div id={id} className={`space-y-6 ${className}`}>
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
            
        </div>
    );
};

export default OverviewTab;


