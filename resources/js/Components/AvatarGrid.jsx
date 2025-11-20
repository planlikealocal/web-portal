import React, { useMemo } from 'react';
import { Box, Avatar } from '@mui/material';

const AvatarGrid = ({
    avatarUrls = [],
    totalCircles = 28,
    minSize = 40,
    maxSize = 120,
    spacing = 2
}) => {
    // Generate stable sizes for each circle using a seeded approach
    const sizes = useMemo(() => {
        // Simple seeded random function for consistent sizes
        let seed = 12345;
        const seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        return Array.from({ length: totalCircles }, () =>
            Math.floor(seededRandom() * (maxSize - minSize + 1)) + minSize
        );
    }, [totalCircles, minSize, maxSize]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing,
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            {Array.from({ length: totalCircles }).map((_, index) => {
                const size = sizes[index];
                const avatarUrl = avatarUrls[index] || null;

                return (
                    <Box
                        key={index}
                        sx={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'grey.300',
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}
                    >
                        {avatarUrl && avatarUrl !== '' ? (
                            <Avatar
                                src={avatarUrl}
                                alt={`Avatar ${index + 1}`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default AvatarGrid;

