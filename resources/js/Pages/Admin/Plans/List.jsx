import React, {useState, useMemo} from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    MenuItem,
    Paper,
    Chip,
    Collapse,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import {
    Visibility as VisibilityIcon,
    Clear as ClearIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {router, Link} from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout.jsx';

const List = (props) => {
    const {plans, specialists, destinations, filters: initialFilters = {}} = props;
    const [filtersOpen, setFiltersOpen] = useState(
        Object.keys(initialFilters).some(key => initialFilters[key])
    );

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        appointment_status: initialFilters.appointment_status || '',
        payment_status: initialFilters.payment_status || '',
        plan_type: initialFilters.plan_type || '',
        specialist_id: initialFilters.specialist_id || '',
        destination_id: initialFilters.destination_id || '',
        date_from: initialFilters.date_from || null,
        date_to: initialFilters.date_to || null,
        appointment_date_from: initialFilters.appointment_date_from || null,
        appointment_date_to: initialFilters.appointment_date_to || null,
    });

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = () => {
        const params = {};

        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value && value !== '') {
                if (key.includes('date') && dayjs.isDayjs(value)) {
                    params[key] = value.format('YYYY-MM-DD');
                } else if (!key.includes('date') || value) {
                    params[key] = value;
                }
            }
        });

        router.get('/admin/plans', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            status: '',
            appointment_status: '',
            payment_status: '',
            plan_type: '',
            specialist_id: '',
            destination_id: '',
            date_from: null,
            date_to: null,
            appointment_date_from: null,
            appointment_date_to: null,
        };
        setFilters(clearedFilters);
        router.get('/admin/plans', {}, {
            preserveState: false,
        });
    };

    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(
            (value) => value && value !== '' && value !== null
        );
    }, [filters]);

    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'customer_name',
            headerName: 'Customer',
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) => {
                return `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A';
            },
        },
        // {
        //     field: 'email',
        //     headerName: 'Email',
        //     flex: 1,
        //     minWidth: 180,
        // },
        // {
        //     field: 'phone',
        //     headerName: 'Phone',
        //     width: 130,
        // },
        {
            field: 'specialist',
            headerName: 'Specialist',
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) => {
                return row.specialist?.full_name || 'N/A';
            },
        },
        {
            field: 'destination',
            headerName: 'Destination',
            flex: 1,
            minWidth: 150,
            valueGetter: (value, row) => {
                return row.destination || 'N/A';
            },
        },
        {
            field: 'plan_type',
            headerName: 'Plan Type',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'N/A'}
                    size="small"
                    color={params.value === 'premium' ? 'primary' : 'default'}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 110,
            renderCell: (params) => {
                const statusColors = {
                    draft: 'default',
                    active: 'success',
                    completed: 'info',
                    canceled: 'error',
                };
                return (
                    <Chip
                        label={params.value || 'draft'}
                        size="small"
                        color={statusColors[params.value] || 'default'}
                    />
                );
            },
        },
        {
            field: 'appointment_status',
            headerName: 'Appointment',
            width: 130,
            renderCell: (params) => {
                const statusColors = {
                    draft: 'default',
                    active: 'success',
                    completed: 'info',
                    canceled: 'error',
                };
                return (
                    <Chip
                        label={params.value || 'draft'}
                        size="small"
                        color={statusColors[params.value] || 'default'}
                        variant="outlined"
                    />
                );
            },
        },
        {
            field: 'payment_status',
            headerName: 'Payment',
            width: 110,
            renderCell: (params) => {
                const statusColors = {
                    pending: 'warning',
                    paid: 'success',
                    failed: 'error',
                };
                return (
                    <Chip
                        label={params.value || 'pending'}
                        size="small"
                        color={statusColors[params.value] || 'default'}
                    />
                );
            },
        },
        {
            field: 'appointment_start',
            headerName: 'Appointment Date',
            width: 180,
            renderCell: (params) => {
                return params.value
                    ? dayjs(params.value).format('MMM DD, YYYY HH:mm')
                    : 'N/A';
            },
        },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 150,
            renderCell: (params) => {
                return params.value
                    ? dayjs(params.value).format('MMM DD, YYYY')
                    : 'N/A';
            },
        },
        {

            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    component={Link}
                    href={`/admin/plans/${params.row.id}`}
                    color="primary"
                    title="View Plan"
                >
                    <VisibilityIcon/>
                </IconButton>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Box>
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1">
                        Plans Management
                    </Typography>
                    <Button
                        startIcon={filtersOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        variant="outlined"
                    >
                        {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Box>

                <Collapse in={filtersOpen}>
                    <Paper sx={{p: 3, mb: 3}}>
                        <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant="h6">Filters</Typography>
                            {hasActiveFilters && (
                                <Button
                                    startIcon={<ClearIcon/>}
                                    onClick={clearFilters}
                                    size="small"
                                    color="error"
                                >
                                    Clear All
                                </Button>
                            )}
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Search (Name, Email, Phone)"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filters.status}
                                            label="Status"
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="draft">Draft</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="canceled">Canceled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Appointment Status</InputLabel>
                                        <Select
                                            value={filters.appointment_status}
                                            label="Appointment Status"
                                            onChange={(e) => handleFilterChange('appointment_status', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="draft">Draft</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="canceled">Canceled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Payment Status</InputLabel>
                                        <Select
                                            value={filters.payment_status}
                                            label="Payment Status"
                                            onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="paid">Paid</MenuItem>
                                            <MenuItem value="failed">Failed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Plan Type</InputLabel>
                                        <Select
                                            value={filters.plan_type}
                                            label="Plan Type"
                                            onChange={(e) => handleFilterChange('plan_type', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="explore">Explore</MenuItem>
                                            <MenuItem value="pathfinder">Pathfinder</MenuItem>
                                            <MenuItem value="premium">Premium</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Specialist</InputLabel>
                                        <Select
                                            value={filters.specialist_id}
                                            label="Specialist"
                                            onChange={(e) => handleFilterChange('specialist_id', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {specialists.map((specialist) => (
                                                <MenuItem key={specialist.id} value={specialist.id}>
                                                    {specialist.first_name} {specialist.last_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Destination</InputLabel>
                                        <Select
                                            value={filters.destination_id}
                                            label="Destination"
                                            onChange={(e) => handleFilterChange('destination_id', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            {destinations.map((destination) => (
                                                <MenuItem key={destination.id} value={destination.id}>
                                                    {destination.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <DatePicker
                                        label="Created From"
                                        value={filters.date_from ? dayjs(filters.date_from) : null}
                                        onChange={(value) => handleFilterChange('date_from', value)}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <DatePicker
                                        label="Created To"
                                        value={filters.date_to ? dayjs(filters.date_to) : null}
                                        onChange={(value) => handleFilterChange('date_to', value)}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <DatePicker
                                        label="Appointment From"
                                        value={filters.appointment_date_from ? dayjs(filters.appointment_date_from) : null}
                                        onChange={(value) => handleFilterChange('appointment_date_from', value)}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <DatePicker
                                        label="Appointment To"
                                        value={filters.appointment_date_to ? dayjs(filters.appointment_date_to) : null}
                                        onChange={(value) => handleFilterChange('appointment_date_to', value)}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                                        <Button variant="outlined" onClick={clearFilters}>
                                            Clear
                                        </Button>
                                        <Button variant="contained" onClick={applyFilters}>
                                            Apply Filters
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </Paper>
                </Collapse>

                <Box sx={{height: 600, width: '100%'}}>
                    <DataGrid
                        rows={plans}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 25},
                            },
                        }}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.id}
                    />
                </Box>
            </Box>
        </AdminLayout>
    );
};

export default List;

