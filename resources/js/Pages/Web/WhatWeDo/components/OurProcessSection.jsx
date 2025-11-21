import React from 'react';
import { Typography, Box, Grid, Card, CardContent, Avatar } from '@mui/material';

const OurProcessSection = ({
    title = 'Our Process',
    subtitle = "What make our specialist 'special'",
    description,
    processSteps = []
}) => {
    return (
        <Box sx={{ mb: 4, px: 4, py: 4 }} className={'container, bg-gray-200'}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
                    {subtitle}
                </Typography>
                {description && (
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        {description}
                    </Typography>
                )}
            </Box>

            {/* Process Steps Grid */}
            <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                <Grid container spacing={3}>
                    {processSteps.map((step, index) => (
                        <Grid size={{xs:12,sm:6,md:4}} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    bgcolor: 'grey.100',
                                    boxShadow: 'none',
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                                    {/* Avatar Placeholder */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        {step.avatarUrl ? (
                                            <Avatar
                                                src={step.avatarUrl}
                                                alt={step.header}
                                                sx={{ width: 80, height: 80 }}
                                            />
                                        ) : (
                                            <Avatar
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    bgcolor: 'grey.300',
                                                }}
                                            >
                                                <Box
                                                    component="svg"
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        fill: 'grey.600',
                                                    }}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                                </Box>
                                            </Avatar>
                                        )}
                                    </Box>

                                    {/* Header */}
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        {step.header}
                                    </Typography>

                                    {/* Description */}
                                    <Typography variant="body2" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default OurProcessSection;

