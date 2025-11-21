import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import ApplySpecialistDialog from '../../../../Components/ApplySpecialistDialog.jsx';

const WorkForUsSection = ({
    title = 'Work For Us',
    description = "Help travelers see your home through your eyes",
    buttonText = 'Apply to be a Specialist'
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Box sx={{ textAlign: 'center', mb: 4, px: 4, py: 8 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                    {description}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleOpenDialog}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderColor: 'grey.400',
                        color: 'text.primary',
                        '&:hover': {
                            borderColor: 'grey.600',
                            bgcolor: 'grey.50',
                        },
                    }}
                >
                    {buttonText}
                </Button>
            </Box>

            <ApplySpecialistDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
            />
        </>
    );
};

export default WorkForUsSection;

