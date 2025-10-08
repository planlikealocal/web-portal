import React from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import {ArrowBack as ArrowBackIcon} from '@mui/icons-material';
import {router} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import SpecialistFormDialog from '../../../Components/SpecialistFormDialog';

const SpecialistEdit = ({specialist}) => {
    const handleBack = () => {
        router.visit(`/admin/specialists/${specialist.id}`);
    };

    return (
        <AdminLayout>
            <Box sx={{p: 3}}>
                <Box sx={{mb: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                    <Button
                        startIcon={<ArrowBackIcon/>}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back to Specialist Details
                    </Button>
                    <Typography variant="h4" component="h1">
                        Edit Specialist
                    </Typography>
                </Box>

                <SpecialistFormDialog
                    open={true}
                    onClose={handleBack}
                    specialist={specialist}
                />
            </Box>
        </AdminLayout>
    );
};

export default SpecialistEdit;
