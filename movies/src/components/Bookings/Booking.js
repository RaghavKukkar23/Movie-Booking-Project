import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieDetails, getShowSeats } from '../../api-helpers/api-helpers';
import { 
  Typography, 
  Button, 
  Grid, 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Box, 
  Divider, 
  TextField,
  Container,
  Paper, 
  Chip,
  Avatar,
  Card,
  CardMedia,
  Fade,
  Zoom,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import TheatersIcon from '@mui/icons-material/Theaters';
import StarIcon from '@mui/icons-material/Star';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ChairIcon from '@mui/icons-material/Chair';
import CloseIcon from '@mui/icons-material/Close';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import PaymentIcon from '@mui/icons-material/Payment';

// Custom styled components
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const MovieTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  padding: theme.spacing(1, 4),
  marginBottom: theme.spacing(4),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '2px'
  }
}));

const MovieDetailCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const PosterImage = styled(CardMedia)(({ theme }) => ({
  height: '400px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  }
}));

const MovieInfoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
}));

const ActorChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  }
}));

const TheaterCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
  }
}));

const TheaterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const ShowtimeButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  border: '1px solid rgba(46, 125, 50, 0.3)',
  backgroundColor: 'rgba(232, 245, 233, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(200, 230, 201, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }
}));

const SeatButton = styled(Button)(({ theme, isbooked, isselected, category }) => {
  let backgroundColor, color, hoverBg;
  
  if (isbooked === 'true') {
    backgroundColor = alpha(theme.palette.grey[400], 0.4);
    color = theme.palette.text.disabled;
    hoverBg = backgroundColor;
  } else if (isselected === 'true') {
    switch (category) {
      case 'Diamond':
        backgroundColor = theme.palette.primary.main;
        color = theme.palette.primary.contrastText;
        hoverBg = theme.palette.primary.dark;
        break;
      case 'Gold':
        backgroundColor = theme.palette.secondary.main;
        color = theme.palette.secondary.contrastText;
        hoverBg = theme.palette.secondary.dark;
        break;
      case 'Silver':
        backgroundColor = theme.palette.error.main;
        color = theme.palette.error.contrastText;
        hoverBg = theme.palette.error.dark;
        break;
      default:
        backgroundColor = theme.palette.grey[300];
        color = theme.palette.text.primary;
        hoverBg = theme.palette.grey[400];
    }
  } else {
    backgroundColor = 'transparent';
    hoverBg = alpha(
      category === 'Diamond' 
        ? theme.palette.primary.main 
        : category === 'Gold' 
          ? theme.palette.secondary.main 
          : theme.palette.error.main, 
      0.1
    );
    color = theme.palette.text.primary;
  }

  return {
    minWidth: '36px',
    height: '36px',
    padding: 0,
    borderRadius: '6px',
    backgroundColor,
    color,
    border: `1px solid ${isbooked === 'true' ? 'transparent' : color}`,
    '&:hover': {
      backgroundColor: hoverBg,
    },
    '&.Mui-disabled': {
      backgroundColor,
      opacity: 0.6,
    }
  };
});

const ScreenIndicator = styled(Box)(({ theme }) => ({
  width: '90%',
  height: '8px',
  backgroundColor: theme.palette.grey[300],
  margin: '0 auto',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  position: 'relative',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:before': {
    content: '"SCREEN"',
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 500,
  }
}));

const SeatLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& > svg': {
    marginRight: theme.spacing(0.5),
  }
}));

const PaymentButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: '20px',
  fontWeight: 600,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  }
}));

// Helper function to get color based on seat category
const getSeatCategoryColor = (category) => {
  switch (category) {
    case 'Diamond': return 'primary';
    case 'Gold': return 'secondary';
    case 'Silver': return 'error';
    default: return 'default';
  }
};

