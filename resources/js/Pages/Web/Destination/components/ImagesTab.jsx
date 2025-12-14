import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import ImageCarousel from './ImageCarousel.jsx';

const ImagesTab = ({ images }) => {
    return images && images.length > 0 ? (
        <div className="space-y-6">
            <ImageCarousel images={images} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                        <Box
                            component="img"
                            src={image.url}
                            alt={image.name}
                            sx={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                            }}
                        />
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {image.name}
                            </Typography>
                            {image.description && (
                                <Typography variant="body2" color="text.secondary">
                                    {image.description}
                                </Typography>
                            )}
                            <Chip
                                label={image.image_type}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
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
                No images available
            </Typography>
        </Box>
    );
};

export default ImagesTab;


