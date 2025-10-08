import React from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import {ArrowBack as ArrowBackIcon} from '@mui/icons-material';
import {router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import SpecialistFormDialog from '../../../Components/SpecialistFormDialog';

const SpecialistCreate = () => {
    const { props } = usePage();
    
    const handleBack = () => {
        router.visit('/admin/specialists');
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
                        Back to Specialists
                    </Button>
                    <Typography variant="h4" component="h1">
                        Create New Specialist
                    </Typography>
                </Box>

                <SpecialistFormDialog
                    open={true}
                    onClose={handleBack}
                    reSetForm={props.reSetForm || false}
                />
            </Box>
        </AdminLayout>
    );
};

export default SpecialistCreate;
