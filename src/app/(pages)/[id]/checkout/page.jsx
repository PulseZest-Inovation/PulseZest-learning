'use client';

import GoogleIcon from '@mui/icons-material/Google'; // Make sure to install @mui/icons-material if not already
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '../../../../assets/image/boy.png';
import TermsOfService from '../../../../components/courseComponents/terms-of-service/page';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import InvoiceTemplate, { generateAndSaveInvoice } from './InvoiceTemplate'; // Adjust path

const steps = ['Login', 'Agreement', 'Payment'];

const CheckoutPage = ({ params }) => {
  const [user] = useAuthState(auth);
  const [activeStep, setActiveStep] = useState(user ? 1 : 0);
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false); // Manage loading spinner state
  const { id } = params;
  const [agreed, setAgreed] = useState(false);
  const invoiceContainerRefs = useRef({}); // Ref for invoice template

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData({ ...docSnap.data(), uid: userId }); // Ensure uid is included
      } else {
        console.error('No such document!');
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
        setCourseData({ ...courseSnap.data(), courseId }); // Ensure courseId is included
      } else {
        console.error('No such course document!');
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
        handler: async (response) => {
          console.log('Payment success:', response);

          setLoading(true);

          // Save payment details in Firestore under user's document
          const userCourseRef = doc(collection(db, 'users', user.uid, 'courses'), id);
          const existingDoc = await getDoc(userCourseRef); // Check if the document exists
          if (!existingDoc.exists()) {
            await setDoc(userCourseRef, {
              courseId: id,
              amount: data.amount,
              currency: data.currency,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              date: new Date()
            });

            // Generate and save invoice for the user and course
            await generateAndSaveInvoice(
              { ...userData, uid: user.uid }, // Ensuring uid key
              {
                courseId: id,
                name: courseData.name,
                dateProcessed: new Date(),
                amount: data.amount,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              },
              invoiceContainerRefs,
              setLoading // Pass the setLoading function to control loading state
            );

            // Show toast notification
            toast.success('Payment successful! Course access granted.', { autoClose: 3000 });

            // // Redirect to /home
            // router.push('/home');

          } else {
            toast.warn('Course already purchased.', { autoClose: 3000 });
            setLoading(false);
          }
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
            <Typography variant="body1" style={{ marginBottom: '10px', fontWeight: 'bold'}}>
              This is the login step where users can log in using their Google account or mobile OTP.
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              {!user ? 'Please log in to proceed.' : 'You are already logged in.'}
            </Typography>
            {!user && (
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Button
                 variant="contained"
                 color="primary"
                 onClick={handleGoogleLogin}
                 startIcon={<GoogleIcon />}
                 style={{ backgroundColor: '#001d3d'}}
               >
                 Login with Google
               </Button>
               
               <Typography variant="subtitle1" style={{ margin: '0 10px' }}>OR</Typography>
               
               <Input
                 type="text"
                 placeholder="Phone Number"
                 style={{
                   backgroundColor: '#f1f1f1',
                   border: 'none',
                   padding: '8px',
                   borderRadius: '4px',
                 }}
               />
               
               <Input
                 type="text"
                 placeholder="OTP"
                 style={{
                   backgroundColor: '#f1f1f1',
                   border: 'none',
                   padding: '8px',
                   borderRadius: '4px',
                 }}
               />
               
               <Button variant="contained"  style={{ backgroundColor: '#001d3d' }}>
                 Login with OTP
               </Button>
             </div>
            )}
          </>
        );
        case 1:
          return (
            <div style={{ marginTop: '20px' }}>
              <TermsOfService />
              <div style={{ marginTop: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={handleAgreement}
                  />
                  <Typography variant="body2" style={{ display: 'inline', marginLeft: '8px' }}>
                    I Understand
                  </Typography>
                </label>
                <Typography variant="body1" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              {user ? 'Please agree to the terms and conditions to proceed.' : 'Please log in to proceed.'}
            </Typography>
              </div>
            </div>
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
    <div className="checkout-page" style={{ backgroundColor: '#001d3d', color: '#333333', minHeight: '100vh', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Left Side - Stepper and Details */}
        <div style={{ flex: '1 1 50%', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f1faee'}}>
          <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#001d3d' }}>
            Checkout Page
          </Typography>
          <Typography variant="h5" style={{ marginBottom: '20px', color: '#001d3d' }}>Checkout Steps</Typography>

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
            <Button disabled={activeStep === 0 || (activeStep === 1 && (!user || !agreed))} onClick={handleBack} variant="outlined" style={{ color: '#001d3d', borderColor: '#001d3d' }}>Back</Button>
            <Button
  disabled={!user || (activeStep === 1 && !agreed)} // Disable if not agreed in step 1
  variant="contained"
  color="primary"
  onClick={handleNext}
  style={{
    backgroundColor: !user || (activeStep === 1 && !agreed) ? '#ddd' : '#001d3d',
    cursor: !user || (activeStep === 1 && !agreed) ? 'not-allowed' : 'pointer'
  }}
>
  {activeStep === steps.length - 1 ? 'Pay Now' : 'Next'}
</Button>

          </div>
        </div>

        {/* Right Side - Course and Student Details */}
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '20px', marginLeft:'20px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f4f3ee' }}>
            <Typography variant="h5" style={{ marginBottom: '20px', color: '#000814' }}>Course Details</Typography>
            {courseData ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                  <Image 
                    src={courseData.thumbnail} 
                    alt="Course Logo" 
                    width= {52} height= {52}
                    style={{ marginRight: '10px', borderRadius: '50%' }} 
                  />
                  <div>
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
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f4f3ee' }}>
              <Typography variant="h5" style={{ marginBottom: '20px', color: '#000814' }}>Student Details</Typography>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Image src={Avatar} alt="Student Avatar" width={52} height={52} style={{ marginRight: '10px', borderRadius: '50%' }} />
                <div>
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
         {/* Loader */}
         {loading && (
        <div 
          style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1000' }}
        >
          <div 
            style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}
          >
            <Typography 
              variant="h6" 
              style={{ marginBottom: '10px' }}
            >
              Generating Invoice...
            </Typography>
            <div className="loader"></div>
          </div>
        </div>
      )}

      {/* Invoice Template for PDF Generation */}
      {loading && userData && courseData && (
        <div style={{ display: 'none' }}>
          <InvoiceTemplate 
            userData={userData} 
            courseData={{
              courseId: id,
              name: courseData.name,
              dateProcessed: new Date(),
              amount: courseData.salePrice * 100, // Assuming salePrice is in rupees
              paymentId: '', // Placeholder
              orderId: '' // Placeholder
            }} 
            setLoading={setLoading} // Pass the setLoading function to InvoiceTemplate
            refs={invoiceContainerRefs} 
          />
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CheckoutPage;