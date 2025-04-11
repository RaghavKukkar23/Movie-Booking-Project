import React, { Fragment, useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Divider, Paper, Container, Fade, Skeleton, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MovieIcon from "@mui/icons-material/Movie";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import { deleteBooking, getUserBooking, getUserDetails } from "../api-helpers/api-helpers";

// Theme Colors to match HomePage
const colors = {
  background: {
    main: '#0F1218',
    secondary: '#151A23',
    paper: '#1A212E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B8C4',
    accent: '#63ECDB',
  },
  accent: {
    primary: '#FF3E6C',
    secondary: '#63ECDB',
    tertiary: '#F4C63D',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #FF3E6C 0%, #FF8F6B 100%)',
    secondary: 'linear-gradient(135deg, #3E4DFF 0%, #63ECDB 100%)',
    dark: 'linear-gradient(135deg, #0F1218 0%, #1A212E 100%)',
  }
};

// Custom styled components
const PageWrapper = styled(Box)({
  background: colors.background.main,
  minHeight: '100vh',
  paddingTop: '2rem',
  paddingBottom: '2rem',
  color: colors.text.primary,
});

const ProfileCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: colors.background.paper,
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'translateZ(15px) scale(1.03)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
  }
}));

const ProfileIcon = styled(AccountCircleIcon)(({ theme }) => ({
  fontSize: '8rem',
  background: colors.gradient.primary,
  borderRadius: '50%',
  padding: theme.spacing(2),
  color: colors.text.primary,
  boxShadow: '0 10px 25px rgba(255, 62, 108, 0.3)',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.4s ease',
  '&:hover': {
    transform: 'rotate(5deg) scale(1.1)',
  }
}));

const UserBadge = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  fontWeight: 'bold',
  borderRadius: '50px',
  marginTop: theme.spacing(2),
  background: colors.gradient.primary,
  color: colors.text.primary,
  boxShadow: '0 8px 20px rgba(255, 62, 108, 0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(255, 62, 108, 0.4)',
  }
}));

const EmailBadge = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  fontWeight: 'bold',
  borderRadius: '50px',
  marginTop: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: colors.text.secondary,
  transition: 'all 0.3s ease',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    background: colors.gradient.secondary,
    color: colors.text.primary,
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(99, 236, 219, 0.3)',
  }
}));

const BookingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: colors.background.paper,
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.4s ease',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'translateZ(10px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  textAlign: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  color: colors.text.primary,
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(to right, #FFFFFF, #FF3E6C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background: colors.gradient.primary,
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    '&:after': {
      width: '120px',
    }
  }
}));

const StyledDivider = styled(Divider)({
  background: 'linear-gradient(90deg, rgba(255, 62, 108, 0) 0%, rgba(255, 62, 108, 0.5) 50%, rgba(255, 62, 108, 0) 100%)',
  height: '2px',
  margin: '1rem 0 2rem',
});

const BookingItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: 'rgba(26, 33, 46, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  padding: theme.spacing(2),
  '&:hover': {
    transform: 'translateZ(20px) scale(1.03) translateX(5px)',
    boxShadow: '0 15px 30px rgba(255, 62, 108, 0.3)',
    border: '1px solid rgba(255, 62, 108, 0.3)',
    backgroundColor: 'rgba(26, 33, 46, 0.95)',
  }
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: colors.accent.primary,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#FF0000',
    transform: 'scale(1.2) rotate(10deg)',
    background: 'rgba(255, 0, 0, 0.1)',
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    color: colors.accent.secondary,
  }
}));

const EmptyStateText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: colors.text.secondary,
  padding: theme.spacing(4, 2),
  borderRadius: '8px',
  border: `1px dashed ${colors.text.secondary}`,
  background: 'rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'scale(1.02)',
  }
}));

const TicketIcon = styled(ConfirmationNumberIcon)(({ theme }) => ({
  fontSize: '3rem',
  color: colors.accent.tertiary,
  marginBottom: theme.spacing(2),
}));

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserBooking(),
      getUserDetails()
    ])
      .then(([bookingRes, userRes]) => {
        setBookings(bookingRes.bookings || []);
        setUser(userRes.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    deleteBooking(id)
      .then((res) => {
        toast.success("Booking Deleted Successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box width="100%" display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} justifyContent="center">
            {/* Profile Card */}
            <Box width={{ xs: '100%', md: '30%' }}>
              {loading ? (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={300} 
                  animation="wave" 
                  sx={{ 
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }} 
                />
              ) : (
                user && (
                  <ProfileCard elevation={6}>
                    <ProfileIcon />
                    <UserBadge variant="h5">
                      {user.name}
                    </UserBadge>
                    <EmailBadge variant="body1">
                      {user.email}
                    </EmailBadge>
                  </ProfileCard>
                )
              )}
            </Box>

            {/* Bookings Section */}
            <Box width={{ xs: '100%', md: '65%' }}>
              {loading ? (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={400} 
                  animation="wave" 
                  sx={{ 
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }} 
                />
              ) : (
                <BookingsContainer>
                  <SectionTitle variant="h4">
                    Your Bookings
                  </SectionTitle>
                  <StyledDivider />
                  
                  {bookings.length > 0 ? (
                    <List sx={{ perspective: '1000px' }}>
                      {bookings.map((booking, index) => (
                        <Fade in={true} timeout={500 + (index * 300)} key={index}>
                          <BookingItem>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                              <Box sx={{ flex: 1, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}>
                                <InfoItem>
                                  <MovieIcon />
                                  <Typography variant="h6" color={colors.text.primary} fontWeight="bold">
                                    {booking.show?.movie?.title || 'N/A'}
                                  </Typography>
                                </InfoItem>
                                <InfoItem>
                                  <EventSeatIcon />
                                  <Typography variant="body1" color={colors.text.secondary}>
                                    Seat: {booking.seatNumber.map((seat, idx) => (
                                      <span key={idx}>{seat}{idx < booking.seatNumber.length - 1 ? ', ' : ''}</span>
                                    ))}
                                  </Typography>
                                </InfoItem>
                              </Box>
                              
                              <Box sx={{ flex: 1 }}>
                                <InfoItem>
                                  <CalendarTodayIcon />
                                  <Typography variant="body1" color={colors.text.secondary}>
                                    Date: {new Date(booking.show.startTime).toLocaleDateString()}
                                  </Typography>
                                </InfoItem>
                                <InfoItem>
                                  <AccessTimeIcon />
                                  <Typography variant="body1" color={colors.text.secondary}>
                                    Time: {new Date(booking.show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </Typography>
                                </InfoItem>
                              </Box>
                              
                              <DeleteButton 
                                edge="end" 
                                onClick={() => handleDelete(booking._id)}
                              >
                                <DeleteForeverIcon />
                              </DeleteButton>
                            </Box>
                          </BookingItem>
                        </Fade>
                      ))}
                    </List>
                  ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
                      <TicketIcon />
                      <EmptyStateText variant="h6">
                        No bookings found. Time to catch a movie!
                      </EmptyStateText>
                    </Box>
                  )}
                </BookingsContainer>
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </PageWrapper>
  );
};

export default UserProfile;