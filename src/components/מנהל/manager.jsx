  import React, { useState, useEffect, useMemo, useCallback } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    IconButton,
    Tooltip,
    Grow,
    AppBar,
    Toolbar,
    Chip,
    Tabs,
    Tab
  } from '@mui/material';
  import {
    LocalParking as ParkingIcon,
    Payment as PaymentIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Assessment as AssessmentIcon,
    DirectionsCar as DirectionsCarIcon,
    Build as BuildIcon,
    ExitToApp as ExitToAppIcon,
    ArrowBack,
    BarChart as BarChartIcon,
    Info as InfoIcon,
    Build
  } from '@mui/icons-material';
  import './manager.css';
  import StyledBackButton from '../חזרה/StyledBackButton';
  import { getAllParkingThunk } from '../../redux/Thunks/getParkingsThunk';
  import { getAllPaymentsThunk } from '../../redux/Thunks/getAllPaymentsThunk';
  import UsersReports from './usersReports';
import { getAllDriversThunk } from '../../redux/Thunks/getAllDriversThunk';

  export const Manager = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state selectors
    const parkings = useSelector(state => state.parking?.carParkings || []);
    const drivers = useSelector(state => state.driver?.allDrivers || []);
    const payments = useSelector(state => state.payment?.allPayments || []);
    const creditCards = useSelector(state => state.creditCards?.creditCards || []);
    const routines = useSelector(state => state.routine?.routines || []);

    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // חישוב נתונים אמיתיים עם useMemo כדי למנוע חישובים מיותרים
    const realTimeStats = useMemo(() => {
      if (parkings.length === 0) {
        return {
          totalSpots: 0,
          occupiedSpots: 0,
          availableSpots: 0,
          occupancyRate: 0,
          dailyRevenue: 0,
          totalPayments: 0,
          activeUsers: 0,
          newReports: 5
        };
      }

      const totalSpots = parkings.length;
      const occupiedSpots = parkings.filter(p => p.used).length;
      const availableSpots = totalSpots - occupiedSpots;
      const occupancyRate = totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;
    
      // חישוב הכנסה יומית (מתשלומים של היום)
      const today = new Date().toDateString();
      const todayPayments = payments.filter(payment => {
        if (!payment.date) return false;
        const paymentDate = new Date(payment.date).toDateString();
        return paymentDate === today;
      });
    
      // חישוב הכנסה יומית - הסרת toFixed
      const dailyRevenue = Math.round(todayPayments.reduce((sum, payment) => {
        const paymentSum = parseFloat(payment.sum) || 0;
        return sum + paymentSum;
      }, 0));
    
      // ספירת משתמשים פעילים (נהגים עם רכבים בחניון)
      const activeUsers = drivers.filter(driver => 
        parkings.some(parking => parking.driverCode === driver.code && parking.used)
      ).length;
    
      // ספירת תשלומים של היום
      const totalPaymentsToday = todayPayments.length;
    
      // דוחות חדשים (ערך קבוע זמני)
      const newReports = Math.max(5, Math.floor(totalPaymentsToday / 2));

      return {
        totalSpots,
        occupiedSpots,
        availableSpots,
        occupancyRate,
        dailyRevenue,
        totalPayments: totalPaymentsToday,
        activeUsers,
        newReports
      };
    }, [parkings, payments, drivers]);

    // חישוב נתונים מתקדמים לתשלומים
    const analyticsData = useMemo(() => {
      if (!payments || payments.length === 0) {
        return {
          completedGroups: 0,
          partialGroups: 0,
          failedGroups: 0,
          pendingGroups: 0,
          singlePayments: 0,
          totalRevenue: 0,
          potentialRevenue: 0,
          lostRevenue: 0,
          collectionRate: 0,
          totalGroups: 0
        };
      }

      let completedGroups = 0;
      let partialGroups = 0;
      let failedGroups = 0;
      let pendingGroups = 0;
      let singlePayments = 0;
      let totalRevenue = 0;
      let potentialRevenue = 0;
      let lostRevenue = 0;

      payments.forEach(paymentGroup => {
        // אם אין פרטי תשלום - זה תשלום יחיד שהושלם
        if (!paymentGroup.paymentsDetails || paymentGroup.paymentsDetails.length === 0) {
          singlePayments++;
          completedGroups++;
          const amount = parseFloat(paymentGroup.sum) || 0;
          totalRevenue += amount;
          potentialRevenue += amount;
          return;
        }

        // עיבוד קבוצת תשלומים
        const details = paymentGroup.paymentsDetails;
        const totalPayments = details.length;
        const paidPayments = details.filter(p => p.paid === true).length;
        const unpaidPayments = details.filter(p => p.paid === false).length;
        const pendingPaymentsCount = details.filter(p => p.paid === null || p.paid === undefined).length;

        // חישוב סכומים
        const groupTotalRevenue = details
          .filter(p => p.paid === true)
          .reduce((sum, p) => sum + (parseFloat(p.sum) || 0), 0);
      
        const groupPotentialRevenue = details
          .reduce((sum, p) => sum + (parseFloat(p.sum) || 0), 0);
      
        const groupLostRevenue = details
          .filter(p => p.paid === false)
          .reduce((sum, p) => sum + (parseFloat(p.sum) || 0), 0);

        totalRevenue += groupTotalRevenue;
        potentialRevenue += groupPotentialRevenue;
        lostRevenue += groupLostRevenue;

        // קביעת סטטוס הקבוצה
        if (paidPayments === totalPayments) {
          completedGroups++;
        } else if (unpaidPayments === totalPayments) {
          failedGroups++;
        } else if (pendingPaymentsCount === totalPayments) {
          pendingGroups++;
        } else if (paidPayments > 0) {
          partialGroups++;
        }
      });

      const collectionRate = potentialRevenue > 0 ? Math.round((totalRevenue / potentialRevenue) * 100) : 0;

      return {
        completedGroups,
        partialGroups,
        failedGroups,
        pendingGroups,
        singlePayments,
        totalRevenue: Math.round(totalRevenue),
        potentialRevenue: Math.round(potentialRevenue),
        lostRevenue: Math.round(lostRevenue),
        collectionRate,
        totalGroups: payments.length
      };
    }, [payments]);

    // טעינת נתונים בעת טעינת הקומפוננטה - רק פעם אחת
    useEffect(() => {
      const fetchAllData = async () => {
        console.log("Fetching all data...");
        
        // קריאה 1 - Parking
        try {
          await dispatch(getAllParkingThunk("P1"));
          console.log("Parking data fetched successfully");
        } catch (error) {
          console.error("Error fetching parking data:", error);
        }
    
        // קריאה 2 - Drivers  
        try {
          await dispatch(getAllDriversThunk());
          console.log("Drivers data fetched successfully");
        } catch (error) {
          console.error("Error fetching drivers data:", error);
        }
    
        // קריאה 3 - Payments
        try {
          await dispatch(getAllPaymentsThunk());
          console.log("Payments data fetched successfully");
        } catch (error) {
          console.error("Error fetching payments data:", error);
        }
    
        console.log("All fetch attempts completed");
      };
    
      fetchAllData();
    }, [dispatch]);
    
    
    
    // קביעת ברכה בהתאם לשעה ביום - רק פעם אחת
    useEffect(() => {
      const updateGreeting = () => {
        const hours = new Date().getHours();
        let newGreeting = '';
      
        if (hours >= 5 && hours < 12) {
          newGreeting = 'בוקר טוב';
        } else if (hours >= 12 && hours < 18) {
          newGreeting = 'צהריים טובים';
        } else if (hours >= 18 && hours < 22) {
          newGreeting = 'ערב טוב';
        } else {
          newGreeting = 'לילה טוב';
        }
      
        setGreeting(newGreeting);
      };

      // עדכון ראשוני
      updateGreeting();
    
      // עדכון השעה כל דקה
      const timer = setInterval(() => {
        setCurrentTime(new Date());
        updateGreeting();
      }, 60000);
    
      return () => clearInterval(timer);
    }, []);

    // פונקציה לניווט לעמודים השונים
    const navigateTo = useCallback((path) => {
      navigate(path);
    }, [navigate]);

    // רשימת הכרטיסיות הראשיות עם נתונים אמיתיים - useMemo למניעת יצירה מחדש
    const mainCards = useMemo(() => [
      {
        title: 'מצב החניון בזמן אמת',
        description: 'צפייה במפת החניון, תפוסה ומקומות פנויים',
        icon: <ParkingIcon fontSize="large" />,
        path: '/parking',
        color: '#0EA5E9',
        stats: `${realTimeStats.occupancyRate}% תפוסה`
      },
      {
        title: 'ניהול משתמשים',
        description: 'צפייה וניהול לקוחות, מנויים והרשאות',
        icon: <PeopleIcon fontSize="large" />,
        path: '/manager/users',
        color: '#0EA5E9',
        stats: `${drivers.length} משתמשים רשומים`
      },
      {
        title: 'אנליטיקה ודוחות',
        description: 'נתונים סטטיסטיים, מגמות ודוחות מפורטים',
        icon: <AssessmentIcon fontSize="large" />,
        path: '/manager/statictic',
        color: '#0EA5E9',
        stats: `${realTimeStats.newReports} דוחות חדשים`
      },
      {
        title: 'דוחות תשלומים',
        description: 'צפייה בתשלומים, פרטי עסקאות ודוחות כספיים מפורטים',
        icon: <PaymentIcon fontSize="large" />,
        path: '/manager/payments',
        color: '#0EA5E9',
        stats: `${realTimeStats.totalPayments} תשלומים היום`
      }
    ], [realTimeStats, drivers.length]);
  
    // פורמט התאריך והשעה
    const dateTimeOptions = useMemo(() => ({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), []);

    const handleStyledBackButton = useCallback(() => {
      navigate('/');
    }, [navigate]);

    // חישוב התראות אמיתיות - useMemo למניעת חישוב מחדש
    const currentAlerts = useMemo(() => {
      const alerts = [];
      const currentTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    
      // התראה על תפוסה גבוהה
      if (realTimeStats.occupancyRate > 90) {
        alerts.push({
          id: 1,
          type: 'warning',
          message: `תפוסה גבוהה: ${realTimeStats.occupancyRate}% מהחניון תפוס`,
          time: currentTime,
          color: '#f59e0b',
          icon: <ParkingIcon />
        });
      }
    
      // התראה על מחסור במקומות
      if (realTimeStats.availableSpots < 10 && realTimeStats.totalSpots > 0) {
        alerts.push({
          id: 2,
          type: 'error',
          message: `נותרו רק ${realTimeStats.availableSpots} מקומות פנויים`,
          time: currentTime,
          color: '#ef4444',
          icon: <DirectionsCarIcon />
        });
      }
    
      // התראה על הכנסות גבוהות
      if (realTimeStats.dailyRevenue > 5000) {
        alerts.push({
          id: 3,
          type: 'info',
          message: `הכנסות מעולות היום: ₪${realTimeStats.dailyRevenue.toLocaleString()}`,
          time: currentTime,
          color: '#10b981',
          icon: <PaymentIcon />
        });
      }
    
      // התראה על תשלומים חלakis
      if (analyticsData.partialGroups > 0) {
        alerts.push({
          id: 4,
          type: 'warning',
          message: `${analyticsData.partialGroups} תשלומים חלakis דורשים מעקב`,
          time: currentTime,
          color: '#f59e0b',
          icon: <PaymentIcon />
        });
      }
    
      // אם אין התראות אמיתיות, הצג התראות ברירת מחדל
      if (alerts.length === 0) {
        alerts.push({
          id: 1,
          type: 'info',
          message: 'המערכת פועלת תקין - כל המערכות פעילות',
          time: currentTime,
          color: '#0EA5E9',
          icon: <InfoIcon />
        });
      }
    
      return alerts;
    }, [realTimeStats, analyticsData]);

    return (
      <div className="manager-dashboard">
        {/* Header */}
        <AppBar position="sticky" className="premium-app-bar">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleStyledBackButton}
              aria-label="back to home"
              className="back-button"
            >
              <ArrowBack />
            </IconButton>
            <Box className="premium-logo-container">
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
              <Typography variant="h6" component="div" className="premium-logo-text">
                SmartPark - ממשק ניהול
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="התראות" arrow>
              <IconButton color="inherit">
                <NotificationsIcon />
                {currentAlerts.length > 0 && (
                  <Chip
                    label={currentAlerts.length}
                    size="small"
                    color="error"
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      minWidth: '20px',
                      height: '20px'
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="הגדרות" arrow>
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="התנתק" arrow>
              <IconButton color="inherit">
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
            <Chip
              label="גרסה 2.0"
              size="small"
              color="primary"
              className="version-chip"
            />
          </Toolbar>
          <StyledBackButton />
        </AppBar>

        {/* Background Elements */}
        <div className="premium-background">
          <div className="premium-shape shape-1"></div>
          <div className="premium-shape shape-2"></div>
          <div className="premium-shape shape-3"></div>
          <div className="premium-shape shape-4"></div>
          <div className="premium-shape shape-5"></div>
        </div>

        {/* Main Content */}
        <Container maxWidth="lg" className="premium-content-container">
          <Grow in={true} timeout={800}>
            <Card className="premium-card">
              <CardContent className="premium-card-content">
                {/* Welcome Section */}
                <Box className="welcome-section">
                  <Typography variant="h4" component="h1" className="welcome-title">
                    {greeting}, מנהל
                  </Typography>
                  <Typography variant="body1" color="text.secondary" className="welcome-date">
                    {currentTime.toLocaleString('he-IL', dateTimeOptions)}
                  </Typography>
                </Box>

                {/* Quick Stats - עם נתונים אמיתיים ללא toFixed */}
                <Grid container spacing={3} className="quick-stats-grid">
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} className="stat-paper">
                      <Box className="stat-content">
                        <ParkingIcon className="stat-icon" />
                        <Box>
                          <Typography variant="body2" className="stat-label">
                            מקומות פנויים
                          </Typography>
                          <Typography variant="h5" className="stat-value">
                            {realTimeStats.availableSpots} / {realTimeStats.totalSpots}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} className="stat-paper">
                      <Box className="stat-content">
                        <PaymentIcon className="stat-icon" />
                        <Box>
                          <Typography variant="body2" className="stat-label">
                            הכנסה יומית
                          </Typography>
                          <Typography variant="h5" className="stat-value">
                            ₪{realTimeStats.dailyRevenue.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} className="stat-paper">
                      <Box className="stat-content">
                        <DirectionsCarIcon className="stat-icon" />
                        <Box>
                          <Typography variant="body2" className="stat-label">
                            רכבים בחניון
                          </Typography>
                          <Typography variant="h5" className="stat-value">
                            {realTimeStats.occupiedSpots}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} className="stat-paper">
                      <Box className="stat-content">
                        <BarChartIcon className="stat-icon" />
                        <Box>
                          <Typography variant="body2" className="stat-label">
                            תפוסה
                          </Typography>
                          <Typography variant="h5" className="stat-value">
                            {realTimeStats.occupancyRate}%
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Main Actions */}
                <Typography variant="h5" component="h2" className="section-title">
                  ניהול החניון
                </Typography>
                <Grid container spacing={3} className="main-actions-grid">
                  {mainCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        className="action-card"
                        elevation={2}
                        onClick={() => navigateTo(card.path)}
                      >
                        <CardContent className="action-card-content">
                          <div className="action-icon-container">
                            {card.icon}
                          </div>
                          <Typography variant="h6" className="action-title">
                            {card.title}
                          </Typography>
                          <Typography variant="body2" className="action-description">
                            {card.description}
                          </Typography>
                          <Typography variant="caption" className="action-stats">
                            {card.stats}
                          </Typography>
                        </CardContent>
                        <CardActions className="action-card-footer">
                          <Button
                            variant="contained"
                            color="primary"
                            className="action-button"
                            fullWidth
                          >
                            כניסה
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Recent Alerts - עם נתונים אמיתיים */}
                <Box className="alerts-section">
                  <Box className="alerts-header">
                    <Typography variant="h5" component="h2" className="section-title">
                      התראות אחרונות
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      className="view-all-button"
                      onClick={() => navigateTo('/manager/notifications')}
                    >
                      צפה בכל ההתראות
                    </Button>
                  </Box>
                  <Paper elevation={2} className="alerts-paper">
                    {currentAlerts.map((alert, index) => (
                      <React.Fragment key={alert.id}>
                        {index > 0 && <Divider />}
                        <Box className="alert-item">
                          <div className="alert-icon" style={{ backgroundColor: `${alert.color}20`, color: alert.color }}>
                            {alert.icon}
                          </div>
                          <Box className="alert-content">
                            <Typography variant="body1" className="alert-message">
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" className="alert-time">
                              היום, {alert.time}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            className="alert-action"
                            style={{
                              borderColor: alert.color,
                              color: alert.color
                            }}
                          >
                            טפל
                          </Button>
                        </Box>
                      </React.Fragment>
                    ))}
                  </Paper>
                </Box>

                {/* Real-time Statistics Section - ללא toFixed */}
                <Box className="analytics-preview">
                  <Box className="analytics-header">
                    <Typography variant="h5" component="h2" className="section-title">
                      סטטיסטיקות תשלומים בזמן אמת
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className="view-analytics-button"
                        onClick={() => navigateTo('/manager/payments')}
                        startIcon={<PaymentIcon />}
                    >
                        צפה בדוחות תשלומים
                    </Button>
                  </Box>
                  <Paper elevation={2} className="analytics-paper">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="primary">
                                    תשלומים שהושלמו
                                </Typography>
                                <Typography variant="h4">
                                    {analyticsData.completedGroups}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    כולל {analyticsData.singlePayments} תשלומים יחידים
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="warning.main">
                                    תשלומים חלakis
                                </Typography>
                                <Typography variant="h4">
                                    {analyticsData.partialGroups}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    דורש מעקב
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="error.main">
                                    תשלומים שנכשלו
                                </Typography>
                                <Typography variant="h4">
                                    {analyticsData.failedGroups}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    דורש טיפול מיידי
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="primary">
                                    אחוז גביה
                                </Typography>
                                <Typography variant="h4">
                                    {analyticsData.collectionRate}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    מכלל התשלומים
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    {/* הוסף שורה נוספת עם פירוט כספי - ללא toFixed */}
                    <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Grid item xs={12} md={4}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="success.main">
                                    הכנסות בפועל
                                </Typography>
                                <Typography variant="h4">
                                    ₪{analyticsData.totalRevenue.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    מתשלומים ששולמו
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="error.main">
                                    הפסדים
                                </Typography>
                                <Typography variant="h4">
                                    ₪{analyticsData.lostRevenue.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    מתשלומים שלא שולמו
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box className="stat-box">
                                <Typography variant="h6" color="info.main">
                                    פוטנציאל כולל
                                </Typography>
                                <Typography variant="h4">
                                    ₪{analyticsData.potentialRevenue.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    כל התשלומים
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                  </Paper>
                </Box>

                {/* Quick Actions Footer עם נתונים מעודכנים */}
                <Box className="quick-actions-footer">
                  <Button
                    variant="contained"
                    color="primary"
                    className="quick-action-button"
                    onClick={() => navigateTo('/parking')}
                    startIcon={<ParkingIcon />}
                  >
                    צפה במפת החניון ({realTimeStats.availableSpots} פנויים)
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    className="quick-action-button"
                    onClick={() => navigateTo('/manager/payments')}
                    startIcon={<PaymentIcon />}
                  >
                    דוחות תשלומים ({analyticsData.partialGroups + analyticsData.failedGroups} דורש טיפול)
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    className="quick-action-button"
                    onClick={() => navigateTo('/manager/settings')}
                    startIcon={<SettingsIcon />}
                  >
                    הגדרות מערכת
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    className="quick-action-button"
                    onClick={() => navigateTo('/manager/reports')}
                    startIcon={<AssessmentIcon />}
                  >
                    הפק דוחות ({realTimeStats.newReports} חדשים)
                  </Button>
                </Box>

                {/* System Status */}
                <Box className="system-status">
                  <Typography variant="h6" className="status-title">
                    סטטוס המערכת
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box className="status-item">
                        <div className="status-indicator success"></div>
                        <Typography variant="body2">חניון פעיל</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box className="status-item">
                        <div className={`status-indicator ${analyticsData.failedGroups > 0 ? 'warning' : 'success'}`}></div>
                        <Typography variant="body2">
                          תשלומים {analyticsData.failedGroups > 0 ? 'דורש טיפול' : 'תקינים'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box className="status-item">
                        <div className={`status-indicator ${realTimeStats.occupancyRate > 90 ? 'warning' : 'success'}`}></div>
                        <Typography variant="body2">תפוסה {realTimeStats.occupancyRate > 90 ? 'גבוהה' : 'תקינה'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box className="status-item">
                        <div className="status-indicator success"></div>
                        <Typography variant="body2">מערכת תקינה</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* סיכום כספי יומי - ללא toFixed */}
                <Box className="financial-summary" sx={{ mt: 3 }}>
                  <Typography variant="h6" className="status-title">
                    סיכום כספי כללי
                  </Typography>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Box className="financial-stat">
                          <Typography variant="body2" color="success.main">
                            הכנסות (ששולמו)
                          </Typography>
                          <Typography variant="h5" color="success.main">
                            ₪{analyticsData.totalRevenue.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            מתשלומים שהושלמו
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box className="financial-stat">
                          <Typography variant="body2" color="error.main">
                            חובות (לא שולמו)
                          </Typography>
                          <Typography variant="h5" color="error.main">
                            ₪{analyticsData.lostRevenue.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            מתשלומים שנכשלו
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box className="financial-stat">
                          <Typography variant="body2" color="warning.main">
                            תשלומים חלakis
                          </Typography>
                          <Typography variant="h5" color="warning.main">
                            {analyticsData.partialGroups}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            דורש מעקב
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box className="financial-stat">
                          <Typography variant="body2" color="primary.main">
                            סה"כ פוטנציאל
                          </Typography>
                          <Typography variant="h5" color="primary.main">
                            ₪{analyticsData.potentialRevenue.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            כל התשלומים
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* אחוז גביה כללי */}
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                      <Typography variant="h6" color="primary.main">
                        אחוז גביה כללי: {analyticsData.collectionRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        מתוך {analyticsData.totalGroups} קבוצות תשלום
                      </Typography>
                    </Box>
                  </Paper>
                </Box>

                {/* תובנות וסיכום */}
                <Box className="insights-section" sx={{ mt: 3 }}>
                  <Typography variant="h6" className="status-title">
                    תובנות ומלצות
                  </Typography>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {analyticsData.collectionRate < 80 && (
                        <Grid item xs={12}>
                          <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                            <Typography variant="body1" color="warning.dark">
                              ⚠️ אחוז הגביה נמוך ({analyticsData.collectionRate}%) - מומלץ לשפר תהליכי גביה
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      {analyticsData.partialGroups > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                            <Typography variant="body1" color="info.dark">
                              💡 יש {analyticsData.partialGroups} תשלומים חלakis - מומלץ ליצור קשר עם הלקוחות
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      {realTimeStats.occupancyRate > 90 && (
                        <Grid item xs={12}>
                          <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                            <Typography variant="body1" color="error.dark">
                              🚗 תפוסה גבוהה ({realTimeStats.occupancyRate}%) - שקול הגדלת מחירים בשעות עומס
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      {analyticsData.collectionRate >= 90 && analyticsData.totalGroups > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                            <Typography variant="body1" color="success.dark">
                              ✅ ביצועים מעולים! אחוז גביה גבוה של {analyticsData.collectionRate}%
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Container>
      </div>
    );
  };
