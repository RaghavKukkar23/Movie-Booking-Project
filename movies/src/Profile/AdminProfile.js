import React, { Fragment, useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Divider, Paper, Container, Fade, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MovieIcon from "@mui/icons-material/Movie";
import { styled } from '@mui/material/styles';
import { getAdminById } from "../api-helpers/api-helpers";

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
  background: colors.gradient.secondary,
  borderRadius: '50%',
  padding: theme.spacing(2),
  color: colors.text.primary,
  boxShadow: '0 10px 25px rgba(99, 236, 219, 0.3)',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.4s ease',
  '&:hover': {
    transform: 'rotate(5deg) scale(1.1)',
  }
}));

const EmailBadge = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  fontWeight: 'bold',
  borderRadius: '50px',
  marginTop: theme.spacing(2),
  background: colors.gradient.secondary,
  color: colors.text.primary,
  boxShadow: '0 8px 20px rgba(99, 236, 219, 0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(99, 236, 219, 0.4)',
  }
}));

const MoviesContainer = styled(Box)(({ theme }) => ({
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
  background: 'linear-gradient(to right, #FFFFFF, #63ECDB)',
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
    background: colors.gradient.secondary,
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
  background: 'linear-gradient(90deg, rgba(99, 236, 219, 0) 0%, rgba(99, 236, 219, 0.5) 50%, rgba(99, 236, 219, 0) 100%)',
  height: '2px',
  margin: '1rem 0 2rem',
});

const MovieItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: 'rgba(26, 33, 46, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'translateZ(20px) scale(1.03) translateX(5px)',
    boxShadow: '0 15px 30px rgba(255, 62, 108, 0.3)',
    border: '1px solid rgba(255, 62, 108, 0.3)',
    backgroundColor: 'rgba(26, 33, 46, 0.95)',
  }
}));

const MovieIconStyled = styled(MovieIcon)(({ theme }) => ({
  color: colors.accent.primary,
  marginRight: theme.spacing(2),
  transition: 'transform 0.3s ease',
}));

const AdminProfile = () => {
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminById()
      .then((res) => {
        setAdmin(res.admin);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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
                admin && (
                  <ProfileCard elevation={6}>
                    <ProfileIcon />
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{ 
                        mb: 2,
                        background: colors.gradient.primary,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Admin Profile
                    </Typography>
                    <EmailBadge variant="h6">
                      {admin.email}
                    </EmailBadge>
                  </ProfileCard>
                )
              )}
            </Box>

            {/* Movies Section */}
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
                admin && admin.addedMovies.length > 0 && (
                  <MoviesContainer>
                    <SectionTitle variant="h4">
                      Movies Collection
                    </SectionTitle>
                    <StyledDivider />
                    <List sx={{ perspective: '1000px' }}>
                      {admin.addedMovies.map((movie, index) => (
                        <Fade in={true} timeout={500 + (index * 300)} key={index}>
                          <MovieItem>
                            <MovieIconStyled />
                            <ListItemText
                              primary={movie.title}
                              primaryTypographyProps={{
                                fontWeight: 'bold',
                                color: colors.text.primary,
                                fontSize: '1.1rem'
                              }}
                              secondary={`Added on ${new Date(movie.releaseDate).toLocaleDateString()}`}
                              secondaryTypographyProps={{
                                color: colors.text.secondary
                              }}
                            />
                          </MovieItem>
                        </Fade>
                      ))}
                    </List>
                  </MoviesContainer>
                )
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </PageWrapper>
  );
};

export default AdminProfile;