'use client'

import React, { useState } from 'react';
import { auth } from '../../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { HiCheckCircle } from 'react-icons/hi'; // Import checkmark icon

const steps = ['Login', 'Agreement', 'Payment']; // Define steps for the Stepper

const CheckoutPage = () => {
  const [user] = useAuthState(auth);
  const [activeStep, setActiveStep] = useState(user ? 1 : 0); // Initialize active step based on user login status

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        suid: Math.floor(1000000 + Math.random() * 9000000).toString(),
      });
      setActiveStep(1); // Move to step 1 after login
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="checkout-page" style={{ backgroundColor: '#ffffff', color: '#333333', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#4CAF50' }}>
        Checkout Page
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              {index === 1 && user && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <HiCheckCircle style={{ marginRight: '5px', color: '#4CAF50' }} />
                  You are already logged in
                </span>
              )}
              {index !== 1 && label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={{ marginTop: '20px' }}>
        {activeStep === 0 && !user && (
          <div>
            <Typography variant="h5" style={{ marginBottom: '10px', color: '#4CAF50' }}>Login</Typography>
            <Button variant="contained" color="primary" onClick={handleGoogleLogin} style={{ marginBottom: '10px', backgroundColor: '#4CAF50' }}>
              Login with Google
            </Button>
            <div style={{ marginBottom: '10px' }}>
              <Typography variant="subtitle1">OR</Typography>
              <input type="text" placeholder="Enter mobile number" style={{ marginRight: '10px', backgroundColor: '#f1f1f1', border: 'none', padding: '8px', borderRadius: '4px' }} />
              <input type="text" placeholder="Enter OTP" style={{ marginRight: '10px', backgroundColor: '#f1f1f1', border: 'none', padding: '8px', borderRadius: '4px' }} />
              <Button variant="contained" color="primary">Login with OTP</Button>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <Typography variant="h5" style={{ marginBottom: '10px', color: '#4CAF50' }}>Agreement</Typography>
            {!user && (
              <Typography variant="body1" style={{ marginBottom: '10px' }}>Please log in to proceed.</Typography>
            )}
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              {user ? 'You are already logged in.' : 'Please agree to the terms and conditions to proceed.'}
            </Typography>
            {!user && (
              <Button variant="contained" color="primary" onClick={handleGoogleLogin} style={{ backgroundColor: '#4CAF50' }}>
                Login with Google
              </Button>
            )}
            {user && (
              <Button variant="contained" color="primary" onClick={handleNext} style={{ backgroundColor: '#4CAF50' }}>
                Agree and Proceed to Payment
              </Button>
            )}
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <Typography variant="h5" style={{ marginBottom: '10px', color: '#4CAF50' }}>Payment</Typography>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>Complete your payment here.</Typography>
            {/* Implement Payment Integration Here */}
            <Button variant="contained" color="primary" style={{ backgroundColor: '#4CAF50' }}>Pay Now</Button>
          </div>
        )}
      </div>
      {/* Navigation Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0 || (activeStep === 1 && !user)} onClick={handleBack} variant="outlined" style={{ color: '#4CAF50', borderColor: '#4CAF50' }}>Back</Button>
        <Button variant="contained" color="primary" onClick={handleNext} style={{ backgroundColor: '#4CAF50' }}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
