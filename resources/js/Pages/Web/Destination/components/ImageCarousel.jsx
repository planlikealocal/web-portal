import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Box, IconButton, Typography, Chip, Dialog, DialogContent } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, ZoomIn, ZoomOut, Close } from '@mui/icons-material';

const ImageCarousel = ({ images }) => {
    const safeImages = useMemo(() => (images || []).filter((img) => !!img?.url), [images]);
    const [index, setIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const dragRef = useRef({ dragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0 });

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
                onClick={() => {
                    setLightboxOpen(true);
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                }}
                style={{ cursor: 'zoom-in' }}
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

            <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} fullWidth maxWidth="lg">
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
                        size="small"
                        aria-label="Zoom out"
                    >
                        <ZoomOut />
                    </IconButton>
                    <IconButton
                        onClick={() => setZoom((z) => Math.min(5, Number((z + 0.2).toFixed(2))))}
                        size="small"
                        aria-label="Zoom in"
                    >
                        <ZoomIn />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setZoom(1);
                            setOffset({ x: 0, y: 0 });
                        }}
                        size="small"
                        aria-label="Reset"
                    >
                        <Close />
                    </IconButton>
                </Box>
                <DialogContent sx={{ p: 0, backgroundColor: 'black' }}>
                    <PanZoomImage
                        src={current.url}
                        alt={current.name || 'Image'}
                        zoom={zoom}
                        setZoom={setZoom}
                        offset={offset}
                        setOffset={setOffset}
                        dragRef={dragRef}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

const PanZoomImage = ({ src, alt, zoom, setZoom, offset, setOffset, dragRef }) => {
    const containerRef = useRef(null);

    const onWheel = useCallback((e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        setZoom((prev) => {
            const newZoom = Math.min(5, Math.max(1, Number((prev + delta).toFixed(2))));
            if (!containerRef.current) return newZoom;
            try {
                const rect = containerRef.current.getBoundingClientRect();
                const cx = e.clientX - rect.left - rect.width / 2;
                const cy = e.clientY - rect.top - rect.height / 2;
                const scaleChange = newZoom / prev;
                setOffset((o) => ({ x: o.x - cx * (scaleChange - 1), y: o.y - cy * (scaleChange - 1) }));
            } catch (_) {}
            return newZoom;
        });
    }, [setZoom, setOffset]);

    const onMouseDown = (e) => {
        e.preventDefault();
        dragRef.current.dragging = true;
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.lastX = offset.x;
        dragRef.current.lastY = offset.y;
    };
    const onMouseMove = (e) => {
        if (!dragRef.current.dragging) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setOffset({ x: dragRef.current.lastX + dx, y: dragRef.current.lastY + dy });
    };
    const endDrag = () => {
        dragRef.current.dragging = false;
    };

    const onTouchStart = (e) => {
        if (e.touches.length === 1) {
            const t = e.touches[0];
            dragRef.current.dragging = true;
            dragRef.current.startX = t.clientX;
            dragRef.current.startY = t.clientY;
            dragRef.current.lastX = offset.x;
            dragRef.current.lastY = offset.y;
        }
    };
    const onTouchMove = (e) => {
        if (!dragRef.current.dragging || e.touches.length !== 1) return;
        const t = e.touches[0];
        const dx = t.clientX - dragRef.current.startX;
        const dy = t.clientY - dragRef.current.startY;
        setOffset({ x: dragRef.current.lastX + dx, y: dragRef.current.lastY + dy });
    };
    const onTouchEnd = () => {
        dragRef.current.dragging = false;
    };

    return (
        <Box
            ref={containerRef}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '70vh', md: '80vh' },
                overflow: 'hidden',
                cursor: zoom > 1 ? 'grab' : 'zoom-in',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
            }}
        >
            <Box
                component="img"
                src={src}
                alt={alt}
                draggable={false}
                sx={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    maxWidth: 'none',
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                }}
            />
        </Box>
    );
};

export default ImageCarousel;


