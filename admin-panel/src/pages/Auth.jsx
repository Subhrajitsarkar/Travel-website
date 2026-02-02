import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Firebase configuration
    const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
    const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;

    useEffect(() => {
        if (!FIREBASE_API_KEY) {
            setError("Configuration error: Firebase API Key is missing.");
            console.error("VITE_FIREBASE_API_KEY is not defined. Make sure to create a .env file and add the key.");
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (token) {
            navigate('/');
        }
    }, [navigate, FIREBASE_API_KEY]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${AUTH_URL}:signUp?key=${FIREBASE_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data)
                throw new Error(data.error?.message || 'Sign up failed');
            }

            localStorage.setItem('adminToken', data.idToken);
            localStorage.setItem('adminEmail', data.email);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${AUTH_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data)
                throw new Error(data.error?.message || 'Login failed');
            }

            localStorage.setItem('adminToken', data.idToken);
            localStorage.setItem('adminEmail', data.email);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">HotelAdmin</h2>
                <h3 className="auth-subtitle">{isSignUp ? 'Create Account' : 'Login and SignUp'}</h3>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                    }}
                    disabled={loading}
                >
                    {isSignUp ? 'Already have an account? Log In' : 'Create new account'}
                </button>
            </div>
        </div>
    );
}
