import React from "react";
import { Typography, Box } from "@mui/material";
import CurvedSection from "../../../../Components/CurvedSection.jsx";
const WhatWeDoHeader = ({ title = "What We Do", description }) => {
    return (
        <CurvedSection
            showBottomSection={false}
            topBgColor="#FFFFFF"
            bottomBgColor="#CED4DA"
            curveType="smile"
        >
            <Box
                sx={{
                    textAlign: "center",
                    pt: 8,
                    px: 4,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4,
                        pt: 8,
                        pb: 4,
                        px: 4,
                        width: "50%",
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        {title}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        {description}
                    </Typography>
                </Box>
            </Box>
        </CurvedSection>
    );
};

export default WhatWeDoHeader;
