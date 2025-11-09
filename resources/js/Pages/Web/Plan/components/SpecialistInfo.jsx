import React from 'react';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';

const SpecialistInfo = ({ specialist }) => {
    if (!specialist) {
        return null;
    }

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    src={specialist.avatar_url || specialist.profile_pic_url}
                    alt={specialist.full_name}
                    sx={{ width: 60, height: 60 }}
                >
                    {specialist.full_name?.charAt(0) || 'S'}  
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {specialist.full_name} 
                    </Typography>
                    {(specialist.country || specialist.state_province || specialist.location) && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {specialist.country && specialist.state_province
                                ? `${specialist.country}, ${specialist.state_province}`
                                : specialist.location || 
                                  (specialist.city && specialist.state_province && specialist.country 
                                    ? `${specialist.city}, ${specialist.state_province}, ${specialist.country}`
                                    : specialist.country || specialist.state_province || specialist.city || specialist.location)}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default SpecialistInfo;

