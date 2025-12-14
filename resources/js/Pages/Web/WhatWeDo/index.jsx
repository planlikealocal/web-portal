import React from 'react';
import { Box } from '@mui/material';
import WebsiteLayout from '../../../Layouts/WebsiteLayout.jsx';
import WhatWeDoHeader from './components/WhatWeDoHeader.jsx';
import OurStorySection from './components/OurStorySection.jsx';
import OurTeamHeader from './components/OurTeamHeader.jsx';
import TeamMembersSection from './components/TeamMembersSection.jsx';
import OurSpecialistsSection from './components/OurSpecialistsSection.jsx';
import OurProcessSection from './components/OurProcessSection.jsx';
import WorkForUsSection from './components/WorkForUsSection.jsx';
import styles from './style.module.scss';

const Index = () => {
    const teamMembers = [
        {
            name: 'Pasindu Wewegama',
            title: 'Title',
            imageSrc: '/web/pasindu.jpeg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            name: 'Jerry Saxe',
            title: 'Title',
            imageSrc: '/web/Jerry_resized.jpeg',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ];

    const specialistAvatarUrls = [
        '/web/pasindu.jpeg', '',
        '/web/Jerry_resized.jpeg', '', '', '',
        '/web/pasindu.jpeg', '', '', '',
        '/web/Jerry_resized.jpeg', '', '', '', '/web/pasindu.jpeg',
    ];

    const processSteps = [
        {
            header: 'Header',
            description: 'Quodsi haberent magnalia inter potentiam et'
        },
        {
            header: 'Header',
            description: 'Quodsi haberent magnalia inter potentiam et'
        },
        {
            header: 'Header',
            description: 'Quodsi haberent magnalia inter potentiam et'
        },
        {
            header: 'Header',
            description: 'Quodsi haberent magnalia inter potentiam et'
        },
        {
            header: 'Header',
            description: 'Quodsi haberent magnalia inter potentiam et'
        },
        {
            header: 'Header',
            description: 'Quodsi haberent magnalia inter potentiam et'
        }
    ];

    return (
        <WebsiteLayout>
            <Box sx={{ minHeight: '100vh' }}>
                <div className={styles.test}>
                    <p>SCSS Test this is white: this came from style.module.scss file in same directory</p>
                    <p className={styles.text}>SCSS Test this is red: this came from style.module.scss file in same directory</p>
                </div>
                <WhatWeDoHeader
                    title="What We Do"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                />
                <OurStorySection
                    imageSrc="/web/our-story-image.webp"
                    imageAlt="Our Story"
                    subtitle="Our Story"
                    title="Travel Inspired by passionate local explorers"
                    description="et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cilluroident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                />
                <OurTeamHeader title="Our Team" />
                <TeamMembersSection teamMembers={teamMembers} />
                <OurSpecialistsSection
                    subtitle="Our Specialists"
                    title="Meet the people who know your destination best"
                    description="Tenete ergo quod si servitus quae natura liber, et aliena tua tunc impeditur. Dolebis, et turbabuntur, et invenietis, cum culpa tam dis hominibusque. Quod si tibi tantum sit propria et aliena quale sit, nemo unquam vel invitum te continebis."
                    avatarUrls={specialistAvatarUrls}
                    totalCircles={20}
                    minSize={40}
                    maxSize={120}
                    spacing={2}
                />

                <OurProcessSection
                    title="Our Process"
                    subtitle="What make our specialist 'special'"
                    description="Quodsi haberent magnalia inter potentiam et divitias, et non illam quidem haec eo spectant haec quoque"
                    processSteps={processSteps}
                />

                <WorkForUsSection />
            </Box>
        </WebsiteLayout>
    );
};

export default Index;
