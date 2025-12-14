import React, {useEffect, useMemo, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Divider,
    Avatar,
    CircularProgress,
} from '@mui/material';
import {Upload as UploadIcon, Save as SaveIcon, Close as CloseIcon} from '@mui/icons-material';
import {useForm, router, usePage} from '@inertiajs/react';

const SpecialistFormDialog = ({open, onClose, specialist = null, reSetForm =false}) => {

    const {props} = usePage()
    // Define initial form values
    const initialValues = {
        first_name: '',
        last_name: '',
        email: '',
        profile_pic: null,
        bio: '',
        contact_no: '',
        country_id: null,
        state_province: '',
        city: '',
        address: '',
        postal_code: '',
        status: 'active',
    };

    const {data, setData, post, put, processing, errors, reset} = useForm(initialValues);

    // Track existing image path separately so we can preview when editing
    const [existingProfilePicPath, setExistingProfilePicPath] = useState(null);

    // Ensure form values sync when switching between create/edit or changing selected specialist
    useEffect(() => {
        setExistingProfilePicPath(null);

        if (specialist) {
            // For editing, populate with specialist data
            setData({
                first_name: specialist.first_name || '',
                last_name: specialist.last_name || '',
                email: specialist.email || '',
                profile_pic: null, // don't preload a File object
                bio: specialist.bio || '',
                contact_no: specialist.contact_no || '',
                country_id: specialist.country_id || null,
                state_province: specialist.state_province || '',
                city: specialist.city || '',
                address: specialist.address || '',
                postal_code: specialist.postal_code || '',
                status: specialist.status || 'active',
            });
            setExistingProfilePicPath(specialist.profile_pic_url || null);
        } else {
            // For creating, reset to initial values
            reset();
            setExistingProfilePicPath(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specialist, open]);

    useEffect(() => {
        console.log('props', props)
        console.log('props-reSetForm', reSetForm)
        if(reSetForm){
            reset();
            setExistingProfilePicPath(null);
        }
    }, [reSetForm])
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'profile_pic') {
                if (value instanceof File) {
                    formData.append(key, value);
                }
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        const url = specialist
            ? `/admin/specialists/${specialist.id}`
            : '/admin/specialists';

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => {
                console.log(specialist ? 'Update success' : 'Create success');
                if (specialist) {
                } else {
                    reset();
                }
            },
            onError: (errors) => console.error('Submit error:', errors),
        });
    };


    const handleClose = () => {
        reset();
        setExistingProfilePicPath(null);
        onClose();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_pic', file);
        }
    };

    const avatarSrc = useMemo(() => {
        if (data.profile_pic instanceof File) {
            return URL.createObjectURL(data.profile_pic);
        }
        if (existingProfilePicPath) {
            return existingProfilePicPath;
        }
        return undefined;
    }, [data.profile_pic, existingProfilePicPath]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    <Typography variant="h6" component="div">
                        {specialist ? 'Edit Specialist' : 'Add New Specialist'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Provide specialist details below
                    </Typography>
                </DialogTitle>
                <Divider/>
                <DialogContent sx={{pt: 2}}>
                    <Grid container spacing={2} sx={{mb: 2, mt:2}}>
                        <Grid size={{xs: 12, sm: 3}}>
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Avatar
                                    src={avatarSrc}
                                    alt="Profile"
                                    sx={{width: 96, height: 96, mb: 1.5}}
                                >
                                    {(!data.profile_pic && (data.first_name || data.last_name)) ?
                                        `${(data.first_name || '').charAt(0)}${(data.last_name || '').charAt(0)}`.toUpperCase() : null}
                                </Avatar>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{display: 'none'}}
                                    id="profile-pic-input"
                                />
                                <label htmlFor="profile-pic-input" style={{width: '100%'}}>
                                    <Button
                                        startIcon={<UploadIcon/>}
                                        variant="outlined"
                                        component="span"
                                        fullWidth
                                    >
                                        {data.profile_pic ? 'Change Image' : 'Upload Image'}
                                    </Button>
                                </label>
                                {data.profile_pic && (
                                    <Typography variant="caption" color="text.secondary" sx={{mt: 1}}>
                                        {data.profile_pic.name}
                                    </Typography>
                                )}
                                {errors.profile_pic && (
                                    <Typography variant="caption" color="error" sx={{mt: 0.5}}>
                                        {errors.profile_pic}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                        <Grid size={{xs: 12, sm: 9}}>
                            <TextField
                                fullWidth
                                size="small"
                                multiline
                                rows={6}
                                label="Biography"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                error={!!errors.bio}
                                helperText={errors.bio || 'Brief introduction and experience'}
                                placeholder="Tell us about yourself..."
                            />
                        </Grid>

                    </Grid>
                    <Grid container spacing={2} sx={{mt: 0.5}}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="First Name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Last Name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Index Number"
                                value={data.contact_no}
                                onChange={(e) => setData('contact_no', e.target.value)}
                                error={!!errors.contact_no}
                                helperText={errors.contact_no}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <FormControl fullWidth required size="small" error={!!errors.country_id}>
                                <InputLabel>Country</InputLabel>
                                <Select
                                    value={data.country_id || ''}
                                    label="Country"
                                    onChange={(e) => setData('country_id', e.target.value)}
                                >
                                    {props.countries?.map((country) => (
                                        <MenuItem key={country.id} value={country.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {country.flag_url && (
                                                    <Avatar
                                                        src={country.flag_url}
                                                        alt={country.name}
                                                        sx={{ width: 20, height: 20 }}
                                                    />
                                                )}
                                                <Typography variant="body2">{country.name}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.country_id && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.country_id}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="State/Province"
                                value={data.state_province}
                                onChange={(e) => setData('state_province', e.target.value)}
                                error={!!errors.state_province}
                                helperText={errors.state_province}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="City"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                error={!!errors.city}
                                helperText={errors.city}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                multiline
                                label="Address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Postal Code"
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                                error={!!errors.postal_code}
                                helperText={errors.postal_code}
                                required
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <FormControl fullWidth required size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={data.status}
                                    label="Status"
                                    onChange={(e) => setData('status', e.target.value)}
                                    error={!!errors.status}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2.5}}>
                    <Button onClick={handleClose} startIcon={<CloseIcon/>} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={18} color="inherit"/> : <SaveIcon/>}
                    >
                        {processing ? 'Saving...' : (specialist ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SpecialistFormDialog;
