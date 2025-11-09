import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Alert,
    Link as MuiLink,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SpecialistLayout from '../../../Layouts/SpecialistLayout';

const AppointmentsIndex = ({ appointments = [], hasGoogleCalendar = false }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'completed':
                return 'info';
            case 'cancelled':
                return 'error';
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
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {params.value?.substring(0, 8) || '-'}
                </Typography>
            ),
        },
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
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'pending'}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: 'html_link',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                params.value ? (
                    <MuiLink
                        href={params.value}
                        target="_blank"
                        rel="noopener"
                        sx={{ textDecoration: 'none' }}
                    >
                        View
                    </MuiLink>
                ) : '-'
            ),
        },
    ];

    const rows = useMemo(() => {
        return appointments.map((appointment, index) => ({
            id: appointment.id || `temp-${index}`,
            ...appointment,
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
        </SpecialistLayout>
    );
};

export default AppointmentsIndex;
