"use client";
import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, Container } from '@mui/material';
import { useAuth } from '@/contexts/AuthContexts';
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import GoogleIcon from '@mui/icons-material/Google';

export default function Signup() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDoctorSignup, setIsDoctorSignup] = useState(false);
  const [doctorPasswordPrompt, setDoctorPasswordPrompt] = useState(false);
  const [doctorPassword, setDoctorPassword] = useState('');

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const doctorCodeRef = useRef();

  const { signup, signInWithGoogle } = useAuth();
  const router = useRouter();

  const initializeUser = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { itemsInCart: [], addresses: [], orders: [], appointments: [] });
      console.log("User profile initialized for:", userId);
    } catch (error) {
      console.error("Error initializing user profile:", error);
    }
  };

  const isDoctorCodeUnique = async (code) => {
    const doctorQuery = query(collection(db, "doctors"), where("code", "==", code));
    const querySnapshot = await getDocs(doctorQuery);
    return querySnapshot.empty;
  };

  const isValidAlphanumeric = (code) => /^[a-zA-Z0-9]{8}$/.test(code);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;

      if (isDoctorSignup) {
        const doctorCode = doctorCodeRef.current.value;

        if (!isValidAlphanumeric(doctorCode)) {
          throw new Error('Doctor code must be exactly 8 alphanumeric characters.');
        }

        const isUnique = await isDoctorCodeUnique(doctorCode);
        if (!isUnique) {
          throw new Error('This doctor code is already in use. Please choose a different code.');
        }

        const doctorDocRef = doc(db, "doctors", user.uid);
        await setDoc(doctorDocRef, { code: doctorCode });
        console.log("Doctor's details saved:", user.uid);
      } else {
        await initializeUser(user.uid);
      }

      // Redirect to login with a success message
      router.push('/login?signupSuccess=true');
    } catch (err) {
      setError(err.message || 'Sorry! Failed to create an account');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      if (isDoctorSignup) {
        const doctorCode = doctorCodeRef.current.value;

        if (!isValidAlphanumeric(doctorCode)) {
          throw new Error('Doctor code must be exactly 8 alphanumeric characters.');
        }

        const isUnique = await isDoctorCodeUnique(doctorCode);
        if (!isUnique) {
          throw new Error('This doctor code is already in use. Please choose a different code.');
        }

        const doctorDocRef = doc(db, "doctors", user.uid);
        await setDoc(doctorDocRef, { code: doctorCode });
        console.log("Doctor's details saved:", user.uid);
      } else {
        await initializeUser(user.uid);
      }

      router.push('/login?signupSuccess=true');
    } catch (err) {
      setError(err.message || 'Sorry! Failed to create an account');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSignup = () => {
    if (doctorPassword === "MediCart") {
      setIsDoctorSignup(true);
      setDoctorPasswordPrompt(false);
    } else {
      setError('Incorrect password for doctor signup.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 400, color: "tertiary.main" }}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            {isDoctorSignup ? 'Doctor Sign Up' : 'Sign Up'}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              inputRef={passwordRef}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              inputRef={passwordConfirmRef}
            />

            {isDoctorSignup && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="doctor-code"
                label="Doctor's Code (8 alphanumeric characters)"
                type="password"
                id="doctor-code"
                inputRef={doctorCodeRef}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, mb: 2, backgroundColor: 'tertiary.main', color: 'secondary.main' }}
            >
              Submit
            </Button>
          </Box>

          {!isDoctorSignup && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={{ border: '1px solid black', padding: '0.5rem 1rem', textTransform: 'none', display: 'flex', alignItems: 'center' }}
              >
                <GoogleIcon sx={{ marginRight: 1, color: 'inherit' }} />
                Sign up with Google
              </Button>
            </Box>
          )}

          {!isDoctorSignup && (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <Button href="/login" variant="text">Log In</Button>
            </Typography>
          )}

          {doctorPasswordPrompt && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Enter Doctor Signup Password"
                type="password"
                value={doctorPassword}
                onChange={(e) => setDoctorPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleDoctorSignup();
                  }
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2, backgroundColor: 'tertiary.main', color: 'secondary.main' }}
                onClick={handleDoctorSignup}
              >
                Confirm
              </Button>
            </Box>
          )}

          {!doctorPasswordPrompt && (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              {isDoctorSignup ? (
                <>
                  Already have an account? <Button href="/login" variant="text">Log In</Button>
                </>
              ) : (
                <>
                  Are you a doctor? <Button onClick={() => setDoctorPasswordPrompt(true)} variant="text">Sign Up as Doctor</Button>
                </>
              )}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
