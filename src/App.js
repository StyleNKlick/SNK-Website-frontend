import React, { useState } from 'react';
import './styles.css';

const App = () => {
    const [token, setToken] = useState(null);
    const [showHomePage, setShowHomePage] = useState(true); // Added state for Home Page
    const [authFormData, setAuthFormData] = useState({ username: '', password: '' });
    const [formData, setFormData] = useState({
        complexion: '',
        travelLocation: '',
        gender: '',
        size: '',
        styleType: '',
    });
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes for authentication
    const handleAuthChange = (e) => {
        const { name, value } = e.target;
        setAuthFormData({ ...authFormData, [name]: value });
    };

    // Handle input changes for styling suggestions
    const handleSuggestionChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle Login/Register
    const handleAuth = async (endpoint) => {
        setError('');
        try {
            setLoading(true);
            const response = await fetch(`https://your-render-app.onrender.com/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authFormData),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                alert(data.message);
                if (endpoint === 'login') {
                    setToken(data.token); // Store token on successful login
                    setShowHomePage(false); // Redirect to main page after login
                }
            } else {
                setError(data.message || 'Failed to authenticate. Please try again.');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            setError('An error occurred. Please try again later.');
            setLoading(false);
        }
    };

    // Handle Logout
    const handleLogout = () => {
        setToken(null);
        setFormData({
            complexion: '',
            travelLocation: '',
            gender: '',
            size: '',
            styleType: '',
        });
        setSuggestions([]);
        setShowHomePage(true); // Redirect to Home Page on logout
        alert('Logged out successfully!');
    };

    // Handle Contact Us
    const handleContactUs = () => {
    alert("For personalized suggestions, please contact us at: support@stylenklick.com");
    };

    // Handle form submission for styling suggestions
    const handleSuggestionSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (
            !formData.complexion ||
            !formData.travelLocation ||
            !formData.gender ||
            !formData.size ||
            !formData.styleType
        ) {
            setError('Please fill in all fields to get suggestions.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('https://your-render-app.onrender.com/api/suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include token for authenticated requests
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setSuggestions(data.styling);
                alert(data.message);
            } else {
                setError(data.message || 'Unable to fetch suggestions. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('An error occurred while fetching suggestions. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            {showHomePage && !token ? (
                <div className="home-container">
                    <h1>Welcome to StyleNKlick</h1>
                    <img
                        src="images\doodle-background.jpeg" // Replace with a relevant image URL
                        alt="Fashion Inspiration"
                        className="home-image"
                    />
                    <p className="quote">
                        "Fashion is not about brand. It's about style."
                    </p>
                    <button
                        className="login-register-button"
                        onClick={() => setShowHomePage(false)}
                    >
                        Login / Register
                    </button>
                </div>
            ) : !token ? (
                <div className="auth-container">
                    <h1>Login / Register</h1>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={authFormData.username}
                        onChange={handleAuthChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={authFormData.password}
                        onChange={handleAuthChange}
                    />
                    <button onClick={() => handleAuth('register')} disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <button onClick={() => handleAuth('login')} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </div>
            ) : (
                <div className="main-container">
                    <div className="welcome-header">
                        <h1>Welcome to StyleNKlick!!</h1>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>  
                    </div>

                    <h2>Styling Suggestions</h2>
                    <form onSubmit={handleSuggestionSubmit}>
                        <label>
                            Complexion:
                            <select
                                name="complexion"
                                value={formData.complexion}
                                onChange={handleSuggestionChange}
                            >
                                <option value="">Select</option>
                                <option value="light">Light</option>
                                <option value="medium">Medium</option>
                                <option value="dark">Dark</option>
                            </select>
                        </label>

                        <label>
                            Travel Location:
                            <select
                                name="travelLocation"
                                value={formData.travelLocation}
                                onChange={handleSuggestionChange}
                            >
                                <option value="">Select</option>
                                <option value="beach">Beach</option>
                                <option value="mountains">Mountains</option>
                                <option value="city">City</option>
                                <option value="countryside">Countryside</option>
                            </select>
                        </label>

                        <label>
                            Gender:
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleSuggestionChange}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </label>

                        <label>
                            Size:
                            <select name="size" value={formData.size} onChange={handleSuggestionChange}>
                                <option value="">Select</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="plus">Plus-size</option>
                            </select>
                        </label>

                        <label>
                            Style Type:
                            <select
                                name="styleType"
                                value={formData.styleType}
                                onChange={handleSuggestionChange}
                            >
                                <option value="">Select</option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                            </select>
                        </label>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Fetching Suggestions...' : 'Get Suggestions'}
                        </button>
                    </form>

                    {error && <div className="error-message">{error}</div>}

                    {suggestions.length > 0 && (
                        <div className="suggestions-container">
                            <h2>Suggestions:</h2>
                            <ul>
                                {suggestions.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div>
                    <button className="contact-button" onClick={handleContactUs}>
                        Contact Us
                    </button>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default App;
