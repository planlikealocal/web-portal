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
    const {applications, filters: initialFilters = {}} = props;
    const [filtersOpen, setFiltersOpen] = useState(
        Object.keys(initialFilters).some(key => initialFilters[key])
    );

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        date_from: initialFilters.date_from || null,
        date_to: initialFilters.date_to || null,
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

        router.get('/admin/specialist-applications', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            status: '',
            date_from: null,
            date_to: null,
        };
        setFilters(clearedFilters);
        router.get('/admin/specialist-applications', {}, {
            preserveState: false,
        });
    };

    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(
            (value) => value && value !== '' && value !== null
        );
    }, [filters]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'primary';
            case 'reviewed':
                return 'warning';
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            valueGetter: (value, row) => {
                if (!row) return '';
                return `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A';
            },
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'city_state',
            headerName: 'City & State',
            width: 150,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 180,
            valueGetter: (value, row) => {
                if (!value && !row?.created_at) return '';
                const dateValue = value || row?.created_at;
                return dayjs(dateValue).format('YYYY-MM-DD HH:mm');
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                if (!params.row || !params.row.id) return null;
                return (
                    <Box>
                        <IconButton
                            component={Link}
                            href={`/admin/specialist-applications/${params.row.id}`}
                            size="small"
                            color="primary"
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <Box>
                <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" component="h1">
                        Specialist Applications
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                        {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Box>

                <Collapse in={filtersOpen}>
                    <Paper sx={{p: 2, mb: 3}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, md: 4}}>
                                    <TextField
                                        fullWidth
                                        label="Search"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        placeholder="Search by name, email, city, or phone"
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 4}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filters.status}
                                            label="Status"
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="new">New</MenuItem>
                                            <MenuItem value="reviewed">Reviewed</MenuItem>
                                            <MenuItem value="approved">Approved</MenuItem>
                                            <MenuItem value="rejected">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <DatePicker
                                        label="Date From"
                                        value={filters.date_from ? dayjs(filters.date_from) : null}
                                        onChange={(date) => handleFilterChange('date_from', date)}
                                        slotProps={{textField: {fullWidth: true}}}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <DatePicker
                                        label="Date To"
                                        value={filters.date_to ? dayjs(filters.date_to) : null}
                                        onChange={(date) => handleFilterChange('date_to', date)}
                                        slotProps={{textField: {fullWidth: true}}}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                                        {hasActiveFilters && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<ClearIcon />}
                                                onClick={clearFilters}
                                            >
                                                Clear
                                            </Button>
                                        )}
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
                        rows={applications || []}
                        columns={columns}
                        pageSizeOptions={[10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 25},
                            },
                        }}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        getRowId={(row) => row?.id || Math.random()}
                    />
                </Box>
            </Box>
        </AdminLayout>
    );
};

export default List;

