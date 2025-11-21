import React from 'react';
import { Typography, Box, Stack } from '@mui/material';

const TeamMembersSection = ({ teamMembers = [] }) => {
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 4, px: 4, py: 4 }}>
            {teamMembers.map((member, index) => (
                <Box key={index} sx={{ width: '50%' }}>
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: index === 0 ? 'right' : 'left', textAlign: index === 0 ? 'right' : 'left' }}>
                        <Box
                            component="img"
                            src={member.imageSrc}
                            alt={member.name}
                            sx={{
                                clear: 'both',
                                width: '50%',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                    <Box sx={{ 
                        mt: 4, 
                        textAlign: index === 0 ? 'right' : 'left', 
                        width: "50%", 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: index === 0 ? 'flex-end' : 'flex-start',
                        ml: index === 0 ? 'auto' : 0,
                        mr: index === 0 ? 0 : 'auto'
                    }}>
                        <Typography variant="h6" component="h1" gutterBottom color={"textDisabled"}>
                            {member.title}
                        </Typography>
                        <Typography variant="h4" component="h3" gutterBottom>
                            {member.name}
                        </Typography>
                        <Typography variant="body1">
                            {member.description}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
};

export default TeamMembersSection;

