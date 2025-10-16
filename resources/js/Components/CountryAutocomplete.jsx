import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    Box,
    Avatar,
    Typography,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

const CountryAutocomplete = ({
    value,
    onChange,
    error = false,
    helperText = '',
    label = 'Country',
    required = false,
    ...props
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Fetch countries when component mounts or input changes
    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/admin/countries/autocomplete', {
                    params: { search: inputValue }
                });
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchCountries, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    // Set initial input value when value prop changes
    useEffect(() => {
        if (value && typeof value === 'object' && value.name) {
            setInputValue(value.name);
        } else if (value && typeof value === 'string') {
            setInputValue(value);
        } else {
            setInputValue('');
        }
    }, [value]);

    const handleChange = (event, newValue) => {
        onChange(newValue);
    };

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
    };

    return (
        <Autocomplete
            value={value}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option.name || '';
            }}
            isOptionEqualToValue={(option, value) => {
                if (typeof option === 'string' && typeof value === 'string') {
                    return option === value;
                }
                return option.id === value?.id;
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText}
                    required={required}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.flag_url && (
                        <Avatar
                            src={option.flag_url}
                            alt={option.name}
                            sx={{ width: 24, height: 24 }}
                        />
                    )}
                    <Box>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {option.code}
                        </Typography>
                    </Box>
                </Box>
            )}
            {...props}
        />
    );
};

export default CountryAutocomplete;
