import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    FormHelperText,
} from '@mui/material';

const MultiSelect = ({
    label,
    value = [],
    onChange,
    options = [],
    error = false,
    helperText = '',
    placeholder = 'Select options...',
    ...props
}) => {
    const handleChange = (event) => {
        const selectedValues = event.target.value;
        onChange(selectedValues);
    };

    return (
        <FormControl fullWidth error={error} {...props}>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                multiple
                value={value}
                onChange={handleChange}
                label={label}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                            const option = options.find(opt => opt.id === value);
                            return (
                                <Chip
                                    key={value}
                                    label={option ? option.name : value}
                                    size="small"
                                />
                            );
                        })}
                    </Box>
                )}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default MultiSelect;
