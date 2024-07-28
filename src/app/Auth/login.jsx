import React from 'react';
import { auth } from '../../utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = ({ onClose, onLogin }) => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await saveUserData(user);

      // Callback to parent component to handle login state
      onLogin(user);

      onClose(); // Close the login sidebar after successful login
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Function to save user data to Firestore
  const saveUserData = async (user) => {
    const db = getFirestore(); // Assuming firestore is initialized correctly
    const userRef = doc(db, 'users', user.uid);

    try {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        cuid: generateCuid(), // Generate random CUID (example function)
        userId: user.uid,
      });
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Example function to generate random CUID (7 digits)
  const generateCuid = () => {
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  return (
    <div>
      <button onClick={signInWithGoogle} style={styles.googleButton}>
        <img
          src="https://imgs.search.brave.com/IExh49goSu_TIApc0n-MmqpBD2bQhFkhp5YOgWV3zu4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZ29vZ2xlLXMt/bG9nby8xNTAvR29v/Z2xlX0ljb25zLTA5/LTEyOC5wbmc"
          alt="Google logo"
          style={styles.googleIcon}
        />
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#00000',
    backgroundColor: 'grey',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
};

export default Login;
