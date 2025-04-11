import React from 'react';
import { Button, Card, CardActions, CardContent, Typography, Box, Chip, CardMedia } from '@mui/material';
import { Link } from "react-router-dom";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { styled } from '@mui/material/styles';

// Custom styled components
const MovieCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
  }
}));

const MoviePoster = styled(CardMedia)(({ theme }) => ({
  height: '300px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  }
}));

const MovieTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: '1.3',
  minHeight: '2.6em'
}));

const BookButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#900C3F',
  color: 'white',
  fontWeight: 600,
  borderRadius: '20px',
  padding: '6px 20px',
  '&:hover': {
    backgroundColor: '#7D0A37',
    transform: 'scale(1.05)',
  }
}));

const ReleaseDateChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
  '& svg': {
    fontSize: '0.9rem',
    marginRight: theme.spacing(0.5),
  }
}));

const MovieItem = ({ title, releaseDate, posterUrl, id }) => {
  // Format the release date
  const formattedDate = new Date(releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <MovieCard elevation={3}>
      <MoviePoster
        image={posterUrl}
        title={title}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <MovieTitle variant="h6" component="h2">
          {title}
        </MovieTitle>
        <ReleaseDateChip>
          <CalendarTodayIcon />
          <Typography variant="body2" component="span">
            {formattedDate}
          </Typography>
        </ReleaseDateChip>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
        <BookButton 
          component={Link} 
          to={`/booking/${id}`}
          endIcon={<LocalActivityIcon />}
          fullWidth
          size="medium"
        >
          Book Now
        </BookButton>
      </CardActions>
    </MovieCard>
  );
};

export default MovieItem;
