import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={3}>
            <Typography variant="h4" gutterBottom>
                Booking Confirmed!
            </Typography>

            <Typography variant="h6" color="textSecondary" gutterBottom>
                Your booking has been successfully processed. Enjoy your movie!
            </Typography>

            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go to Home
            </Button>
        </Box>
    );
};

export default Confirmation;
