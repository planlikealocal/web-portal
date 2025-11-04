import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Divider,
    IconButton,
    Paper,
    Alert,
    Fab,
    CircularProgress,
} from "@mui/material";
import {
    Upload as UploadIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { useForm, router, usePage } from "@inertiajs/react";
import SpecialistLayout from "../../Layouts/SpecialistLayout";

const Profile = ({ specialist, countries }) => {
    const { props } = usePage();
    const [existingProfilePicPath, setExistingProfilePicPath] = useState(null);

    // Define initial form values
    const initialValues = {
        first_name: specialist?.first_name || "",
        last_name: specialist?.last_name || "",
        email: specialist?.email || "",
        profile_pic: null,
        bio: specialist?.bio || "",
        contact_no: specialist?.contact_no || "",
        country_id: specialist?.country_id || null,
        state_province: specialist?.state_province || "",
        city: specialist?.city || "",
        address: specialist?.address || "",
        postal_code: specialist?.postal_code || "",
        working_hours: specialist?.working_hours || [],
    };

    const { data, setData, post, processing, errors, reset } =
        useForm(initialValues);
    const { flash } = usePage().props;

    useEffect(() => {
        if (specialist) {
            setData({
                first_name: specialist.first_name || "",
                last_name: specialist.last_name || "",
                email: specialist.email || "",
                profile_pic: null,
                bio: specialist.bio || "",
                contact_no: specialist.contact_no || "",
                country_id: specialist.country_id || null,
                state_province: specialist.state_province || "",
                city: specialist.city || "",
                address: specialist.address || "",
                postal_code: specialist.postal_code || "",
                working_hours: specialist.working_hours || [],
            });
            setExistingProfilePicPath(specialist.profile_pic_url || null);
        }
    }, [specialist]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "profile_pic") {
                if (value instanceof File) {
                    formData.append(key, value);
                }
            } else if (key === "working_hours") {
                // Convert working hours array to JSON string
                formData.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        router.post("/specialist/profile", formData, {
            forceFormData: true,
            onSuccess: () => {
                // Success message will be shown via flash
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_pic", file);
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

    const addWorkingHour = () => {
        setData("working_hours", [
            ...data.working_hours,
            { start_time: "09:00", end_time: "17:00" },
        ]);
    };

    const removeWorkingHour = (index) => {
        const newHours = data.working_hours.filter((_, i) => i !== index);
        setData("working_hours", newHours);
    };

    const updateWorkingHour = (index, field, value) => {
        const newHours = [...data.working_hours];
        newHours[index] = { ...newHours[index], [field]: value };
        setData("working_hours", newHours);
    };

    if (!specialist) {
        return (
            <SpecialistLayout>
                <Alert severity="error">Specialist profile not found.</Alert>
            </SpecialistLayout>
        );
    }

    return (
        <SpecialistLayout>
            <Box>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Update your profile information and working hours
                </Typography>

                {flash?.success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {flash.success}
                    </Alert>
                )}
                {flash?.error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {flash.error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Personal Information
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Avatar
                                                    src={avatarSrc}
                                                    alt="Profile"
                                                    sx={{
                                                        width: 96,
                                                        height: 96,
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    {!data.profile_pic &&
                                                    (data.first_name ||
                                                        data.last_name)
                                                        ? `${(
                                                              data.first_name ||
                                                              ""
                                                          ).charAt(0)}${(
                                                              data.last_name ||
                                                              ""
                                                          ).charAt(
                                                              0
                                                          )}`.toUpperCase()
                                                        : null}
                                                </Avatar>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    style={{ display: "none" }}
                                                    id="profile-pic-input"
                                                />
                                                <label
                                                    htmlFor="profile-pic-input"
                                                    style={{ width: "100%" }}
                                                >
                                                    <Button
                                                        startIcon={
                                                            <UploadIcon />
                                                        }
                                                        variant="outlined"
                                                        component="span"
                                                        fullWidth
                                                        size="small"
                                                    >
                                                        {data.profile_pic
                                                            ? "Change Image"
                                                            : "Upload Image"}
                                                    </Button>
                                                </label>
                                                {errors.profile_pic && (
                                                    <Typography
                                                        variant="caption"
                                                        color="error"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {errors.profile_pic}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 9 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={6}
                                                label="Biography"
                                                value={data.bio}
                                                onChange={(e) =>
                                                    setData(
                                                        "bio",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.bio}
                                                helperText={
                                                    errors.bio ||
                                                    "Brief introduction and experience"
                                                }
                                                placeholder="Tell us about yourself..."
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                value={data.first_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "first_name",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.first_name}
                                                helperText={errors.first_name}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={data.last_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "last_name",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.last_name}
                                                helperText={errors.last_name}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Contact Number"
                                                value={data.contact_no}
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_no",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.contact_no}
                                                helperText={errors.contact_no}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormControl
                                                fullWidth
                                                required
                                                error={!!errors.country_id}
                                            >
                                                <InputLabel>Country</InputLabel>
                                                <Select
                                                    value={
                                                        data.country_id || ""
                                                    }
                                                    label="Country"
                                                    onChange={(e) =>
                                                        setData(
                                                            "country_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {countries?.map(
                                                        (country) => (
                                                            <MenuItem
                                                                key={country.id}
                                                                value={
                                                                    country.id
                                                                }
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    {country.flag_url && (
                                                                        <Avatar
                                                                            src={
                                                                                country.flag_url
                                                                            }
                                                                            alt={
                                                                                country.name
                                                                            }
                                                                            sx={{
                                                                                width: 20,
                                                                                height: 20,
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <Typography variant="body2">
                                                                        {
                                                                            country.name
                                                                        }
                                                                    </Typography>
                                                                </Box>
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                                {errors.country_id && (
                                                    <Typography
                                                        variant="caption"
                                                        color="error"
                                                        sx={{
                                                            mt: 0.5,
                                                            ml: 1.5,
                                                        }}
                                                    >
                                                        {errors.country_id}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="State/Province"
                                                value={data.state_province}
                                                onChange={(e) =>
                                                    setData(
                                                        "state_province",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.state_province}
                                                helperText={
                                                    errors.state_province
                                                }
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                value={data.city}
                                                onChange={(e) =>
                                                    setData(
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.city}
                                                helperText={errors.city}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                label="Address"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.address}
                                                helperText={errors.address}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Postal Code"
                                                value={data.postal_code}
                                                onChange={(e) =>
                                                    setData(
                                                        "postal_code",
                                                        e.target.value
                                                    )
                                                }
                                                error={!!errors.postal_code}
                                                helperText={errors.postal_code}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                            <Card
                                sx={{
                                    mb: 3,
                                    height: "580px",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        flex: 1,
                                        minHeight: 0,
                                        overflowY: "auto",
                                        maxHeight: "520px",
                                        p: 2,
                                        "&:last-child": { pb: 2 }, // override default CardContent padding
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 2,
                                            backgroundColor: "background.paper",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="h6">
                                            Working Hours
                                        </Typography>
                                        <Fab
                                            sx={{mt: -2}}
                                            color="primary"
                                            size="small"
                                            onClick={addWorkingHour}
                                            aria-label="Add Time Block"
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        Add your available working hours. You
                                        can add multiple time blocks (e.g.,
                                        morning shift and night shift).
                                    </Typography>

                                    {data.working_hours.length === 0 ? (
                                        <Paper
                                            sx={{
                                                p: 2,
                                                textAlign: "center",
                                                bgcolor: "grey.50",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                No working hours added. Click
                                                "Add Time Block" to add your
                                                working hours.
                                            </Typography>
                                        </Paper>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {data.working_hours.map(
                                                (hour, index) => (
                                                    <Grid
                                                        size={{ xs: 12 }}
                                                        key={index}
                                                    >
                                                        <Paper
                                                            sx={{
                                                                p: 2,
                                                                position:
                                                                    "relative",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "flex-end",
                                                                    mb: 1,
                                                                }}
                                                            >
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() =>
                                                                        removeWorkingHour(
                                                                            index
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        position:
                                                                            "absolute",
                                                                        top: 8,
                                                                        right: 8,
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                            <Typography
                                                                variant="subtitle2"
                                                                gutterBottom
                                                            >
                                                                Time Block{" "}
                                                                {index + 1}
                                                            </Typography>
                                                            <TextField
                                                                sx={{ width: "50%", mb: 1, pr: 1 }}
                                                                label="Start Time"
                                                                type="time"
                                                                value={
                                                                    hour.start_time ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateWorkingHour(
                                                                        index,
                                                                        "start_time",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                error={
                                                                    !!errors[
                                                                        `working_hours.${index}.start_time`
                                                                    ]
                                                                }
                                                                helperText={
                                                                    errors[
                                                                        `working_hours.${index}.start_time`
                                                                    ]
                                                                }
                                                                required
                                                                size="small"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                            <TextField
                                                                sx={{ width: "50%", pl: 1 }}
                                                                label="End Time"
                                                                type="time"
                                                                value={
                                                                    hour.end_time ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateWorkingHour(
                                                                        index,
                                                                        "end_time",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                error={
                                                                    !!errors[
                                                                        `working_hours.${index}.end_time`
                                                                    ]
                                                                }
                                                                helperText={
                                                                    errors[
                                                                        `working_hours.${index}.end_time`
                                                                    ]
                                                                }
                                                                required
                                                                size="small"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Paper>
                                                    </Grid>
                                                )
                                            )}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    {/* Working Hours Section */}
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => router.visit("/specialist")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    startIcon={
                                        processing ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        ) : (
                                            <SaveIcon />
                                        )
                                    }
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            </Box>
        </SpecialistLayout>
    );
};

export default Profile;
