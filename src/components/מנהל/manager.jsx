import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  LocalParking as ParkingIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  DirectionsCar as DirectionsCarIcon,
  Security as SecurityIcon,
  Build as BuildIcon,
  EventNote as EventNoteIcon,
  ExitToApp as ExitToAppIcon,
  ArrowBack,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import './manager.css';

export const Manager = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // מידע לדוגמה - יוחלף בנתונים אמיתיים מהשרת
  const parkingStats = {
    totalSpots: 144,
    occupiedSpots: 98,
    availableSpots: 46,
    occupancyRate: 68,
    dailyRevenue: 3250
  };

  // קביעת ברכה בהתאם לשעה ביום
  useEffect(() => {
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
    
    // עדכון השעה כל דקה
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // פונקציה לניווט לעמודים השונים
  const navigateTo = (path) => {
    navigate(path);
  };

  // רשימת הכרטיסיות הראשיות
  const mainCards = [
    {
      title: 'מצב החניון בזמן אמת',
      description: 'צפייה במפת החניון, תפוסה ומקומות פנויים',
      icon: <ParkingIcon fontSize="large" />,
      path: '/manager/parking-status',
      color: '#0EA5E9',
      stats: `${parkingStats.occupancyRate}% תפוסה`
    },
    {
      title: 'ניתוח הכנסות',
      description: 'דוחות כספיים, הכנסות יומיות, שבועיות וחודשיות',
      icon: <PaymentIcon fontSize="large" />,
      path: '/manager/revenue',
      color: '#0EA5E9',
      stats: `${parkingStats.dailyRevenue} ₪ היום`
    },
    {
      title: 'ניהול משתמשים',
      description: 'צפייה וניהול לקוחות, מנויים והרשאות',
      icon: <PeopleIcon fontSize="large" />,
      path: '/manager/users',
      color: '#0EA5E9',
      stats: '245 משתמשים פעילים'
    },
    {
      title: 'אנליטיקה ודוחות',
      description: 'נתונים סטטיסטיים, מגמות ודוחות מפורטים',
      icon: <AssessmentIcon fontSize="large" />,
      path: '/manager/analytics',
      color: '#0EA5E9',
      stats: '12 דוחות חדשים'
    }
  ];

  // רשימת כרטיסיות משניות
  const secondaryCards = [
    {
      title: 'ניהול אירועים',
      icon: <EventNoteIcon />,
      path: '/manager/events',
    },
    {
      title: 'הגדרות מערכת',
      icon: <SettingsIcon />,
      path: '/manager/settings',
    },
    {
      title: 'אבטחה ובקרה',
      icon: <SecurityIcon />,
      path: '/manager/security',
    },
    {
      title: 'תחזוקה',
      icon: <BuildIcon />,
      path: '/manager/maintenance',
    },
    {
      title: 'ניהול רכבים',
      icon: <DirectionsCarIcon />,
      path: '/manager/vehicles',
    },
    {
      title: 'התראות',
      icon: <NotificationsIcon />,
      path: '/manager/notifications',
    }
  ];

  // פורמט התאריך והשעה
  const dateTimeOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="manager-dashboard">
      {/* Header */}
      <AppBar position="sticky" className="premium-app-bar">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBackToHome}
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

              {/* Quick Stats */}
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
                          {parkingStats.availableSpots} / {parkingStats.totalSpots}
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
                          ₪{parkingStats.dailyRevenue}
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
                          {parkingStats.occupiedSpots}
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
                          {parkingStats.occupancyRate}%
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
              

              {/* Recent Alerts */}
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
                  {([
                    { 
                      id: 1, 
                      type: 'error', 
                      message: 'תקלה במחסום כניסה ראשי', 
                      time: '10:23', 
                      color: '#ef4444',
                      icon: <BuildIcon />
                    },
                    { 
                      id: 2, 
                      type: 'warning', 
                      message: 'תפוסה מעל 90% בקומה P2', 
                      time: '09:45', 
                      color: '#f59e0b',
                      icon: <ParkingIcon />
                    },
                    { 
                      id: 3, 
                      type: 'info', 
                      message: 'עדכון תעריפי חניה בוצע בהצלחה', 
                      time: '08:30', 
                      color: '#0EA5E9',
                      icon: <PaymentIcon />
                    }
                  ]).map((alert, index) => (
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

              {/* Analytics Preview */}
              <Box className="analytics-preview">
                <Box className="analytics-header">
                  <Typography variant="h5" component="h2" className="section-title">
                    סקירה אנליטית
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className="view-analytics-button"
                    onClick={() => navigateTo('/manager/analytics')}
                    startIcon={<AssessmentIcon />}
                  >
                    צפה בכל הנתונים
                  </Button>
                </Box>
                <Paper elevation={2} className="analytics-paper">
                  <Box className="analytics-content">
                    <InfoIcon className="info-icon" />
                    <Typography variant="body1" className="analytics-message">
                      לצפייה בגרפים ונתונים סטטיסטיים מפורטים, לחץ על כפתור "צפה בכל הנתונים"
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Quick Actions Footer */}
              <Box className="quick-actions-footer">
                <Button 
                  variant="contained" 
                  color="primary" 
                  className="quick-action-button"
                  onClick={() => navigateTo('/manager/parking-status')}
                  startIcon={<ParkingIcon />}
                >
                  צפה במפת החניון
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
                  הפק דוחות
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grow>
      </Container>
    </div>
  );
};