import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Fab,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, LockReset as LockResetIcon} from '@mui/icons-material';
import {router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';
import SpecialistFormDialog from '../../../Components/SpecialistFormDialog.jsx';

const List = (props) => {
    const {specialists} = props
    const [formOpen, setFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [resetForm, setResetForm] = useState(false);

    useEffect(() => {
        console.log("props-all", specialists)
        if(specialists.length > 0){
            setResetForm(true)
        }
    }, [specialists])
    const handleEdit = (specialist) => {
        setSelectedSpecialist(specialist);
        setFormOpen(true);
    };

    const handleDelete = (specialist) => {
        setSelectedSpecialist(specialist);
        setDeleteDialogOpen(true);
    };

    const handleResetPassword = (specialist) => {
        setSelectedSpecialist(specialist);
        setResetPasswordDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedSpecialist) {
            router.delete(`/admin/specialists/${selectedSpecialist.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedSpecialist(null);
                },
            });
        }
    };

    const confirmResetPassword = () => {
        if (selectedSpecialist) {
            router.post(`/admin/specialists/${selectedSpecialist.id}/reset-password`, {}, {
                onSuccess: () => {
                    setResetPasswordDialogOpen(false);
                    setSelectedSpecialist(null);
                },
            });
        }
    };

    const handleAddNew = () => {
        setSelectedSpecialist(null);
        setFormOpen(true);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'profile_pic_url',
            headerName: 'Profile',
            width: 80,
            renderCell: (params) => (
                params.value ? (
                    <Box
                        component="img"
                        src={params.value}
                        alt="Profile"
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: 'grey.600',
                        }}
                    >
                        No Pic
                    </Box>
                )
            ),
        },
        {field: 'first_name', headerName: 'First Name', flex: 1},
        {field: 'last_name', headerName: 'Last Name', flex:1, width: 130},
        {field: 'email', headerName: 'Email', flex: 1},
        {field: 'contact_no', headerName: 'Contact No', flex: 1},
        {field: 'country', headerName: 'Country', width: 120, flex: 1},
        {field: 'city', headerName: 'City', width: 120, flex: 1},
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.value === 'active' ? 'success.main' : 'error.main',
                        fontWeight: 'bold',
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
        {field: 'no_of_trips', headerName: 'Trips', width: 80},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        color="primary"
                        title="Edit Specialist"
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleResetPassword(params.row)}
                        color="warning"
                        title="Reset Password"
                    >
                        <LockResetIcon/>
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row)}
                        color="error"
                        title="Delete Specialist"
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Box>
                <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" component="h1">
                        Specialists Management
                    </Typography>
                    <Fab
                        color="primary"
                        aria-label="add specialist"
                        onClick={handleAddNew}
                    >
                        <AddIcon />
                    </Fab>
                </Box>

                <Box sx={{height: 600, width: '100%'}}>
                    <DataGrid
                        rows={specialists}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 10},
                            },
                        }}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                    />
                </Box>

                <SpecialistFormDialog
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    specialist={selectedSpecialist}
                    resetForm={resetForm}
                />

                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to
                            delete {selectedSpecialist?.first_name} {selectedSpecialist?.last_name}?
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={resetPasswordDialogOpen}
                    onClose={() => setResetPasswordDialogOpen(false)}
                >
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to reset the password for {selectedSpecialist?.first_name} {selectedSpecialist?.last_name}?
                            A new password will be generated and sent to their email address.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setResetPasswordDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmResetPassword} color="warning" variant="contained">
                            Reset Password
                        </Button>
                    </DialogActions>
                </Dialog>


            </Box>
        </AdminLayout>
    );
};

export default List;
