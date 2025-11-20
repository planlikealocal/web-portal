import React from 'react';
import {Typography, Box, Container, Grid, Button, Card, CardContent, Avatar, Stack} from '@mui/material';
import {Link} from '@inertiajs/react';
import WebsiteLayout from '../../Layouts/WebsiteLayout.jsx';
import CurvedSection from '../../Components/CurvedSection.jsx';
import AvatarGrid from '../../Components/AvatarGrid.jsx';

const WhatWeDo = () => {
    const teamMembers = [
        {
            name: 'Pasindu Wewegama',
            title: 'Title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
        },
        {
            name: 'Jerry Saxe',
            title: 'Title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
        }
    ];

    const processSteps = [
        {
            header: 'Header',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
        },
        {
            header: 'Header',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
        },
        {
            header: 'Header',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
        },
        {
            header: 'Header',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
        },
        {
            header: 'Header',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
        },
        {
            header: 'Header',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
        }
    ];

    return (
        <WebsiteLayout>
            <Box sx={{minHeight: '100vh'}}>
                <Box sx={{textAlign: 'center', mb: 4, pt: 8, pb: 4, px: 4}}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        What We Do
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>
                </Box>
                <Box className={'container, bg-gray-200'}>
                    <Stack direction="row" spacing={2} sx={{mb: 4, px: 4, py: 4,}}>
                        <Box sx={{width: '50%', display: 'flex', justifyContent: 'right', textAlign: 'right'}}>
                            <Box
                                component="img"
                                src="/web/our-story-image.webp"
                                alt="Our Story"
                                sx={{
                                    width: '50%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>
                        <Box sx={{width: '50%'}}>
                            <Box sx={{width: '50%'}}>
                                <Typography variant="h5" component="h1" gutterBottom>
                                    Our Story
                                </Typography>
                                <Typography variant="h4" component="h3" gutterBottom>
                                    Travel Inspired by passionate
                                    local explorers
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cilluroident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
                <Box className={'container, fullfillWidth'}>
                    <Box fullfillWidth sx={{mb: 4, px: 4, py: 4, textAlign: 'center'}}>
                        <Typography sx={{mb: 4, width:"100%"}} variant="h3" component="h1" gutterBottom align="center">
                            Our Team
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{mb: 4, px: 4, py: 4,}}>
                        <Box sx={{width: '50%',}}>
                            <Box sx={{width:"100%", display: 'flex', justifyContent: 'right', textAlign: 'right'}}>
                                <Box
                                    component="img"
                                    src="/web/pasindu.jpeg"
                                    alt="Team Member"
                                    sx={{
                                        clear: 'both',
                                        width: '50%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                            <Box sx={{mt: 4, textAlign: 'right', width:"50%", float: 'right'}}>
                                <Typography variant="h6" component="h1" gutterBottom color={"textDisabled"}>Title</Typography>
                                <Typography variant="h4" component="h3" gutterBottom>Pasindu Wewegama</Typography>
                                <Typography variant="body1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{width: '50%',}}>
                            <Box sx={{width:"100%"}}>
                                <Box
                                    component="img"
                                    src="/web/Jerry_resized.jpeg"
                                    alt="Team Member"
                                    sx={{
                                        clear: 'both',
                                        width: '50%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                            <Box sx={{mt: 4, width:"50%"}}>
                                <Typography variant="h6" component="h1" gutterBottom color={"textDisabled"}>Title</Typography>
                                <Typography variant="h4" component="h3" gutterBottom>Jerry Saxe</Typography>
                                <Typography variant="body1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{mb: 4, px: 4, py: 4,}}>
                        <Box sx={{width: '50%', display: 'flex', justifyContent: 'right', textAlign: 'right', pt: 3}}>
                            <Box sx={{mt: 4, width:"60%"}}>
                                <Typography variant="h6" gutterBottom>Our Specialists</Typography>
                                <Typography variant="h4"  gutterBottom >Meet the people
                                    who know your destination
                                    best</Typography>
                                <Typography variant="p"  gutterBottom >Tenete ergo quod si servitus quae natura liber, et aliena tua tunc impeditur. Dolebis, et turbabuntur, et invenietis, cum culpa tam dis hominibusque. Quod si tibi tantum sit propria et aliena quale sit, nemo unquam vel invitum te continebis.</Typography>

                            </Box>
                        </Box>
                        <Box sx={{width: '50%'}}>
                            <Box sx={{mt: 4, width:"60%"}}>
                                <AvatarGrid
                                    avatarUrls={[
                                        '/web/pasindu.jpeg','','','','','',
                                        '/web/Jerry_resized.jpeg','','','',
                                        '/web/pasindu.jpeg','','','',
                                        '/web/Jerry_resized.jpeg','','','','/web/pasindu.jpeg',

                                    ]}
                                    totalCircles={20}
                                    minSize={40}
                                    maxSize={120}
                                    spacing={2}
                                />
                            </Box>
                        </Box>

                    </Stack>
                </Box>
            </Box>
        </WebsiteLayout>
    );
};

export default WhatWeDo;
