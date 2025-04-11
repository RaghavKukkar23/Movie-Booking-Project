import React, { useEffect, useState, useRef } from 'react';
import { Button, Box, Typography, Container, Grid, Skeleton, Fade, Divider } from "@mui/material";
import MovieItem from "../components/Movies/MovieItem.js";
import { getAllMovies } from '../api-helpers/api-helpers';
import { Link } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';

// Theme Colors
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

const HeroSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '60vh',
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  marginBottom: theme.spacing(6),
  perspective: '1500px',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.4s ease',
  '&:hover .hero-content': {
    transform: 'translateZ(40px)',
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(15, 18, 24, 0.95) 0%, rgba(15, 18, 24, 0.7) 30%, rgba(15, 18, 24, 0.3) 70%, rgba(15, 18, 24, 0.1) 100%)',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    height: '40vh',
  },
}));

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.7s ease-in-out',
  filter: 'brightness(0.8)',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const HeroOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '3rem',
  zIndex: 2,
  transition: 'transform 0.5s ease-out',
});

const HeroContent = styled(Box)({
  transition: 'transform 0.5s ease-out',
  transformStyle: 'preserve-3d',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(5),
  fontWeight: 700,
  color: colors.text.primary,
  transition: 'transform 0.3s ease',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background: colors.gradient.primary,
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    '&:after': {
      width: '120px',
    }
  }
}));

const MovieGrid = styled(Grid)({
  perspective: '1500px',
  transformStyle: 'preserve-3d',
});

const MovieItemWrapper = styled(Box)(({ theme }) => ({
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: colors.background.paper,
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.25)',
  '&:hover': {
    transform: 'translateZ(25px) scale(1.05) rotateY(5deg)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22)',
    '&:before': {
      opacity: 1,
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 0 3px rgba(255, 62, 108, 0.3), inset 0 0 20px rgba(255, 62, 108, 0.1)',
    borderRadius: '12px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
    pointerEvents: 'none',
  }
}));

const StyledDivider = styled(Divider)({
  height: '2px',
  background: 'linear-gradient(90deg, rgba(255, 62, 108, 0) 0%, rgba(255, 62, 108, 0.5) 50%, rgba(255, 62, 108, 0) 100%)',
  margin: '3rem auto',
  width: '70%',
});

const ViewAllButton = styled(Button)(({ theme }) => ({
  padding: '10px 30px',
  fontWeight: 600,
  borderRadius: '50px',
  background: 'transparent',
  color: colors.accent.primary,
  border: `2px solid ${colors.accent.primary}`,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: colors.gradient.primary,
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: -1,
  },
  '&:hover': {
    color: '#FFFFFF',
    borderColor: 'transparent',
    transform: 'translateY(-5px) scale(1.05)',
    boxShadow: '0 10px 25px rgba(255, 62, 108, 0.4)',
    '&:before': {
      opacity: 1,
    }
  },
}));

const CategoryCard = styled(Box)({
  height: '130px',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  background: 'rgba(26, 33, 46, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'translateZ(20px) scale(1.05) rotateX(5deg)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 62, 108, 0.3)',
    '&:before': {
      opacity: 1,
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255, 62, 108, 0.1) 0%, rgba(99, 236, 219, 0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }
});

