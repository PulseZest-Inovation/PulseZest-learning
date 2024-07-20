'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TermsOfService from '../../../../components/courseComponents/terms-of-service/page';
import axios from 'axios'; // Import Axios for making HTTP requests
import Image from 'next/image';
import Avatar from "../../../../assets/image/boy.png";

const steps = ['Login', 'Agreement', 'Payment']; // Define steps for the Stepper

const CheckoutPage = ({ params }) => {
  const [user] = useAuthState(auth);
  const [activeStep, setActiveStep] = useState(user ? 1 : 0);
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const { id } = params;
  const [agreed, setAgreed] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
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
      toast.error('Failed to log in. Please try again.', { autoClose: 3000 });
    }
  };

  const handleNext = () => {
    if (!user && activeStep > 0) {
      toast.error('Please log in to proceed!', { autoClose: 3000 });
    } else if (activeStep === steps.length - 1) {
      handlePayment();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePayment = async () => {
    try {
      const name = userData ? userData.name : ''; // Fetch from user data if available
      const email = userData ? userData.email : ''; // Fetch from user data if available
      const phone = ''; // Replace with actual phone number logic if needed

      const response = await axios.post('https://server-api-green.vercel.app/api/createOrder', {
        amount: courseData.salePrice * 100, // Amount in paisa (e.g., ₹100 = 10000 paisa)
        currency: 'INR', // Adjust based on your currency
        receipt: 'receipt#1', // Replace with your own receipt logic
        notes: { name, email, phone } // Use defined variables
      });

      const { data } = response;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the environment variable directly
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: 'PulseZest-Learning',
        description: 'Course Payment',
        image: 'https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/logo.png?alt=media&token=208465a0-63ae-4999-9c75-cf976af6a616', // Replace with your logo URL
        handler: async function (response) {
          console.log('Payment success:', response);

          // Save payment details in Firestore under user's document
          const userCourseRef = doc(collection(db, 'users', user.uid, 'courses'), id);
          await setDoc(userCourseRef, {
            courseId: id,
            amount: data.amount,
            currency: data.currency,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            date: new Date()
          });

          toast.success('Payment successful! Course access granted.', { autoClose: 3000 });

          // Redirect to home page after successful payment
          // Replace with your router's redirection logic
          window.location.href = '/dashboard/my-course';
        },
        prefill: {
          name,
          email,
          contact: phone
        },
        notes: {
          address: 'Your address'
        },
        theme: {
          color: '#61dafb'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Payment failed. Please try again.', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAgreement = () => {
    setAgreed(true); // Set agreed state to true
  };

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
              <TermsOfService />
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgreement} style={{ marginBottom: '10px', backgroundColor: '#4CAF50' }}>
              I Understand
            </Button>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkout-page" style={{ backgroundColor: '#457fe5', color: '#333333', minHeight: '100vh', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Left Side - Stepper and Details */}
        <div style={{ flex: '1 1 50%', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#4CAF50' }}>
            Checkout Page
          </Typography>
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
            <Button disabled={activeStep === 0 || (activeStep === 1 && (!user || !agreed))} onClick={handleBack} variant="outlined" style={{ color: '#4CAF50', borderColor: '#4CAF50' }}>Back</Button>
            <Button
              disabled={!user || (activeStep === 1 && !agreed)} // Disable if not agreed in step 1
              variant="contained"
              color="primary"
              onClick={handleNext}
              style={!user || (activeStep === 1 && !agreed) ? { backgroundColor: '#ddd', cursor: 'not-allowed' } : { backgroundColor: '#4CAF50' }}
            >
              {activeStep === steps.length - 1 ? 'Pay Now' : 'Next'}
            </Button>
          </div>
        </div>

        {/* Right Side - Course and Student Details */}
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f0f0' }}>
            <Typography variant="h5" style={{ marginBottom: '20px', color: '#4CAF50' }}>Course Details</Typography>
            {courseData ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Image 
                    src={courseData.thumbnail} 
                    alt="Course Logo" 
                    width= {52} height= {52}
                    style={{ marginRight: '10px', borderRadius: '50%' }} 
                  />
                  <div>
                    <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
                      <strong>Course ID:</strong> {id}
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
                      <strong>Title:</strong> {courseData.name}
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
                      <strong>Instructor:</strong> Rishab Chauhan
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                      <strong>Description:</strong> {courseData.description}
                    </Typography>
                  </div>
                </div>
              </>
            ) : (
              <Typography variant="body1">Loading...</Typography>
            )}
          </div>

          {/* Student Details */}
          {userData && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f0f0' }}>
              <Typography variant="h5" style={{ marginBottom: '20px', color: '#4CAF50' }}>Student Details</Typography>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Image src={Avatar} alt="Student Avatar" width={52} height={52} style={{ marginRight: '10px', borderRadius: '50%' }} />
                <div>
                  <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
                    <strong>Student ID:</strong> {userData.uid}
                  </Typography>
                  <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
                    <strong>Student Name:</strong> {userData.name}
                  </Typography>
                  <Typography variant="subtitle1" style={{ marginBottom: '5px' }}>
                    <strong>Student Email:</strong> {userData.email}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    <strong>Student SUID:</strong> {userData.suid}
                  </Typography>
                </div>
              </div>
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