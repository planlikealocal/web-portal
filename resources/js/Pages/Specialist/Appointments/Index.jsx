import React, { useMemo, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Alert,
    Button,
    ButtonGroup,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Link as MuiLink,
    Stack,
    TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Info, ArrowDropDown, CalendarToday } from '@mui/icons-material';
import { router } from '@inertiajs/react';
import SpecialistLayout from '../../../Layouts/SpecialistLayout';
import PlanDetailsDialog from '../../../Components/PlanDetailsDialog';

// Actions cell component with dropdown menu
const ActionsCell = ({ row, onOpenPlanDetails }) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleMenuItemClick = (event, action) => {
        if (action === 'plan-details') {
            onOpenPlanDetails(row.plan_id);
        } else if (action === 'view-calendar') {
            window.open(row.html_link, '_blank', 'noopener,noreferrer');
        }
        setOpen(false);
    };

    // Build all available actions for dropdown menu
    const menuOptions = [];
    if (row.html_link) {
        menuOptions.push({ label: 'View Calendar', action: 'view-calendar', icon: <CalendarToday fontSize="small" /> });
    }
    if (row.plan_id) {
        menuOptions.push({ label: 'Plan Details', action: 'plan-details', icon: <Info fontSize="small" /> });
    }

    // If no actions available, return dash
    if (menuOptions.length === 0) {
        return <Typography variant="body2">-</Typography>;
    }

    // Show button group with dropdown containing all actions
    return (
        <>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="appointment actions"
                size="small"
            >
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select action"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    Actions
                </Button>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="more actions"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDown />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {menuOptions.map((option) => (
                                        <MenuItem
                                            key={option.action}
                                            onClick={(event) => handleMenuItemClick(event, option.action)}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {option.icon}
                                                {option.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const AppointmentsIndex = ({ appointments = [], hasGoogleCalendar = false, filters: initialFilters = {} }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    // Get today's date in YYYY-MM-DD format for default values
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [filters, setFilters] = useState({
        appointment_status: initialFilters?.appointment_status || 'active',
        start_date: initialFilters?.start_date || getTodayDate(),
        end_date: initialFilters?.end_date || getTodayDate(),
    });

    const handleOpenPlanDetails = (planId) => {
        setSelectedPlanId(planId);
        setDialogOpen(true);
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApplyFilters = () => {
        router.get('/specialist/appointments', filters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setFilters({
            appointment_status: '',
            start_date: '',
            end_date: '',
        });

        router.get('/specialist/appointments', {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const isFilterDirty = Boolean(filters.appointment_status || filters.start_date || filters.end_date);

    const getAppointmentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'completed':
                return 'info';
            case 'cancelled':
                return 'error';
            case 'draft':
            default:
                return 'default';
        }
    };

    const formatDateTime = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return '';
        try {
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
            return `${formattedDate} ${timeStr}`;
        } catch (e) {
            return `${dateStr} ${timeStr}`;
        }
    };

    const columns = [
        // {
        //     field: 'id',
        //     headerName: 'ID',
        //     width: 80,
        //     renderCell: (params) => (
        //         <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        //             {params.value?.substring(0, 8) || '-'}
        //         </Typography>
        //     ),
        // },
        {
            field: 'client_name',
            headerName: 'Client Name',
            width: 180,
            flex: 1,
        },
        {
            field: 'client_email',
            headerName: 'Email',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <MuiLink href={`mailto:${params.value}`} target="_blank" rel="noopener">
                    {params.value || '-'}
                </MuiLink>
            ),
        },
        {
            field: 'client_phone',
            headerName: 'Phone',
            width: 150,
            renderCell: (params) => (
                params.value ? (
                    <MuiLink href={`tel:${params.value}`}>
                        {params.value}
                    </MuiLink>
                ) : '-'
            ),
        },
        {
            field: 'summary',
            headerName: 'Title',
            width: 200,
            flex: 1,
        },
        {
            field: 'start_date',
            headerName: 'Date & Time',
            width: 200,
            renderCell: (params) => {
                const row = params.row;
                return formatDateTime(row.start_date, row.start_time);
            },
        },
        {
            field: 'start_time',
            headerName: 'Time',
            width: 100,
            renderCell: (params) => {
                const row = params.row;
                if (row.start_time && row.end_time) {
                    return `${row.start_time} - ${row.end_time}`;
                }
                return row.start_time || '-';
            },
        },
        {
            field: 'appointment_status',
            headerName: 'Appointment Status',
            width: 160,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'draft'}
                    color={getAppointmentStatusColor(params.value)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <ActionsCell row={params.row} onOpenPlanDetails={handleOpenPlanDetails} />
            ),
        },
    ];

    const rows = useMemo(() => {
        return appointments.map((appointment, index) => ({
            id: appointment.id || `temp-${index}`,
            ...appointment,
            appointment_status: appointment.appointment_status || appointment.plan?.appointment_status || 'draft',
        }));
    }, [appointments]);

    return (
        <SpecialistLayout>
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">
                        Appointments
                    </Typography>
                </Box>

                {!hasGoogleCalendar && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Google Calendar is not connected. Please connect your Google Calendar to view appointments.
                    </Alert>
                )}

                {hasGoogleCalendar && appointments.length === 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        No appointments found. Appointments will appear here once they are booked.
                    </Alert>
                )}

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                        >
                            <TextField
                                select
                                label="Appointment Status"
                                value={filters.appointment_status}
                                onChange={(event) => handleFilterChange('appointment_status', event.target.value)}
                                fullWidth
                                sx={{ minWidth: { md: 220 } }}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                type="date"
                                label="Start Date"
                                value={filters.start_date}
                                onChange={(event) => handleFilterChange('start_date', event.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{ minWidth: { md: 180 } }}
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                value={filters.end_date}
                                onChange={(event) => handleFilterChange('end_date', event.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{ minWidth: { md: 180 } }}
                            />
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" onClick={handleApplyFilters} size="medium">
                                    Apply
                                </Button>
                                <Button variant="outlined" onClick={handleClearFilters} disabled={!isFilterDirty}  size="medium">
                                    Clear
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Box sx={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10, 25, 50]}
                                disableSelectionOnClick
                                autoHeight={false}
                                sx={{
                                    '& .MuiDataGrid-cell': {
                                        fontSize: '0.875rem',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'grey.100',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                    },
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <PlanDetailsDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedPlanId(null);
                }}
                planId={selectedPlanId}
            />
        </SpecialistLayout>
    );
};

export default AppointmentsIndex;
