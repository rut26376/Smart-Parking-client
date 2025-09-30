import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getAllDriversThunk } from '../../redux/Thunks/getAllDriversThunk';
import { useSelector } from 'react-redux';

const UsersReports = () => {
const drivers = useSelector(state => state.driver?.allDrivers || []);

  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'view', 'edit', 'delete'

  // סינון הנתונים - מותאם לשדות החדשים
  const driversWithStatus = drivers.map(driver => ({
    ...driver,
    isActive: true, // כברירת מחדל כל המשתמשים פעילים
    isBlocked: false,
    createdAt: new Date().toISOString() // תאריך נוכחי כברירת מחדל
  }));

  const filteredDrivers = driversWithStatus.filter(driver => {
    const matchesSearch = 
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phoneNumber?.includes(searchTerm);

    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && driver.isActive) ||
      (filterStatus === 'inactive' && !driver.isActive) ||
      (filterStatus === 'blocked' && driver.isBlocked);

    return matchesSearch && matchesStatus;
  });

  // פונקציות לטיפול בעמוד ושורות
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // פונקציות לטיפול בתפריט פעולות
  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // פונקציות לטיפול בדיאלוגים
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setDialogType('');
  };

  // פונקציה לעדכון סטטוס משתמש
  const updateUserStatus = async (userId, status) => {
   
  };

  // פונקציה למחיקת משתמש
  const deleteUser = async (userId) => {
   
  };

  // פונקציה לייצוא נתונים - מותאם לשדות החדשים
  const exportData = () => {
    const csvContent = [
      ['שם', 'שם משתמש', 'טלפון', 'סטטוס'],
      ...filteredDrivers.map(driver => [
        driver.name || '',
        driver.userName || '',
        driver.phoneNumber || '',
        driver.isActive ? 'פעיל' : 'לא פעיל',

      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users_report.csv';
    link.click();
  };

  // רכיב סטטיסטיקות
  const StatCard = ({ title, value, color, icon }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" style={{ color }}>
              {value}
            </Typography>
          </Box>
          <Avatar style={{ backgroundColor: color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // רכיב דיאלוג צפייה בפרטי משתמש - מותאם לשדות החדשים
  const UserDetailsDialog = () => (
    <Dialog open={openDialog && dialogType === 'view'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>פרטי משתמש</DialogTitle>
      <DialogContent>
        {selectedUser && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">שם מלא</Typography>
              <Typography variant="body1">{selectedUser.name || 'לא זמין'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">שם משתמש</Typography>
              <Typography variant="body1">{selectedUser.userName || 'לא זמין'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">טלפון</Typography>
              <Typography variant="body1">{selectedUser.phoneNumber || 'לא זמין'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">סטטוס</Typography>
              <Chip 
                label={selectedUser.isActive ? 'פעיל' : 'לא פעיל'} 
                color={selectedUser.isActive ? 'success' : 'default'}
              />
            </Grid>
          
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>סגור</Button>
      </DialogActions>
    </Dialog>
  );

  // רכיב דיאלוג מחיקה
  const DeleteDialog = () => (
    <Dialog open={openDialog && dialogType === 'delete'} onClose={handleCloseDialog}>
      <DialogTitle>מחיקת משתמש</DialogTitle>
      <DialogContent>
        <Typography>
          האם אתה בטוח שברצונך למחוק את המשתמש {selectedUser?.name}?
          פעולה זו אינה ניתנת לביטול.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>ביטול</Button>
        <Button 
          onClick={() => deleteUser(selectedUser?.id)} 
          color="error" 
          variant="contained"
        >
          מחק
        </Button>
      </DialogActions>
    </Dialog>
  );

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.isActive).length,
    inactive: drivers.filter(d => !d.isActive).length,
    blocked: drivers.filter(d => d.isBlocked).length
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        ניהול משתמשים
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="סה״כ משתמשים" 
            value={stats.total} 
            color="#2196F3" 
            icon={<CarIcon />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="משתמשים פעילים" 
            value={stats.active} 
            color="#4CAF50" 
            icon={<CheckCircleIcon />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="משתמשים לא פעילים" 
            value={stats.inactive} 
            color="#FF9800" 
            icon={<CalendarIcon />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="משתמשים חסומים" 
            value={stats.blocked} 
            color="#F44336" 
            icon={<BlockIcon />} 
          />
        </Grid>
      </Grid>

      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="חיפוש לפי שם, שם משתמש או טלפון"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>סינון לפי סטטוס</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="סינון לפי סטטוס"
              >
                <MenuItem value="all">כל המשתמשים</MenuItem>
                <MenuItem value="active">פעילים</MenuItem>
                <MenuItem value="inactive">לא פעילים</MenuItem>
                <MenuItem value="blocked">חסומים</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={exportData}
              >
                ייצא לCSV
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell>שם משתמש</TableCell>
              <TableCell>טלפון</TableCell>
              <TableCell>סטטוס</TableCell>
              
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrivers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((driver, index) => (
                <TableRow key={driver.id || index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {driver.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2">{driver.name || 'לא זמין'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                      <Typography variant="body2">{driver.userName || 'לא זמין'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                      <Typography variant="body2">{driver.phoneNumber || 'לא זמין'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        driver.isBlocked ? 'חסום' :
                        driver.isActive ? 'פעיל' : 'לא פעיל'
                      }
                      color={
                        driver.isBlocked ? 'error' :
                        driver.isActive ? 'success' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Tooltip title="פעולות">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, driver)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        
        {filteredDrivers.length === 0 && (
          <Box p={3} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              לא נמצאו משתמשים התואמים לחיפוש
            </Typography>
          </Box>
        )}
      </TableContainer>

      
      <TablePagination
        component="div"
        count={filteredDrivers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="שורות בעמוד:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} מתוך ${count !== -1 ? count : `יותר מ ${to}`}`
        }
      />

      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleOpenDialog('view')}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          צפה בפרטים
        </MenuItem>
        <MenuItem 
          onClick={() => updateUserStatus(selectedUser?.id, !selectedUser?.isActive)}
        >
          {selectedUser?.isActive ? (
            <>
              <BlockIcon sx={{ mr: 1 }} fontSize="small" />
              השבת משתמש
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />
              הפעל משתמש
            </>
          )}
        </MenuItem>
        <MenuItem 
          onClick={() => updateUserStatus(selectedUser?.id, 'block')}
          disabled={selectedUser?.isBlocked}
        >
          <BlockIcon sx={{ mr: 1 }} fontSize="small" />
          חסום משתמש
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          מחק משתמש
        </MenuItem>
      </Menu>

      
      <UserDetailsDialog />
      <DeleteDialog />

      
      <Dialog open={openDialog && dialogType === 'edit'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>עריכת פרטי משתמש</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="שם מלא"
                    defaultValue={selectedUser.name || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="שם משתמש"
                    defaultValue={selectedUser.userName || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="טלפון"
                    defaultValue={selectedUser.phoneNumber || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked={selectedUser.isActive || false}
                        color="primary"
                      />
                    }
                    label="משתמש פעיל"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button variant="contained" color="primary">
            שמור שינויים
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersReports;
