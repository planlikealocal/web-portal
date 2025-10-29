import React, { useState, useMemo } from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

const ImageCarousel = ({ images }) => {
    const safeImages = useMemo(() => (images || []).filter((img) => !!img?.url), [images]);
    const [index, setIndex] = useState(0);

    if (!safeImages.length) {
        return (
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
    }

    const goPrev = () => setIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
    const goNext = () => setIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

    const current = safeImages[index];

    return (
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <Box
                component="img"
                src={current.url}
                alt={current.name || `Image ${index + 1}`}
                sx={{
                    width: '100%',
                    height: { xs: 260, sm: 320, md: 420 },
                    objectFit: 'cover',
                    borderRadius: 2,
                }}
            />

            <IconButton
                onClick={goPrev}
                size="small"
                sx={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
                aria-label="Previous image"
            >
                <ArrowBackIosNew fontSize="small" />
            </IconButton>

            <IconButton
                onClick={goNext}
                size="small"
                sx={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
                aria-label="Next image"
            >
                <ArrowForwardIos fontSize="small" />
            </IconButton>

            <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {current.name && (
                    <Typography variant="subtitle1" sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 1 }}>
                        {current.name}
                    </Typography>
                )}
                {current.image_type && (
                    <Chip label={current.image_type} size="small" color="primary" variant="filled" />
                )}
            </Box>

            <Box sx={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 0.75 }}>
                {safeImages.map((_, i) => (
                    <Box
                        key={i}
                        onClick={() => setIndex(i)}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: i === index ? 'primary.main' : 'rgba(255,255,255,0.7)',
                            border: i === index ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                        }}
                    />)
                )}
            </Box>
        </Box>
    );
};

export default ImageCarousel;


