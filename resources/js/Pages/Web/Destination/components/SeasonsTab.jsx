import React from 'react';
import { Box, Card, CardContent, Typography, Chip, CardActions } from '@mui/material';

const SeasonsTab = ({ seasons, className, id }) => {
    return seasons && seasons.length > 0 ? (
        <div id={id} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {seasons.map((season) => (
                <Card key={season.id} variant="outlined">
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6">{season.duration}</Typography>
                    
                        </Box>
            
                        {season.description && (
                            <Typography variant="body2" color="text.secondary" 
                            sx={{ mt: 1, textAlign: 'center', minHeight: '200px' }}>
                                {season.description}
                            </Typography>
                        )}
                
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h5">{season.name}</Typography>
                        </Box>  
                    </CardContent>
            
                        
                </Card>
            ))}
        </div>
    ) : (
        <Box
            id={id}
            sx={{
                textAlign: 'center',
                py: 8,
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                bgcolor: '#fafafa',
            }}
        >
            <Typography variant="h6" color="text.secondary">
                No seasons available
            </Typography>
        </Box>
    );
};

export default SeasonsTab;


