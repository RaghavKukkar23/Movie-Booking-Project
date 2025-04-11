import React, { useState } from 'react';
import { Button, Dialog, FormLabel, IconButton, TextField, Typography, Box, DialogContent } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    background: colors.gradient.dark,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease-out',
    transform: 'translateY(0)',
    '&:hover': {
      transform: 'translateY(-5px)',
    }
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px',
  margin: 'auto',
  padding: theme.spacing(4),
  perspective: '1000px',
  transformStyle: 'preserve-3d',
}));

const StyledFormLabel = styled(FormLabel)({
  color: colors.text.secondary,
  marginTop: 0,
  marginBottom: 0,
  fontWeight: 500,
  transition: 'color 0.3s ease',
  '&:focus-within': {
    color: colors.accent.primary,
  }
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInput-underline:before': {
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: colors.accent.primary,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: colors.accent.primary,
  },
  '& .MuiInputBase-input': {
    color: colors.text.primary,
    transition: 'transform 0.3s ease',
    '&:focus': {
      transform: 'translateX(8px)',
    }
  },
  '& .MuiFormLabel-root': {
    color: colors.text.secondary,
    '&.Mui-focused': {
      color: colors.accent.primary,
    }
  }
}));

const ActionButton = styled(Button)(({ theme, secondary }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '50px',
  padding: '10px 24px',
  fontWeight: 600,
  background: secondary ? 'transparent' : colors.gradient.primary,
  color: secondary ? colors.text.primary : '#FFFFFF',
  border: secondary ? `2px solid ${colors.text.secondary}` : 'none',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: secondary ? 'none' : '0 10px 20px rgba(255, 62, 108, 0.3)',
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
    background: secondary ? colors.gradient.secondary : 'none',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: -1,
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.03)',
    boxShadow: secondary ? '0 8px 15px rgba(99, 236, 219, 0.3)' : '0 15px 25px rgba(255, 62, 108, 0.4)',
    border: secondary ? '2px solid transparent' : 'none',
    '&:before': {
      opacity: secondary ? 1 : 0,
    }
  }
}));

const DialogHeader = styled(Box)({
  position: 'relative',
  padding: '20px 0',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '10%',
    width: '80%',
    height: '2px',
    background: 'linear-gradient(90deg, rgba(255, 62, 108, 0) 0%, rgba(255, 62, 108, 0.5) 50%, rgba(255, 62, 108, 0) 100%)',
  }
});

const TitleText = styled(Typography)({
  fontWeight: 700,
  background: 'linear-gradient(to right, #FFFFFF, #FF3E6C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  textShadow: '0 2px 5px rgba(0,0,0,0.2)',
});

const CloseButton = styled(IconButton)({
  color: colors.text.secondary,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: colors.accent.primary,
    transform: 'rotate(90deg)',
  }
});

const AuthForm = ({ onSubmit, isAdmin }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "", email: "", password: ""
  });

  const [isSignup, setIsSignup] = useState(false);
  
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup });
  };

  return (
    <StyledDialog open={true} maxWidth="sm" fullWidth>
      <Box sx={{ ml: "auto", padding: 1 }}>
        <CloseButton onClick={() => { navigate('/') }}>
          <CloseRoundedIcon />
        </CloseButton>
      </Box>
      
      <DialogHeader>
        <TitleText variant="h4">
          {isSignup ? "Create Account" : "Welcome Back"}
        </TitleText>
      </DialogHeader>
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FormContainer>
            {!isAdmin && isSignup && (
              <>
                <StyledFormLabel>Name</StyledFormLabel>
                <StyledTextField 
                  value={inputs.name} 
                  onChange={handleChange} 
                  variant="standard" 
                  type="text" 
                  name="name" 
                />
              </>
            )}
            
            <StyledFormLabel>Email</StyledFormLabel>
            <StyledTextField 
              value={inputs.email} 
              onChange={handleChange} 
              variant="standard" 
              type="email" 
              name="email" 
            />
            
            <StyledFormLabel>Password</StyledFormLabel>
            <StyledTextField 
              value={inputs.password} 
              onChange={handleChange} 
              variant="standard" 
              type="password" 
              name="password" 
            />
            
            <ActionButton 
              type="submit" 
              fullWidth 
              variant="contained"
            >
              {isSignup ? "Create Account" : "Login"}
            </ActionButton>
            
            {!isAdmin && (
              <ActionButton 
                onClick={() => setIsSignup(!isSignup)} 
                fullWidth 
                secondary
              >
                {isSignup ? "Already have an account? Login" : "New user? Sign up"}
              </ActionButton>
            )}
          </FormContainer>
        </form>
      </DialogContent>
    </StyledDialog>
  );
};

export default AuthForm;