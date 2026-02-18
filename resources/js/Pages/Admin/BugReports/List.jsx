import React, {useState, useMemo} from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Paper,
    Chip,
    Collapse,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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

const issueTypeLabels = {
    ui_issue: 'UI Issue',
    crash: 'Crash',
    performance: 'Performance',
    feature_request: 'Feature Request',
    other: 'Other',
};

const List = (props) => {
    const {bugReports, filters: initialFilters = {}} = props;
    const [filtersOpen, setFiltersOpen] = useState(
        Object.keys(initialFilters).some(key => initialFilters[key])
    );

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        issue_type: initialFilters.issue_type || '',
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

        router.get('/admin/bug-reports', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            status: '',
            issue_type: '',
            date_from: null,
            date_to: null,
        };
        setFilters(clearedFilters);
        router.get('/admin/bug-reports', {}, {
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
            case 'in_review':
                return 'warning';
            case 'resolved':
                return 'success';
            case 'closed':
                return 'default';
            default:
                return 'default';
        }
    };

    const getIssueTypeColor = (type) => {
        switch (type) {
            case 'crash':
                return 'error';
            case 'ui_issue':
                return 'warning';
            case 'performance':
                return 'info';
            case 'feature_request':
                return 'success';
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
            field: 'reporter',
            headerName: 'Reporter',
            width: 200,
            valueGetter: (value, row) => {
                if (!row || !row.user) return 'N/A';
                return `${row.user.name || row.user.email}`;
            },
            renderCell: (params) => {
                if (!params.row || !params.row.user) return 'N/A';
                const user = params.row.user;
                return (
                    <Box>
                        <Typography variant="body2">{user.name || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    </Box>
                );
            },
        },
        {
            field: 'issue_type',
            headerName: 'Issue Type',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={issueTypeLabels[params.value] || params.value}
                    color={getIssueTypeColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 250,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'in_review' ? 'In Review' : params.value.charAt(0).toUpperCase() + params.value.slice(1)}
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
                            href={`/admin/bug-reports/${params.row.id}`}
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
                        Bug Reports
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
                                        placeholder="Search by title, description, or reporter"
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
                                            <MenuItem value="in_review">In Review</MenuItem>
                                            <MenuItem value="resolved">Resolved</MenuItem>
                                            <MenuItem value="closed">Closed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, md: 4}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Issue Type</InputLabel>
                                        <Select
                                            value={filters.issue_type}
                                            label="Issue Type"
                                            onChange={(e) => handleFilterChange('issue_type', e.target.value)}
                                        >
                                            <MenuItem value="">All</MenuItem>
                                            <MenuItem value="ui_issue">UI Issue</MenuItem>
                                            <MenuItem value="crash">Crash</MenuItem>
                                            <MenuItem value="performance">Performance</MenuItem>
                                            <MenuItem value="feature_request">Feature Request</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
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
                        rows={bugReports || []}
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
                        rowHeight={60}
                    />
                </Box>
            </Box>
        </AdminLayout>
    );
};

export default List;