const WatchButton = styled(Button)(({ theme }) => ({
  padding: '10px 24px',
  fontWeight: 600,
  borderRadius: '50px',
  background: colors.gradient.primary,
  color: '#FFFFFF',
  boxShadow: '0 10px 20px rgba(255, 62, 108, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: '0 15px 25px rgba(255, 62, 108, 0.4)',
  }
}));

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const heroSectionRef = useRef(null);

  useEffect(() => { 
    setLoading(true);
    getAllMovies()
      .then((data) => {
        const sortedMovies = data.movies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setMovies(sortedMovies);
        
        // Set the first movie as featured movie for hero section
        if (sortedMovies.length > 0) {
          setFeaturedMovie(sortedMovies[0]);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Handle 3D tilt effect for hero section
  useEffect(() => {
    const heroElement = heroSectionRef.current;
    if (!heroElement) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = heroElement.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      heroElement.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -5}deg)`;
    };

    const handleMouseLeave = () => {
      heroElement.style.transform = 'rotateY(0deg) rotateX(0deg)';
    };

    heroElement.addEventListener('mousemove', handleMouseMove);
    heroElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove);
      heroElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [loading]);

  // Generated movie genres for demo
  const movieGenres = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Thriller'];

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={1000}>
          <HeroSection ref={heroSectionRef} sx={{ transformStyle: 'preserve-3d', transition: 'transform 0.3s ease' }}>
            {loading ? (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
                animation="wave" 
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
              />
            ) : (
              <>
                <HeroImage 
                  src={'https://assets-in.bmscdn.com/promotions/cms/creatives/1730286503105_web14.jpg'} 
                  alt={"Latest Releases"} 
                />
                <HeroOverlay>
                  <HeroContent className="hero-content">
                    <Typography 
                      variant="h2" 
                      fontWeight="800" 
                      sx={{ 
                        mb: 2, 
                        textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        background: 'linear-gradient(to right, #FFFFFF, #B0B8C4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {"Latest Blockbusters"}
                    </Typography>
                    
                    
                    <Box display="flex" sx={{ mb: 4 }}>
                      {movieGenres.slice(0, 3).map(genre => (
                        <Box 
                          key={genre}
                          sx={{
                            mr: 2,
                            px: 2,
                            py: 0.5,
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          {genre}
                        </Box>
                      ))}
                    </Box>
                  
                  </HeroContent>
                </HeroOverlay>
              </>
            )}
          </HeroSection>
        </Fade>

        <Box my={8}>
          <SectionTitle variant='h4' textAlign="center">
            Latest Releases
          </SectionTitle>
          
          {loading ? (
            <Grid container spacing={4} justifyContent="center">
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={300} 
                    animation="wave" 
                    sx={{ 
                      borderRadius: '12px',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="70%" 
                    height={30} 
                    sx={{ 
                      mt: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="40%" 
                    height={20} 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <MovieGrid container spacing={4} justifyContent="center">
              {movies && movies.slice(0, 4).map((movie, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in={true} timeout={500 + (index * 300)}>
                    <MovieItemWrapper>
                      <MovieItem 
                        id={movie._id} 
                        title={movie.title} 
                        posterUrl={movie.posterUrl} 
                        releaseDate={movie.releaseDate} 
                      />
                    </MovieItemWrapper>
                  </Fade>
                </Grid>
              ))}
            </MovieGrid>
          )}
        </Box>

        <StyledDivider />
        
        <Box sx={{ perspective: '1000px' }}>
          <Box 
            display="flex" 
            justifyContent="center" 
            mt={4} 
            mb={8}
            sx={{ transformStyle: 'preserve-3d' }}
          >
            <ViewAllButton 
              component={Link} 
              to="/movies" 
              variant='outlined' 
              endIcon={<ArrowForwardIcon />}
            >
              View All Movies
            </ViewAllButton>
          </Box>
        </Box>

        {/* New Featured Categories Section with 3D effect */}
        <Box mb={8}>
          <SectionTitle variant='h4' textAlign="center">
            Browse Categories
          </SectionTitle>

          <Grid container spacing={3} sx={{ perspective: '1000px', mt: 3 }}>
            {movieGenres.map((genre, index) => (
              <Grid item xs={6} sm={4} md={2} key={genre}>
                <Fade in={true} timeout={300 + (index * 150)}>
                  <CategoryCard>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      textAlign="center"
                      sx={{ 
                        color: colors.text.primary,
                        background: `linear-gradient(135deg, ${colors.text.primary} 30%, ${colors.accent.primary} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        transition: 'transform 0.3s ease',
                        textShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      {genre}
                    </Typography>
                  </CategoryCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default HomePage;