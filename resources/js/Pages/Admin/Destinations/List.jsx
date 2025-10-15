import React, {useState} from 'react';
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
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Visibility as ViewIcon} from '@mui/icons-material';
import {router, usePage} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';
import DestinationCreateDialog from '../../../Components/DestinationCreateDialog.jsx';

const List = (props) => {
    const {destinations, pagination} = props;
    const [formOpen, setFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);

    const handleEdit = (destination) => {
        router.visit(`/admin/destinations/${destination.id}/manage`);
    };

    const handleDelete = (destination) => {
        setSelectedDestination(destination);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedDestination) {
            router.delete(`/admin/destinations/${selectedDestination.id}`, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedDestination(null);
                },
            });
        }
    };

    const handleAddNew = () => {
        setFormOpen(true);
    };

    const handleCreateSuccess = (destination) => {
        setFormOpen(false);
        router.visit(`/admin/destinations/${destination.id}/manage`);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'home_image',
            headerName: 'Image',
            width: 100,
            renderCell: (params) => (
                params.value ? (
                    <Box
                        component="img"
                        src={params.value}
                        alt="Destination"
                        sx={{
                            width: 60,
                            height: 40,
                            borderRadius: 1,
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 60,
                            height: 40,
                            borderRadius: 1,
                            backgroundColor: 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: 'grey.600',
                        }}
                    >
                        No Image
                    </Box>
                )
            ),
        },
        {field: 'name', headerName: 'Name', flex: 1, minWidth: 150},
        {field: 'overview_title', headerName: 'Overview Title', flex: 1, minWidth: 150},
        {
            field: 'country',
            headerName: 'Country',
            width: 120,
        },
        {
            field: 'state_province',
            headerName: 'State/City',
            width: 150,
            renderCell: (params) => {
                return `${params.row.state_province}, ${params.row.city}`;
            },
        },
        {
            field: 'specialists',
            headerName: 'Specialists',
            width: 100,
            renderCell: (params) => '0', // Placeholder - will be implemented later
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.value === 'active' ? 'success.main' : 
                               params.value === 'draft' ? 'warning.main' : 'error.main',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        color="primary"
                        title="Manage"
                    >
                        <ViewIcon/>
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        color="primary"
                        title="Edit"
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row)}
                        color="error"
                        title="Delete"
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
                        Destinations Management
                    </Typography>
                    <Fab
                        color="primary"
                        aria-label="add destination"
                        onClick={handleAddNew}
                    >
                        <AddIcon />
                    </Fab>
                </Box>

                <Box sx={{height: 600, width: '100%'}}>
                    <DataGrid
                        rows={destinations}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 10},
                            },
                        }}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        paginationMode="server"
                        rowCount={pagination?.total || 0}
                        page={pagination?.current_page - 1 || 0}
                        pageSize={pagination?.per_page || 10}
                        onPaginationModelChange={(model) => {
                            router.get('/admin/destinations', {
                                page: model.page + 1,
                                per_page: model.pageSize,
                            }, {
                                preserveState: true,
                                replace: true,
                            });
                        }}
                    />
                </Box>

                <DestinationCreateDialog
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSuccess={handleCreateSuccess}
                />

                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete {selectedDestination?.name}?
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
            </Box>
        </AdminLayout>
    );
};

export default List;
