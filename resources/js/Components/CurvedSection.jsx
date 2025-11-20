import React from 'react';
import { Box } from '@mui/material';

/**
 * CurvedSection - A reusable component with a curved wave separator at the bottom
 * 
 * @param {React.ReactNode} children - Content to display in the main section
 * @param {React.ReactNode} bottomContent - Optional content to display in the bottom section
 * @param {string} topBgColor - Background color for the top section (default: '#FFFFFF')
 * @param {string} bottomBgColor - Background color for the bottom section (default: '#CED4DA')
 * @param {string} curveColor - Color of the curve separator (default: same as bottomBgColor)
 * @param {number} curveHeight - Height of the curve section in pixels (default: 150)
 * @param {boolean} showBottomSection - Whether to show the bottom section (default: true)
 * @param {string} className - Additional CSS classes
 * @param {object} sx - Additional MUI sx styles
 */
const CurvedSection = ({
    children,
    bottomContent = null,
    topBgColor = '#FFFFFF',
    bottomBgColor = '#CED4DA',
    curveColor = null,
    curveHeight = 150,
    showBottomSection = true,
    className = '',
    sx = {},
}) => {
    // Use bottomBgColor for curve if curveColor not specified
    const finalCurveColor = curveColor || bottomBgColor;

    return (
        <Box
            className={className}
            sx={{
                position: 'relative',
                width: '100%',
                backgroundColor: topBgColor,
                ...sx,
            }}
        >
            {/* Main content area */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: topBgColor,
                }}
            >
                {children}
            </Box>

            {/* Curved wave separator */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: `${curveHeight}px`,
                    overflow: 'hidden',
                    backgroundColor: topBgColor,
                }}
            >
                <svg
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'block',
                    }}
                >
                    <path
                        d="M0,80 C360,40 720,100 1080,60 C1260,50 1380,70 1440,60 L1440,120 L0,120 Z"
                        fill={finalCurveColor}
                    />
                </svg>
            </Box>

            {/* Bottom section */}
            {showBottomSection && (
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        backgroundColor: bottomBgColor,
                        mt: `-${curveHeight}px`,
                        pt: `${curveHeight}px`,
                        minHeight: showBottomSection ? '200px' : 0,
                    }}
                >
                    {bottomContent}
                </Box>
            )}
        </Box>
    );
};

export default CurvedSection;

