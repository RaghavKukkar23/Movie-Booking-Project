import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { Button, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { newBooking } from '../api-helpers/api-helpers';

const Payment = () => {
    const { amount } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedSeats, showId } = location.state || {}; // Destructure passed state
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    useEffect(() => {
        if (!amount || !selectedSeats || !showId) {
            toast.error('Invalid payment or booking details.');
            navigate('/');
        }
    }, [amount, selectedSeats, showId, navigate]);

    const handlePayment = () => {
        setIsPaymentProcessing(true);

        setTimeout(() => {
            // Simulate payment success
            setIsPaymentProcessing(false);
            toast.success('Payment Successful! Booking confirmed.');

            // Call the booking function after payment success
            newBooking({ show: showId, seatNumber: selectedSeats })
                .then((res) => {
                    console.log(res);
                    toast.success("Booking Done Successfully");
                    navigate('/confirmation'); // Redirect to confirmation page
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Booking failed, please try again.");
                });
        }, 3000); // Simulate a 3-second delay
    };

    const handleCancelPayment = () => {
        toast.warn('Payment cancelled.');
        navigate('/'); // Redirect back to home or booking page
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"  // Full viewport height
            bgcolor="#f4f6f8"
            padding={3}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    width: '100%',
                    maxWidth: 480,  // Ensure content doesn't stretch too much on large screens
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',  // Center all content inside the Paper
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h5" align="center" color="primary" fontWeight="bold" gutterBottom>
                    Payment Details
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" paragraph>
                    Please confirm your payment of ₹{amount} for your movie ticket booking.
                </Typography>

                {!isPaymentProcessing ? (
                    <Grid container spacing={2} direction="column" alignItems="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                onClick={handlePayment}
                                sx={{
                                    padding: '12px 24px',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                Pay ₹{amount}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="large"
                                fullWidth
                                onClick={handleCancelPayment}
                                sx={{
                                    padding: '12px 24px',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                Cancel Payment
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <CircularProgress color="primary" />
                        <Typography variant="body1" color="textPrimary" mt={2}>
                            Processing payment...
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default Payment;
