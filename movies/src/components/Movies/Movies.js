import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Skeleton, Fade, TextField, InputAdornment, Box, Chip } from '@mui/material';
import { getAllMovies } from '../../api-helpers/api-helpers.js';
import MovieItem from './MovieItem';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { styled } from '@mui/material/styles';

// Custom styled components
const PageHeading = styled(Typography)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  borderRadius: '8px',
  padding: '12px 24px',
  margin: '0 auto 40px auto',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(144, 12, 63, 0.2)',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '4px',
    backgroundColor: '#900C3F',
    borderRadius: '4px',
  },
}));

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    '&:hover fieldset': {
      borderColor: '#900C3F',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#900C3F',
    },
  },
});

const FilterChip = styled(Chip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  backgroundColor: selected ? '#900C3F' : '#f0f0f0',
  color: selected ? 'white' : '#333',
  '&:hover': {
    backgroundColor: selected ? '#800b38' : '#e0e0e0',
  },
}));

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setLoading(true);
    getAllMovies()
      .then((data) => {
        const sortedMovies = data.movies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setMovies(sortedMovies);
        setFilteredMovies(sortedMovies);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter movies based on search term
    const filtered = movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort filtered movies
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      } else if (sortOrder === 'oldest') {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else if (sortOrder === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'z-a') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
    
    setFilteredMovies(sorted);
  }, [searchTerm, sortOrder, movies]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeading variant='h4' textAlign='center' bgcolor="#900C3F" color='white'>
        All Movies
      </PageHeading>
      
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={4}>
        <SearchField
          placeholder="Search movies..."
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: { xs: 2, sm: 0 }, maxWidth: { sm: '300px' } }}
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box display="flex" alignItems="center">
          <FilterListIcon sx={{ mr: 1, color: '#900C3F' }} />
          <Box display="flex" flexWrap="wrap">
            <FilterChip 
              icon={<SortIcon />} 
              label="Newest" 
              clickable
              selected={sortOrder === 'newest'}
              onClick={() => handleSortChange('newest')}
            />
            <FilterChip 
              label="Oldest" 
              clickable
              selected={sortOrder === 'oldest'}
              onClick={() => handleSortChange('oldest')}
            />
            <FilterChip 
              label="A-Z" 
              clickable
              selected={sortOrder === 'a-z'}
              onClick={() => handleSortChange('a-z')}
            />
            <FilterChip 
              label="Z-A" 
              clickable
              selected={sortOrder === 'z-a'}
              onClick={() => handleSortChange('z-a')}
            />
          </Box>
        </Box>
      </Box>
      
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Skeleton variant="rectangular" width="100%" height={300} animation="wave" />
              <Skeleton variant="text" width="70%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={20} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
          </Typography>
          
          <Grid container spacing={3}>
            {filteredMovies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                <Fade in={true} timeout={300 + (index % 8) * 100}>
                  <Box>
                    <MovieItem 
                      id={movie._id} 
                      title={movie.title} 
                      posterUrl={movie.posterUrl} 
                      releaseDate={movie.releaseDate} 
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
          
          {filteredMovies.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No movies found matching "{searchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Movies;
