import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../../redux/Thunks/loginThunk";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    AppBar,
    Toolbar,
    Tabs,
    Tab,
    InputAdornment,
    Snackbar,
    Alert,
    Fade,
    Grow,
    Divider,
    Chip
} from "@mui/material";
import {
    Person,
    Lock,
    DirectionsCar,
    LocationOn,
    Phone,
    Email,
    CheckCircle,
    Security,
    AccessTime,
    Notifications
} from "@mui/icons-material";
import { insertLicensePlate, insertPassword, insertUserName } from "../../redux/slices/driverSlice";
import './login.css';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [lisencePlate, setLisencePlate] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("יש למלא את כל השדות");
    const [isLoading, setIsLoading] = useState(false);
    const [managerPassword, setManagerPassword] = useState("");
    const [confirmManagerPassword, setConfirmManagerPassword] = useState("");
    const [managerPasswordError, setManagerPasswordError] = useState(false);
    const [managerPasswordErrorMessage, setManagerPasswordErrorMessage] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

    const exists = useSelector(state => state.driver.code);
    const isNew = useSelector(state => state.driver.isNew);

    useEffect(() => {
        if (isNew) {
            navigate(`/logon`);
            dispatch(insertUserName(name));
            dispatch(insertPassword(password));
            dispatch(insertLicensePlate(lisencePlate));
        }
    }, [isNew]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleLogin = () => {
        if (!name || !password || !lisencePlate) {
            setErrorMessage("יש למלא את כל השדות");
            setShowError(true);
            return;
        }

        setIsLoading(true);

        // Simulate loading for better UX
        setTimeout(() => {
            dispatch(loginThunk({ name, password, lisencePlate }));
            setIsLoading(false);
        }, 800);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const validateManagerPassword = (password) => {
        if (!password) {
            setManagerPasswordError(true);
            setManagerPasswordErrorMessage("יש להזין סיסמת מנהל");
            return false;
        }
        
        if (password.length < 8) {
            setManagerPasswordError(true);
            setManagerPasswordErrorMessage("סיסמת מנהל חייבת להכיל לפחות 8 תווים");
            return false;
        }
        
        setManagerPasswordError(false);
        setManagerPasswordErrorMessage("");
        
        // אם יש כבר אימות סיסמה, בדוק התאמה
        if (confirmManagerPassword) {
            validateConfirmPassword(password, confirmManagerPassword);
        }
        
        return true;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage("יש להזין אימות סיסמה");
            return false;
        }
        
        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage("סיסמאות המנהל אינן תואמות");
            return false;
        }
        
        setConfirmPasswordError(false);
        setConfirmPasswordErrorMessage("");
        return true;
    };

    const handleManagerPasswordChange = (e) => {
        const newPassword = e.target.value;
        setManagerPassword(newPassword);
        validateManagerPassword(newPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmManagerPassword(newConfirmPassword);
        validateConfirmPassword(managerPassword, newConfirmPassword);
    };

    const validateManagerPasswords = () => {
        const isPasswordValid = validateManagerPassword(managerPassword);
        const isConfirmValid = validateConfirmPassword(managerPassword, confirmManagerPassword);
        
        if (isPasswordValid && isConfirmValid) {
            // כאן אפשר להוסיף לוגיקה של כניסת מנהל
            alert("פרטי מנהל תקינים!");
            return true;
        }
        
        return false;
    };

    // Redirect if user exists
    if (exists) {
        navigate(`/login/confirm`);
    }

    return (
        <div className="premium-login-container">
            {/* Header */}
            <AppBar position="sticky" className="premium-app-bar">
                <Toolbar>

                    <Box className="premium-logo-container">
                        <div className="premium-logo">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="url(#paint0_linear)" />
                                <path d="M18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12ZM8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12Z" fill="white" />
                                <path d="M13 10H11C10.45 10 10 10.45 10 11V14C10 14.55 10.45 15 11 15H11.5V13H13C13.55 13 14 12.55 14 12V11C14 10.45 13.55 10 13 10ZM13 12H11.5V11H13V12Z" fill="white" />

                            </svg>
                        </div>
                        <Typography variant="h6" component="div" className="premium-logo-text">
                            SmartPark - חוסכים זמן בכל חניה
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip
                        label="גרסה 2.0"
                        size="small"
                        color="primary"
                        className="version-chip"
                    />
                </Toolbar>
            </AppBar>

            {/* Background Elements */}
            <div className="premium-background">
                <div className="premium-shape shape-1" style={{ animation: 'none' }}></div>
                <div className="premium-shape shape-2" style={{ animation: 'none' }}></div>
                <div className="premium-shape shape-3" style={{ animation: 'none' }}></div>
                <div className="premium-shape shape-4" style={{ animation: 'none' }}></div>
                <div className="premium-shape shape-5" style={{ animation: 'none' }}></div>
            </div>

            {/* Main Content */}
            <Container maxWidth="lg" className="premium-content-container">
                <Grow in={true} timeout={800}>
                    <Card className="premium-card">
                        <CardContent className="premium-card-content">
                            <Grid container>
                                {/* Left Side - Image and Info */}
                                <Grid item xs={12} md={5} className="premium-left-panel">
                                    <div className="premium-info-panel">
                                        <div className="premium-brand">

                                            <Typography variant="h5" className="premium-brand-name">
                                                Smart Parking
                                                <div className="premium-logo">
                                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="24" height="24" rx="12" fill="url(#paint0_linear)" />
                                                        <path d="M18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12ZM8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12Z" fill="white" />
                                                        <path d="M13 10H11C10.45 10 10 10.45 10 11V14C10 14.55 10.45 15 11 15H11.5V13H13C13.55 13 14 12.55 14 12V11C14 10.45 13.55 10 13 10ZM13 12H11.5V11H13V12Z" fill="white" />

                                                        <defs>
                                                            <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                                                <stop stopColor="#0EA5E9" />
                                                                <stop offset="1" stopColor="#0369A1" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                </div>

                                            </Typography>
                                        </div>

                                        <Typography variant="h3" className="premium-welcome-text">
                                            ברוכים הבאים
                                        </Typography>

                                        <Typography variant="body1" className="premium-slogan">
                                            מצא חניה בקלות. חסוך זמן. חנה בבטחה.
                                        </Typography>

                                        <div className="premium-features">
                                            <div className="premium-feature">
                                                <CheckCircle className="premium-feature-icon" />
                                                <Typography variant="body2">חניה מובטחת</Typography>
                                            </div>
                                            <div className="premium-feature">
                                                <Security className="premium-feature-icon" />
                                                <Typography variant="body2">תשלום מאובטח</Typography>
                                            </div>
                                            <div className="premium-feature">
                                                <AccessTime className="premium-feature-icon" />
                                                <Typography variant="body2">חיסכון בזמן</Typography>
                                            </div>
                                            <div className="premium-feature">
                                                <Notifications className="premium-feature-icon" />
                                                <Typography variant="body2">התראות בזמן אמת</Typography>
                                            </div>
                                        </div>

                                        <Box className="premium-contact-info">
                                            <Box className="premium-contact-item">
                                                <LocationOn className="premium-contact-icon" />
                                                <Typography variant="body2">רחוב הרצל 123, תל אביב</Typography>
                                            </Box>
                                            <Box className="premium-contact-item">
                                                <Phone className="premium-contact-icon" />
                                                <Typography variant="body2">03-1234567</Typography>
                                            </Box>
                                            <Box className="premium-contact-item">
                                                <Email className="premium-contact-icon" />
                                                <Typography variant="body2">info@smartparking.co.il</Typography>
                                            </Box>
                                        </Box>
                                    </div>
                                </Grid>

                                {/* Right Side - Login Form */}
                                <Grid item xs={12} md={7} className="premium-right-panel">
                                    <Tabs
                                        value={activeTab}
                                        onChange={handleTabChange}
                                        className="premium-tabs"
                                        variant="fullWidth"
                                        TabIndicatorProps={{ className: "premium-tab-indicator" }}
                                    >
                                        <Tab label="התחברות" className="premium-tab" />
                                        <Tab label="מידע" className="premium-tab" />
                                        <Tab label="כניסת מנהל" className="premium-tab" />
                                    </Tabs>

                                    {activeTab === 0 && (
                                        <Fade in={activeTab === 0} timeout={500}>
                                            <Box className="premium-login-form">
                                                <Typography variant="h4" className="premium-form-title">
                                                    התחברות למערכת
                                                </Typography>

                                                <Typography variant="body2" className="premium-form-subtitle">
                                                    הזן את פרטי ההתחברות שלך כדי להיכנס למערכת
                                                </Typography>

                                                <TextField
                                                    fullWidth
                                                    label="שם משתמש"
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    InputProps={{


                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Person className="input-icon" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="סיסמה"
                                                    variant="outlined"
                                                    type="text"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    InputProps={{


                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock className="input-icon" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="לוחית רישוי"
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={lisencePlate}
                                                    onChange={(e) => setLisencePlate(e.target.value)}
                                                    InputProps={{


                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <DirectionsCar className="input-icon" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    className="premium-login-button"
                                                    onClick={handleLogin}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "מתחבר..." : "כניסה למערכת"}
                                                </Button>

                                                <Divider className="premium-divider">
                                                    <Chip label="או" className="premium-divider-chip" />
                                                </Divider>

                                                <Box className="premium-form-footer">
                                                    <Typography variant="body2" className="premium-register-text">
                                                        עדיין אין לך חשבון?
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        className="premium-register-button"
                                                        onClick={() => navigate(`/logon`)}
                                                        fullWidth
                                                    >
                                                        הרשמה למערכת
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    )}

                                    {activeTab === 1 && (
                                        <Fade in={activeTab === 1} timeout={500}>
                                            <Box className="premium-info-tab" >
                                                <Typography variant="h4" classNae="premium-info-title" style={{ marginBottom: '10px', fontSize: '1.8rem' }}>
                                                    אודות המערכת
                                                </Typography>

                                                <Typography variant="body1" paragraph className="premium-info-paragraph" style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
                                                    מערכת החניה החכמה שלנו מציעה פתרון מתקדם לבעיית החניה בערים הגדולות.
                                                    באמצעות טכנולוגיה חדשנית, אנו מאפשרים לכם למצוא, להזמין ולשלם עבור חניה בקלות ובמהירות.
                                                </Typography>

                                                <div className="premium-info-cards" style={{ gap: '10px', marginBottom: '10px' }}>
                                                    <Card className="premium-info-card" style={{ padding: '8px' }}>
                                                        <CardContent style={{ padding: '8px' }}>
                                                            <DirectionsCar className="premium-info-card-icon" style={{ fontSize: '1.8rem' }} />
                                                            <Typography variant="h6" style={{ fontSize: '1rem', marginTop: '5px', marginBottom: '5px' }}>מציאת חניה</Typography>
                                                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                                                איתור מקומות חניה פנויים בזמן אמת בכל רחבי העיר
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="premium-info-card" style={{ padding: '8px' }}>
                                                        <CardContent style={{ padding: '8px' }}>
                                                            <AccessTime className="premium-info-card-icon" style={{ fontSize: '1.8rem' }} />
                                                            <Typography variant="h6" style={{ fontSize: '1rem', marginTop: '5px', marginBottom: '5px' }}>חיסכון בזמן</Typography>
                                                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                                                הזמנת חניה מראש וניווט ישיר למקום החניה שלך
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="premium-info-card" style={{ padding: '8px' }}>
                                                        <CardContent style={{ padding: '8px' }}>
                                                            <Security className="premium-info-card-icon" style={{ fontSize: '1.8rem' }} />
                                                            <Typography variant="h6" style={{ fontSize: '1rem', marginTop: '5px', marginBottom: '5px' }}>תשלום מאובטח</Typography>
                                                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                                                תשלום דיגיטלי מאובטח ללא צורך במזומן או כרטיסי חניה
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </div>

                                                <Box className="premium-cta-section" style={{ marginTop: '30px' }}>
                                                    <Typography variant="h6" className="premium-cta-title" style={{ fontSize: '1rem', marginBottom: '5px' }}>
                                                        הצטרפו אלינו היום!
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        className="premium-cta-button"
                                                        onClick={() => {
                                                            setActiveTab(0);
                                                            setTimeout(() => navigate('/logon'), 300);
                                                        }}

                                                    >
                                                        הרשמה עכשיו
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    )}

                                    {activeTab === 2 && (
                                        <Fade in={activeTab === 2} timeout={500}>
                                            <Box className="premium-login-form">
                                                <Typography variant="h4" className="premium-form-title">
                                                    כניסת מנהל
                                                </Typography>

                                                <Typography variant="body2" className="premium-form-subtitle">
                                                    הזן את פרטי ההתחברות שלך כמנהל מערכת
                                                </Typography>

                                                

                                                <TextField
                                                    fullWidth
                                                    label="סיסמת מנהל"
                                                    variant="outlined"
                                                    type="password"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={managerPassword}
                                                    onChange={handleManagerPasswordChange}
                                                    error={managerPasswordError}
                                                    helperText={managerPasswordError ? managerPasswordErrorMessage : ""}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock className="input-icon" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
            
                                                <TextField
                                                    fullWidth
                                                    label="אימות סיסמת מנהל"
                                                    variant="outlined"
                                                    type="password"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={confirmManagerPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    error={confirmPasswordError}
                                                    helperText={confirmPasswordError ? confirmPasswordErrorMessage : ""}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock className="input-icon" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    className="premium-login-button"
                                                    style={{ marginTop: '20px' }}
                                                    onClick={validateManagerPasswords}
                                                >
                                                    כניסה כמנהל
                                                </Button>
            
                                                {managerPasswordError && (
                                                    <Typography 
                                                        variant="body2" 
                                                        color="error" 
                                                        style={{ marginTop: '10px', textAlign: 'center' }}
                                                    >
                                                        {managerPasswordErrorMessage}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Fade>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grow>
            </Container>

            {/* Error Snackbar */}
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    variant="filled"
                    className="premium-alert"
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};



