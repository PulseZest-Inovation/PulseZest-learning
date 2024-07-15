"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore'; // Import getDoc to fetch document
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify'; // Import toast library
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import AgreeMent from '../../../../components/courseComponents/terms-of-service/page';


const steps = ['Login', 'Agreement', 'Payment']; // Define steps for the Stepper

const CheckoutPage = ({ params }) => {
  const [user] = useAuthState(auth);
  const [activeStep, setActiveStep] = useState(user ? 1 : 0); // Initialize active step based on user login status
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const { id } = params;

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      console.log(userId)
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };


  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user]);




  const fetchCourseData = async (courseId) => {
    try {
      const courseRef = doc(collection(db, 'courses'), courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourseData(courseSnap.data());
      } else {
        console.log('No such course document!');
      }
    } catch (error) {
      console.error('Error fetching course document:', error);
    }
  };

  useEffect(() => {
    fetchCourseData(id);
  }, [id]);


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
    if (!user && activeStep > 0) {
      toast.error('Please log in to proceed!', { autoClose: 3000 });
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Function to render details under each step
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              This is the login step where users can log in using their Google account or mobile OTP.
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              {!user ? 'Please log in to proceed.' : 'You are already logged in.'}
            </Typography>
            {!user && (
              <>
                <Button variant="contained" color="primary" onClick={handleGoogleLogin} style={{ marginBottom: '10px', backgroundColor: '#4CAF50' }}>
                  Login with Google
                </Button>
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant="subtitle1">OR</Typography>
                  <input type="text" placeholder="Enter mobile number" style={{ marginRight: '10px', backgroundColor: '#f1f1f1', border: 'none', padding: '8px', borderRadius: '4px' }} />
                  <input type="text" placeholder="Enter OTP" style={{ marginRight: '10px', backgroundColor: '#f1f1f1', border: 'none', padding: '8px', borderRadius: '4px' }} />
                  <Button variant="contained" color="primary">Login with OTP</Button>
                </div>
              </>
            )}
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              This is the agreement step where users need to agree to the terms and conditions.
              <AgreeMent/>
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              {user ? 'Please agree to the terms and conditions to proceed.' : 'Please log in to proceed.'}
            </Typography>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              This is the payment step where users can complete their payment.
            </Typography>
            {/* Implement Payment Integration Here */}
            <Button variant="contained" color="primary" style={{ backgroundColor: '#4CAF50' }}>Pay Now</Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkout-page" style={{ backgroundColor: '#ffffff', color: '#333333', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#4CAF50' }}>
        Checkout Page
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Left Side - Stepper and Details */}
        <div style={{ flex: '1 1 50%', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="h5" style={{ marginBottom: '20px', color: '#4CAF50' }}>Checkout Steps</Typography>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel style={{ width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body1">{label}</Typography>
                    <Typography variant="caption">Step {index + 1}</Typography>
                  </div>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          

          {/* Render detailed content for the active step */}
          <div style={{ marginTop: '20px' }}>
            {renderStepContent(activeStep)}
          </div>
          {/* Navigation Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0 || (activeStep === 1 && !user)} onClick={handleBack} variant="outlined" style={{ color: '#4CAF50', borderColor: '#4CAF50' }}>Back</Button>
        <Button disabled={!user} variant="contained" color="primary" onClick={handleNext} style={{ backgroundColor: '#4CAF50' }}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
        </div>
        

        {/* Right Side - Course and Student Details */}
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f0f0' }}>
            <Typography variant="h5" style={{ marginBottom: '20px', color: '#4CAF50' }}>Course Details</Typography>
            <strong>Course Id: {id}</strong>
            {courseData ? (
              <>
                 <img
                        src={courseData.thumbnail}
                        alt={courseData.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                  <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                    <strong>Title:</strong> {courseData.name}
                  </Typography>
                <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                  <strong>Instructor:</strong> Rishab Chauhan
                </Typography>
                <Typography variant="body1" style={{ marginBottom: '10px' }}>
                  <strong>Description:</strong> {courseData.description}
                </Typography>
              </>
            ) : (
              <Typography variant="body1">Loading...</Typography>
            )}
            {/* Add more course details as needed */}
          </div>

          {/* Student Details */}
          {userData && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f0f0' }}>
              <Typography variant="h5" style={{ marginBottom: '20px', color: '#4CAF50' }}>Student Details</Typography>
              <strong>Student Id: {user.uid} </strong >
              <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                <strong>Name: {userData.name}</strong>
              </Typography>
              <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                <strong>Email:{userData.email}</strong>
              </Typography>
              <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                <strong>Suid:{userData.suid}</strong>
              </Typography>
              {/* Add more student details as needed */}
            </div>
          )}
        </div>
      </div>


      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CheckoutPage;
