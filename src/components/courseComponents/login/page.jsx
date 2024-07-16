import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../utils/Firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupMode, setSignupMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success('Login successful');
      console.log(user.uid); // Log the user ID
      onLogin(user.uid); // Pass user ID to parent component
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed');
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const usersRef = collection(firestore, 'users');
      await setDoc(doc(usersRef, user.uid), {
        name: name,
        email: email,
        uid: user.uid,
        suid: generateSuid(),
      });

      toast.success('Signup successful');
      setSignupMode(false);
      console.log(user.uid); // Log the user ID
      onLogin(user.uid); // Pass user ID to parent component
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Signup failed');
    }
  };

  const generateSuid = () => {
    // Function to generate random 7-digit number
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        width: '120%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '50px', // Adjust top padding to shift the login box up
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          maxWidth: '29rem',
          position: 'relative',
          width: '250%',
          left: '-8%',
          marginTop: '-250px',
        }}
      >
        <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          {signupMode ? 'Sign Up' : 'Login'}
        </Typography>
        {signupMode && (
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {signupMode ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignup}
            style={{ marginTop: '1rem' }}
          >
            Sign Up
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={{ marginTop: '1rem' }}
          >
            Login
          </Button>
        )}
        <Typography
          variant="body1"
          style={{ color: '#38a169', cursor: 'pointer', marginTop: '0.5rem', textAlign: 'center' }}
          onClick={() => setSignupMode(!signupMode)}
        >
          {signupMode ? 'Already have an account? Login here' : "Don't have an account? Sign Up"}
        </Typography>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
};

export default LoginPage;
