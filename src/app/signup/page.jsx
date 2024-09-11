"use client";
import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, Container } from '@mui/material';
import { useAuth } from '@/contexts/AuthContexts';
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDoctorSignup, setIsDoctorSignup] = useState(false); // State to toggle between user and doctor signup

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const doctorCodeRef = useRef(); // Ref for Doctor's code

  const { signup, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Initialize user function for regular users
  const initializeUser = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { itemsInCart: [], addresses: [] });
      console.log("User profile initialized for:", userId);
    } catch (error) {
      console.error("Error initializing user profile:", error);
    }
  };

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
      console.log(user);

      // Differentiate between user and doctor signups
      if (isDoctorSignup) {
        // Save doctor's code to Firestore
        const doctorDocRef = doc(db, "doctors", user.uid);
        await setDoc(doctorDocRef, { code: doctorCodeRef.current.value });
        console.log("Doctor's details saved:", user.uid);
      } else {
        await initializeUser(user.uid); // Initialize user profile for regular users
      }

      router.push('/');
    } catch (err) {
      setError('Sorry! Failed to create an account');
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const user = result.user;
      console.log(user);

      if (isDoctorSignup) {
        // Save doctor's code to Firestore
        const doctorDocRef = doc(db, "doctors", user.uid);
        await setDoc(doctorDocRef, { code: doctorCodeRef.current.value });
        console.log("Doctor's details saved:", user.uid);
      } else {
        await initializeUser(user.uid); // Initialize user profile for regular users
      }

      router.push('/');
    } catch (err) {
      setError('Sorry! Failed to create an account');
      console.error(err.message);
    } finally {
      setLoading(false);
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
                label="Doctor's Code"
                type="text"
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

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{ border: '1px solid black', padding: '0.5rem 1rem', textTransform: 'none' }}
            >
              Sign up with Google
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            {isDoctorSignup ? (
              <>
                Already have an account? <Button href="/login" variant="text">Log In</Button>
              </>
            ) : (
              <>
                Are you a doctor? <Button onClick={() => setIsDoctorSignup(true)} variant="text">Sign Up as Doctor</Button>
              </>
            )}
          </Typography>

          {isDoctorSignup && (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <Button onClick={() => setIsDoctorSignup(false)} variant="text">Sign Up as User</Button>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