const Booking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movie, setMovie] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Calculate alpha color function
    const alpha = (color, opacity) => {
      return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
    };

    // Fetch movie details
    useEffect(() => {
        setLoading(true);
        getMovieDetails(id)
            .then((res) => {
                setMovie(res.movie);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    // Group shows by theater
    const groupShowsByTheater = () => {
        if (!movie || !movie.shows) return {};
        
        const groupedShows = {};
        movie.shows.forEach((show) => {
            const theaterName = show.theater.name;
            if (!groupedShows[theaterName]) {
                groupedShows[theaterName] = [];
            }
            groupedShows[theaterName].push(show);
        });
        
        Object.keys(groupedShows).forEach((theaterName) => {
            groupedShows[theaterName].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        });
        
        return groupedShows;
    };

    // Handle showtime selection
    const handleShowtimeClick = (show) => {
        if (!localStorage.getItem("userId")) {
            navigate("/auth");
            toast.warn("Login Required", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        
        setSelectedShow(show);
        setSelectedSeats([]); // Reset selected seats when changing showtime
        fetchAvailableSeats(show._id); // Fetch available seats for the selected show
        setOpenBookingDialog(true);
    };

    // Fetch available seats for the selected show
    const fetchAvailableSeats = (showId) => {
        getShowSeats(showId)
            .then((res) => {
                setAvailableSeats(res.seats);
            })
            .catch((err) => console.error(err));
    };

    // Handle seat selection
    const handleSeatClick = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    // Calculate the total price based on selected seats
    const calculateTotalAmount = () => {
        let total = 0;
        selectedSeats.forEach((seat) => {
            if (seat <= 10) total += 300; // Diamond Seats
            else if (seat <= 30) total += 200; // Gold Seats
            else total += 100; // Silver Seats
        });
        return total;
    };

    // Define seat categories and prices
    const seatCategories = [
        { range: [1, 10], label: 'Diamond', price: 300, color: 'primary' },
        { range: [11, 30], label: 'Gold', price: 200, color: 'secondary' },
        { range: [31, 50], label: 'Silver', price: 100, color: 'error' },
    ];

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress color="secondary" />
                <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
                    Loading movie details...
                </Typography>
            </Box>
        );
    }

    return (
        <PageContainer maxWidth="lg">
            {movie && (
                <Fragment>
                    <Fade in={true} timeout={800}>
                        <Box textAlign="center" mb={4}>
                            <MovieTitle variant="h4">
                                {movie.title}
                            </MovieTitle>
                        </Box>
                    </Fade>

                    <Grid container spacing={4}>
                        {/* Left Section: Movie Details */}
                        <Grid item xs={12} md={5}>
                            <Zoom in={true} timeout={1000}>
                                <MovieDetailCard elevation={3}>
                                    <PosterImage
                                        image={movie.posterUrl}
                                        title={movie.title}
                                    />
                                    <MovieInfoSection>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <EventIcon color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body1" fontWeight="medium" color="textSecondary">
                                                Release Date: {formatDate(movie.releaseDate)}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="h6" fontWeight="bold" color="secondary" mb={1}>
                                            About the Movie
                                        </Typography>
                                        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                                            {movie.description}
                                        </Typography>
                                        
                                        <Typography variant="h6" fontWeight="bold" color="secondary" mb={1}>
                                            Starring
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" mb={1}>
                                            {movie.actors.map((actor) => (
                                                <ActorChip
                                                    key={actor}
                                                    icon={<StarIcon />}
                                                    label={actor}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            ))}
                                        </Box>
                                    </MovieInfoSection>
                                </MovieDetailCard>
                            </Zoom>
                        </Grid>

                        {/* Right Section: Theaters and Showtimes */}
                        <Grid item xs={12} md={7}>
                            <Typography variant="h5" fontWeight="bold" sx={{ 
                                mb: 3, 
                                display: 'flex', 
                                alignItems: 'center',
                                color: theme.palette.primary.main
                            }}>
                                <TheatersIcon sx={{ mr: 1 }} />
                                Available Theaters & Showtimes
                            </Typography>

                            {movie.shows && movie.shows.length > 0 ? (
                                Object.entries(groupShowsByTheater()).map(([theaterName, shows], index) => (
                                    <Fade in={true} timeout={800 + index * 200} key={theaterName}>
                                        <TheaterCard>
                                            <TheaterHeader>
                                                <LocalMoviesIcon color="primary" sx={{ mr: 1 }} />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {theaterName}
                                                </Typography>
                                            </TheaterHeader>
                                            <Grid container spacing={2}>
                                                {shows.map((show, idx) => (
                                                    <Grid item xs={6} sm={4} md={3} key={show._id}>
                                                        <Zoom in={true} timeout={1000 + idx * 100}>
                                                            <ShowtimeButton
                                                                fullWidth
                                                                onClick={() => handleShowtimeClick(show)}
                                                            >
                                                                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                                                                    <Typography variant="subtitle2" fontWeight="bold" color="#2e7d32">
                                                                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                                                        {formatTime(show.startTime)}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="textSecondary">
                                                                        {new Date(show.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                    </Typography>
                                                                </Box>
                                                            </ShowtimeButton>
                                                        </Zoom>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </TheaterCard>
                                    </Fade>
                                ))
                            ) : (
                                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#f8d7da', 0.3) }}>
                                    <Typography variant="body1" color="error" align="center">
                                        No shows available for this movie at the moment.
                                    </Typography>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>

                    {/* Seat Booking Dialog */}
                    <Dialog 
                        open={openBookingDialog} 
                        onClose={() => setOpenBookingDialog(false)}
                        fullWidth
                        maxWidth="md"
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }
                        }}
                    >
                        <Box sx={{ 
                            p: 2, 
                            backgroundColor: theme.palette.primary.main,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                Book Seats for {movie.title}
                            </Typography>
                            <IconButton 
                                onClick={() => setOpenBookingDialog(false)}
                                sx={{ color: 'white' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        p: 2, 
                                        mb: 3, 
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        borderRadius: '8px',
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                    }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={6}>
                                                <Box display="flex" alignItems="center">
                                                    <EventIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="body1">
                                                        {selectedShow ? new Date(selectedShow.startTime).toLocaleDateString([], {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : ''}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box display="flex" alignItems="center">
                                                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="body1">
                                                        {selectedShow ? formatTime(selectedShow.startTime) : ''}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <EventSeatIcon sx={{ mr: 1 }} /> Select Your Seats
                                    </Typography>
                                    
                                    <SeatLegend>
                                        <LegendItem>
                                            <ChairIcon sx={{ color: theme.palette.grey[400] }} />
                                            <Typography variant="caption">Booked</Typography>
                                        </LegendItem>
                                        <LegendItem>
                                            <ChairIcon sx={{ color: theme.palette.primary.main }} />
                                            <Typography variant="caption">Selected</Typography>
                                        </LegendItem>
                                        <LegendItem>
                                            <ChairIcon sx={{ color: theme.palette.text.primary }} />
                                            <Typography variant="caption">Available</Typography>
                                        </LegendItem>
                                    </SeatLegend>
                                    
                                    {seatCategories.map(({ range, label, price, color }) => (
                                        <Box key={label} mb={3}>
                                            <Typography 
                                                variant="subtitle1" 
                                                fontWeight="bold" 
                                                color={color}
                                                sx={{ 
                                                    mb: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <span>{label} Seats</span>
                                                <Chip 
                                                    label={`₹${price}`} 
                                                    size="small" 
                                                    color={color} 
                                                    variant="outlined"
                                                />
                                            </Typography>
                                            
                                            <Box 
                                                display="grid" 
                                                gridTemplateColumns={isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)"} 
                                                gap={1} 
                                                sx={{ 
                                                    p: 1,
                                                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                                                    borderRadius: '8px',
                                                    backgroundColor: alpha(theme.palette[color].main, 0.05)
                                                }}
                                            >
                                                {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]).map((seat) => {
                                                    const isBooked = availableSeats.find(s => s.seatNumber === seat && s.status === 'booked');
                                                    const isSelected = selectedSeats.includes(seat);
                                                    
                                                    return (
                                                        <Tooltip 
                                                            key={seat} 
                                                            title={isBooked ? "Already Booked" : isSelected ? "Selected" : `Seat ${seat} - ₹${price}`}
                                                            arrow
                                                        >
                                                            <span>
                                                                <SeatButton
                                                                    isbooked={isBooked ? 'true' : 'false'}
                                                                    isselected={isSelected ? 'true' : 'false'}
                                                                    category={label}
                                                                    onClick={() => !isBooked && handleSeatClick(seat)}
                                                                    disabled={isBooked}
                                                                    fullWidth
                                                                >
                                                                    {seat}
                                                                </SeatButton>
                                                            </span>
                                                        </Tooltip>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    ))}
                                    
                                    <ScreenIndicator>
                                        <ScreenshotMonitorIcon 
                                            sx={{ 
                                                position: 'absolute',
                                                bottom: '-10px',
                                                left: '50%',
                                                transform: 'translateX(-50%) translateY(100%)',
                                                color: theme.palette.text.secondary,
                                                fontSize: '2rem'
                                            }}
                                        />
                                    </ScreenIndicator>
                                </Grid>
                            </Grid>
                            
                            {/* Selected Seats Summary */}
                            <Box 
                                sx={{ 
                                    mt: 3, 
                                    p: 2, 
                                    borderRadius: '8px',
                                    backgroundColor: alpha(theme.palette.success.main, 0.05),
                                    border: selectedSeats.length > 0 ? `1px solid ${alpha(theme.palette.success.main, 0.2)}` : 'none'
                                }}
                            >
                                <Typography variant="h6" color="primary" fontWeight="bold" textAlign="center">
                                    Booking Summary
                                </Typography>
                                
                                {selectedSeats.length > 0 ? (
                                    <>
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">Selected Seats:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {selectedSeats.sort((a, b) => a - b).join(', ')}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="textSecondary">Total Amount:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                                    ₹{calculateTotalAmount()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ mt: 1 }}>
                                        Please select at least one seat to continue
                                    </Typography>
                                )}
                            </Box>
                        </DialogContent>
                        
                        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                            <Button 
                                onClick={() => setOpenBookingDialog(false)} 
                                variant="outlined"
                                color="secondary"
                                startIcon={<CloseIcon />}
                            >
                                Cancel
                            </Button>
                            
                            <PaymentButton
                                variant="contained"
                                color="primary"
                                disabled={selectedSeats.length === 0}
                                startIcon={<PaymentIcon />}
                                onClick={() => {
                                    if (selectedSeats.length === 0) {
                                        toast.error('Please select at least one seat');
                                        return;
                                    }
                                    
                                    // Simulate redirect to a payment gateway
                                    const totalAmount = calculateTotalAmount();
                                    selectedSeats.sort((a, b) => a - b);
                                    
                                    toast.success(`Redirecting to payment gateway. Amount: ₹${totalAmount}`, {
                                        position: "top-right",
                                        autoClose: 1500,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });
                                    
                                    // Redirect to the payment page
                                    navigate(`/payment/${totalAmount}`, {
                                        state: { selectedSeats, showId: selectedShow._id }
                                    });
                                }}
                            >
                                Pay ₹{calculateTotalAmount()}
                            </PaymentButton>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            )}
        </PageContainer>
    );
};

export default Booking;