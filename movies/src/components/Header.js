import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Autocomplete, TextField, Tabs, Tab, Typography, Box, Button, IconButton } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAllMovies } from '../api-helpers/api-helpers';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { adminActions, userActions } from '../store';
import { toast } from 'react-toastify';
import { styled, alpha } from '@mui/material/styles';

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#2b2d42',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    opacity: 0.85,
    transition: 'opacity 0.2s ease-in-out',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  transition: 'all 0.3s ease',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 'auto',
    padding: '8px 16px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [value, setValue] = useState(0);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
    toast.success("Logout Successful", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleChange = (e, val) => {
    const movie = movies.find((m) => m.title === val);
    if (!movie) {
      return;
    }
    navigate(`/booking/${movie._id}`);
  };

  return (
    <StyledAppBar position='sticky'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <LogoContainer>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <MovieIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
              CineTicket
            </Typography>
          </Link>
        </LogoContainer>

        <Search sx={{ width: { xs: '40%', md: '30%' }, mx: 'auto' }}>
          <Autocomplete
            onChange={handleChange}
            freeSolo
            options={movies && movies.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search movies..."
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon sx={{ color: 'white', mr: 1 }} />,
                  sx: { 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                    },
                  }
                }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-inputRoot': {
                color: 'white',
              },
            }}
          />
        </Search>

        <Box>
          <StyledTabs 
            textColor='inherit'
            indicatorColor="secondary"
            value={value}
            onChange={(e, val) => setValue(val)}
          >
            <Tab 
              component={Link} 
              to="/movies" 
              label="Movies" 
              icon={<MovieIcon sx={{ fontSize: '1rem' }} />}
              iconPosition="start"
            />

            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab component={Link} to="/admin" label="Admin" />
                <Tab 
                  component={Link} 
                  to="/auth" 
                  label="Login" 
                  icon={<AccountCircleIcon sx={{ fontSize: '1rem' }} />}
                  iconPosition="start"
                />
              </>
            )}

            {isUserLoggedIn && (
              <>
                <Tab component={Link} to="/user" label="Profile" />
                <Tab 
                  onClick={() => logout(false)} 
                  component={Link} 
                  to="/" 
                  label="Logout" 
                />
              </>
            )}

            {isAdminLoggedIn && (
              <>
                <Tab component={Link} to="/addMovie" label="Add Movie" />
                <Tab component={Link} to="/addShow" label="Add Show" />
                <Tab component={Link} to="/user-admin" label="Admin Panel" />
                <Tab 
                  onClick={() => logout(true)} 
                  component={Link} 
                  to="/" 
                  label="Logout" 
                />
              </>
            )}
          </StyledTabs>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
