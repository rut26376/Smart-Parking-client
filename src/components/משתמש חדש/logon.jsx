import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addDriverThunk } from "../../redux/Thunks/addDriverThunk";
import * as React from 'react';
import './logon.css'; // שינוי: קישור לקובץ CSS החדש
import { Box, Button, CircularProgress, TextField, Typography, Container, Card, CardContent, Grid, Stepper, Step, StepLabel , Alert , Snackbar } from "@mui/material";
import { Person, Phone, DirectionsCar, Lock, Email  } from "@mui/icons-material";
import { insertLicensePlate, insertPassword, insertUserName, setIsNew } from "../../redux/slices/driverSlice";
import { useNavigate } from "react-router-dom";

export const Logon = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const newCode = useSelector(state => state.driver.code)
    const stateUserName = useSelector(state => state.driver.userName)
    const statePassword = useSelector(state => state.driver.password)
    const stateLicensePlate = useSelector(state => state.driver.licensePlate)
    const [driver, setDriver] = useState({ name: "", phoneNumber: "", userName: stateUserName, password: statePassword, code: "0" })
    const [loading, setLoading] = React.useState(false);
    const [licenseP, setLicenseP] = useState(stateLicensePlate)
    const [activeStep, setActiveStep] = useState(0);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // הגדרת שלבי ההרשמה
    const steps = ['פרטים אישיים', 'פרטי רכב', 'אישור'];

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => {
            clearTimeout(timeout);
        }
    }, [newCode]);
    
    const checkDetails = () => {
        setLoading(true);
        let flag = true;
        console.log(driver, licenseP);
        
        if (driver.name.length <= 1 || driver.name.length > 15) {
            flag = false;
            setErrorMessage("שם הנהג חייב להיות בין 2 ל-15 תווים");
            setShowError(true);
        }
        else if (driver.phoneNumber.length < 9 || driver.phoneNumber.length > 10) {
            flag = false;
            setErrorMessage("מספר הטלפון אינו תקין");
            setShowError(true);
        }
        else if (driver.userName.length > 20 && driver.userName.length !== 0) {
            flag = false;
            setErrorMessage("שם המשתמש חייב להיות עד 20 תווים");
            setShowError(true);
        }
        else if (driver.password.length > 10 && driver.password.length !== 0) {
            flag = false;
            setErrorMessage("הסיסמה חייבת להיות עד 10 תווים");
            setShowError(true);
        }
        else if (licenseP.length < 7 || licenseP.length > 9) {
            flag = false;
            setErrorMessage("מספר לוחית הרישוי אינו תקין");
            setShowError(true);
        }
        
        if (flag) {
            dispatch(addDriverThunk({driver, licensePlate:licenseP}))
            dispatch(insertUserName(driver.userName))
            dispatch(insertLicensePlate(licenseP))
            dispatch(insertPassword(driver.password))
        } else {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            // אם זה השלב האחרון, בצע רישום
            checkDetails();
        } else {
            // אחרת, עבור לשלב הבא
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    return (
        <div className="premium-registration-container">
            {/* רקע עם צורות */}
            <div className="premium-background">
                <div className="premium-shape shape-1"></div>
                <div className="premium-shape shape-2"></div>
                <div className="premium-shape shape-3"></div>
                <div className="premium-shape shape-4"></div>
                <div className="premium-shape shape-5"></div>
            </div>

            {/* תוכן ראשי */}
            <Container maxWidth="lg" className="premium-content-container">
                <Card className="premium-card">
                    <CardContent className="premium-card-content">
                        <Grid container>
                            {/* צד שמאל - מידע */}
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
                                                    <path d="M10 8L9 9H15L14 8H10Z" fill="white" />
                                                    <path d="M10 16L9 15H15L14 16H10Z" fill="white" />
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
                                        הרשמה למערכת
                                    </Typography>

                                    <Typography variant="body1" className="premium-slogan">
                                        הצטרף למערכת החניה החכמה שלנו וחסוך זמן וכסף בכל חניה
                                    </Typography>

                                    <div className="premium-features">
                                        <div className="premium-feature">
                                            <DirectionsCar className="premium-feature-icon" />
                                            <Typography variant="body2">חניה מהירה</Typography>
                                        </div>
                                        <div className="premium-feature">
                                            <Person className="premium-feature-icon" />
                                            <Typography variant="body2">חשבון אישי</Typography>
                                        </div>
                                        <div className="premium-feature">
                                            <Phone className="premium-feature-icon" />
                                            <Typography variant="body2">התראות SMS</Typography>
                                        </div>
                                        <div className="premium-feature">
                                            <Email className="premium-feature-icon" />
                                            <Typography variant="body2">דוחות חודשיים</Typography>
                                        </div>
                                    </div>

                                    <Box className="premium-contact-info">
                                        <Typography variant="subtitle2" gutterBottom>
                                            צריך עזרה? צור קשר:
                                        </Typography>
                                        <Box className="premium-contact-item">
                                            <Phone className="premium-contact-icon" />
                                            <Typography variant="body2">03-1234567</Typography>
                                        </Box>
                                        <Box className="premium-contact-item">
                                            <Email className="premium-contact-icon" />
                                            <Typography variant="body2">support@smartparking.co.il</Typography>
                                        </Box>
                                    </Box>
                                </div>
                            </Grid>

                            {/* צד ימין - טופס הרשמה */}
                            <Grid item xs={12} md={7} className="premium-right-panel">
                                <Box className="premium-login-form">
                                    <Typography variant="h4" className="premium-form-title">
                                        יצירת חשבון חדש
                                    </Typography>

                                    <Typography variant="body2" className="premium-form-subtitle">
                                        מלא את הפרטים הבאים כדי להירשם למערכת
                                    </Typography>

                                    <Stepper activeStep={activeStep} alternativeLabel className="premium-stepper">
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <Box className="premium-step-content">
                                        {activeStep === 0 && (
                                            <Box>
                                                <Typography variant="h6" className="premium-step-title">
                                                    פרטים אישיים
                                                </Typography>

                                                <TextField
                                                    fullWidth
                                                    label="שם נהג"
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={driver.name}
                                                    onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Person className="input-icon" style={{ marginLeft: '8px' }} />
                                                        ),
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="טלפון"
                                                    variant="outlined"
                                                    type="tel"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    value={driver.phoneNumber}
                                                    onChange={(e) => setDriver({ ...driver, phoneNumber: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Phone className="input-icon" style={{ marginLeft: '8px' }} />
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {activeStep === 1 && (
                                            <Box>
                                                <Typography variant="h6" className="premium-step-title">
                                                    פרטי משתמש ורכב
                                                </Typography>

                                                <TextField
                                                    fullWidth
                                                    label="שם משתמש"
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    defaultValue={stateUserName}
                                                    onChange={(e) => setDriver({ ...driver, userName: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Person className="input-icon" style={{ marginLeft: '8px' }} />
                                                        ),
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="סיסמת משתמש"
                                                    variant="outlined"
                                                    type="password"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    defaultValue={statePassword}
                                                    onChange={(e) => setDriver({ ...driver, password: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <Lock className="input-icon" style={{ marginLeft: '8px' }} />
                                                        ),
                                                    }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="מספר רישוי"
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    className="premium-input"
                                                    defaultValue={stateLicensePlate}
                                                    onChange={(e) => setLicenseP(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <DirectionsCar className="input-icon" style={{ marginLeft: '8px' }} />
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {activeStep === 2 && (
                                            <Box>
                                                <Typography variant="h6" className="premium-step-title">
                                                    אישור פרטים
                                                </Typography>

                                                <Card className="premium-summary-card">
                                                    <CardContent>
                                                        <Typography variant="subtitle1" className="premium-summary-title">
                                                            סיכום פרטים
                                                        </Typography>

                                                        <Grid container spacing={2} className="premium-summary-grid">
                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-label">
                                                                    שם נהג:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-value">
                                                                    {driver.name}
                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-label">
                                                                    טלפון:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-value">
                                                                    {driver.phoneNumber}
                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-label">
                                                                    שם משתמש:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-value">
                                                                    {driver.userName}
                                                                    </Typography>
                                                            </Grid>

                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-label">
                                                                    מספר רישוי:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="body2" className="premium-summary-value">
                                                                    {licenseP}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>

                                                <Typography variant="body2" className="premium-info-text">
                                                    לחץ על "סיום" כדי להשלים את תהליך ההרשמה. קוד אימות יישלח לטלפון שלך.
                                                </Typography>
                                            </Box>
                                        )}

                                        {newCode && (
                                            <Box className="premium-info-box">
                                                <Typography variant="subtitle1" gutterBottom>
                                                    קוד האימות שלך הוא:
                                                </Typography>
                                                <Typography variant="h5" align="center" style={{ fontWeight: 'bold', margin: '16px 0' }}>
                                                    {newCode}
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    fullWidth
                                                    className="premium-next-button"
                                                    onClick={() => navigate(`/parking`)}
                                                >
                                                    לאישור והמשך
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>

                                    {!newCode && (
                                        <Box className="premium-stepper-buttons">
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                className="premium-back-button"
                                                variant="outlined"
                                            >
                                                חזרה
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className="premium-next-button"
                                                disabled={loading}
                                                endIcon={loading ? <CircularProgress size={20} /> : null}
                                            >
                                                {activeStep === steps.length - 1 ? 'סיום' : 'המשך'}
                                            </Button>
                                        </Box>
                                    )}

                                    {activeStep === 0 && !newCode && (
                                        <>
                                            <Box className="premium-divider">
                                                <Typography variant="body2" color="textSecondary" align="center">
                                                    כבר יש לך חשבון?
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                className="premium-register-button"
                                                onClick={() => {  
                                                    dispatch(setIsNew(false)) 
                                                    ; navigate('/login')}}
                                            >
                                                התחברות למערכת
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>

            {/* הודעת שגיאה */}
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


