import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPaymentsThunk } from '../../../redux/Thunks/getAllPaymentsThunk';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    TextField,
    IconButton,
    Pagination,
    LinearProgress
} from '@mui/material';
import {
    Payment,
    Receipt,
    Search,
    FilterList,
    Close,
    CheckCircle,
    Error,
    Schedule,
    Info,
    Warning
} from '@mui/icons-material';

export const PaymentReports = () => {
    const dispatch = useDispatch();
    
    // קבלת נתונים מה-Redux slice הקיים
    const { allPayments } = useSelector(state => state.payment || { allPayments: [] });
    
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentsPerPage] = useState(10);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!hasLoaded) {
            fetchPayments();
        }
    }, [hasLoaded]);

    const fetchPayments = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            await dispatch(getAllPaymentsThunk());
            setHasLoaded(true);
        } catch (error) {
            console.error('שגיאה בטעינת נתוני תשלומים:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshPayments = async () => {
        setHasLoaded(false);
        await fetchPayments();
    };

    // פונקציה לחישוב סטטוס תשלום
    const calculatePaymentStatus = (paymentGroup) => {
        // אם אין פרטי תשלום - זה אומר שהתשלום בוצע והוא תשלום יחיד
        if (!paymentGroup.paymentsDetails || paymentGroup.paymentsDetails.length === 0) {
            return {
                status: 'completed',
                statusText: 'שולם במלואו',
                color: 'success',
                icon: <CheckCircle />,
                description: 'תשלום יחיד שהושלם',
                completionPercentage: 100,
                breakdown: { paid: 1, unpaid: 0, pending: 0 }
            };
        }

        const details = paymentGroup.paymentsDetails;
        const totalPayments = details.length;
        const paidPayments = details.filter(p => p.paid === true).length;
        const unpaidPayments = details.filter(p => p.paid === false).length;
        const pendingPayments = details.filter(p => p.paid === null || p.paid === undefined).length;

        // חישוב אחוזי השלמה
        const completionPercentage = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;

        if (paidPayments === totalPayments) {
            return {
                status: 'completed',
                statusText: 'שולם במלואו',
                color: 'success',
                icon: <CheckCircle />,
                description: `${paidPayments}/${totalPayments} תשלומים שולמו`,
                completionPercentage: 100,
                breakdown: { paid: paidPayments, unpaid: unpaidPayments, pending: pendingPayments }
            };
        } else if (unpaidPayments === totalPayments) {
            return {
                status: 'failed',
                statusText: 'לא שולם',
                color: 'error',
                icon: <Error />,
                description: `${unpaidPayments}/${totalPayments} תשלומים לא שולמו`,
                completionPercentage: 0,
                breakdown: { paid: paidPayments, unpaid: unpaidPayments, pending: pendingPayments }
            };
        } else if (pendingPayments === totalPayments) {
            return {
                status: 'pending',
                statusText: 'ממתין לתשלום',
                color: 'warning',
                icon: <Schedule />,
                description: `${pendingPayments}/${totalPayments} תשלומים ממתינים`,
                completionPercentage: 0,
                breakdown: { paid: paidPayments, unpaid: unpaidPayments, pending: pendingPayments }
            };
        } else if (paidPayments > 0 && (unpaidPayments > 0 || pendingPayments > 0)) {
            return {
                status: 'partial',
                statusText: 'תשלום חלקי',
                color: 'warning',
                icon: <Warning />,
                description: `${paidPayments}/${totalPayments} תשלומים שולמו (${completionPercentage}%)`,
                completionPercentage,
                breakdown: { paid: paidPayments, unpaid: unpaidPayments, pending: pendingPayments }
            };
        } else {
            return {
                status: 'mixed',
                statusText: 'מצב מעורב',
                color: 'info',
                icon: <Info />,
                description: `שולמו: ${paidPayments}, לא שולמו: ${unpaidPayments}, ממתינים: ${pendingPayments}`,
                completionPercentage,
                breakdown: { paid: paidPayments, unpaid: unpaidPayments, pending: pendingPayments }
            };
        }
    };

    // עיבוד התשלומים
    const processedPayments = React.useMemo(() => {
        if (!allPayments || allPayments.length === 0) return [];
        
        return allPayments.map((paymentGroup, index) => {
            const statusInfo = calculatePaymentStatus(paymentGroup);
            
            // אם אין פרטי תשלום - זה תשלום יחיד שהושלם
            if (!paymentGroup.paymentsDetails || paymentGroup.paymentsDetails.length === 0) {
                const amount = parseFloat(paymentGroup.sum) || 0;
                return {
                    id: index,
                    paymentId: `PAY-SINGLE-${index + 1}`,
                    creditCardCode: paymentGroup.creditCardCode || 'לא זמין',
                    groupSum: paymentGroup.sum || 0,
                    groupDate: paymentGroup.date,
                    totalAmount: amount,
                    paidAmount: amount,
                    unpaidAmount: 0,
                    paymentsDetails: [],
                    statusInfo,
                    paymentCount: 1,
                    isSinglePayment: true
                };
            }

            // חישוב סכומים עבור קבוצת תשלומים
            const paidAmount = paymentGroup.paymentsDetails
                .filter(p => p.paid === true)
                .reduce((sum, p) => sum + (parseFloat(p.sum) || 0), 0);

            const totalAmount = paymentGroup.paymentsDetails
                .reduce((sum, p) => sum + (parseFloat(p.sum) || 0), 0);

            return {
                id: index,
                paymentId: `PAY-GROUP-${index + 1}`,
                creditCardCode: paymentGroup.creditCardCode || 'לא זמין',
                groupSum: paymentGroup.sum || 0,
                groupDate: paymentGroup.date,
                totalAmount,
                paidAmount,
                unpaidAmount: totalAmount - paidAmount,
                paymentsDetails: paymentGroup.paymentsDetails,
                statusInfo,
                paymentCount: paymentGroup.paymentsDetails.length,
                isSinglePayment: false
            };
        });
    }, [allPayments]);

    // חישוב סטטיסטיקות
    const stats = React.useMemo(() => {
        if (processedPayments.length === 0) {
            return {
                completed: 0,
                partial: 0,
                failed: 0,
                pending: 0,
                mixed: 0,
                totalRevenue: 0,
                lostRevenue: 0,
                potentialRevenue: 0,
                collectionRate: 0
            };
        }

        const completed = processedPayments.filter(p => p.statusInfo.status === 'completed').length;
        const partial = processedPayments.filter(p => p.statusInfo.status === 'partial').length;
        const failed = processedPayments.filter(p => p.statusInfo.status === 'failed').length;
        const pending = processedPayments.filter(p => p.statusInfo.status === 'pending').length;
        const mixed = processedPayments.filter(p => p.statusInfo.status === 'mixed').length;

        const totalRevenue = processedPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const potentialRevenue = processedPayments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
        const lostRevenue = processedPayments.reduce((sum, p) => sum + (p.unpaidAmount || 0), 0);
        const collectionRate = potentialRevenue > 0 ? Math.round((totalRevenue / potentialRevenue) * 100) : 0;

        return {
            completed,
            partial,
            failed,
            pending,
            mixed,
            totalRevenue,
            lostRevenue,
            potentialRevenue,
            collectionRate
        };
    }, [processedPayments]);

    // פילטור התשלומים
    const filteredPayments = processedPayments.filter(payment => {
        const matchesStatus = filterStatus === 'all' || payment.statusInfo.status === filterStatus;
        const matchesSearch = 
            payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.creditCardCode.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
    const startIndex = (currentPage - 1) * paymentsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, startIndex + paymentsPerPage);

    const fetchPaymentDetails = (paymentId) => {
        const paymentDetails = processedPayments.find(p => p.id === paymentId);
        if (paymentDetails) {
            setSelectedPayment(paymentDetails);
            setDialogOpen(true);
        }
    };

    if (loading && allPayments.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>טוען נתוני תשלומים...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Payment sx={{ fontSize: 40, color: '#0EA5E9' }} />
                <Typography variant="h4" component="h1">
                    דוחות תשלומים ({allPayments.length} תשלומים)
                </Typography>
            </Box>

            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#10B981', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircle sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">תשלומים שהושלמו</Typography>
                                    <Typography variant="h4">{stats.completed}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#F59E0B', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Schedule sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">תשלומים חלקיים</Typography>
                                    <Typography variant="h4">{stats.partial}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#EF4444', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Error sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">תשלומים שנכשלו</Typography>
                                    <Typography variant="h4">{stats.failed}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ bgcolor: '#0EA5E9', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Receipt sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6">סה"כ הכנסות</Typography>
                                    <Typography variant="h4">₪{Math.round(stats.totalRevenue)}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="חיפוש לפי מזהה תשלום או קוד כרטיס אשראי"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>סטטוס תשלום</InputLabel>
                            <Select
                                value={filterStatus}
                                label="סטטוס תשלום"
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="all">הכל</MenuItem>
                                <MenuItem value="completed">הושלם</MenuItem>
                                <MenuItem value="partial">חלקי</MenuItem>
                                <MenuItem value="pending">ממתין</MenuItem>
                                <MenuItem value="failed">נכשל</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            variant="outlined"
                            onClick={refreshPayments}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                            fullWidth
                        >
                            {loading ? 'טוען...' : 'רענן נתונים'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>מזהה תשלום</TableCell>
                                <TableCell>קוד כרטיס אשראי</TableCell>
                                <TableCell>סכום כולל</TableCell>
                                <TableCell>סכום ששולם</TableCell>
                                <TableCell>סטטוס</TableCell>
                                <TableCell>מספר תשלומים</TableCell>
                                <TableCell>תאריך</TableCell>
                                <TableCell>פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="body1" color="text.secondary">
                                            {loading ? 'טוען נתונים...' : 'אין תשלומים להצגה'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentPayments.map((payment) => (
                                    <TableRow
                                        key={payment.id}
                                        sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}
                                        onClick={() => fetchPaymentDetails(payment.id)}
                                    >
                                        <TableCell>{payment.paymentId}</TableCell>
                                        <TableCell>{payment.creditCardCode}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                ₪{Math.round(payment.totalAmount || 0)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                ₪{Math.round(payment.paidAmount || 0)}
                                            </Typography>
                                            {(payment.unpaidAmount || 0) > 0 && (
                                                <Typography variant="caption" color="error.main">
                                                    חסר: ₪{Math.round(payment.unpaidAmount || 0)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={payment.statusInfo.statusText}
                                                color={payment.statusInfo.color}
                                                size="small"
                                                icon={payment.statusInfo.icon}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {payment.paymentCount}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {payment.isSinglePayment ? 'תשלום יחיד' : 'תשלומים'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {payment.groupDate ? new Date(payment.groupDate).toLocaleDateString('he-IL') : 'לא זמין'}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fetchPaymentDetails(payment.id);
                                                }}
                                                color="primary"
                                            >
                                                <Info />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                    />
                </Box>
            </Paper>

            
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">פרטי תשלום - {selectedPayment?.paymentId}</Typography>
                    <IconButton onClick={() => setDialogOpen(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {selectedPayment && (
                        <Grid container spacing={3}>
                            
                            <Grid item xs={12}>
                                <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {selectedPayment.isSinglePayment ? 'פרטי תשלום יחיד' : 'סיכום קבוצת התשלום'}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="body2">מזהה</Typography>
                                                <Typography variant="h6">{selectedPayment.paymentId}</Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="body2">קוד כרטיס אשראי</Typography>
                                                <Typography variant="h6">{selectedPayment.creditCardCode}</Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="body2">סכום כולל</Typography>
                                                <Typography variant="h6">₪{Math.round(selectedPayment.totalAmount || 0)}</Typography>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Typography variant="body2">
                                                    {selectedPayment.isSinglePayment ? 'סכום ששולם' : 'שולם בפועל'}
                                                </Typography>
                                                <Typography variant="h6">₪{Math.round(selectedPayment.paidAmount || 0)}</Typography>
                                            </Grid>
                                        </Grid>
                                        {!selectedPayment.isSinglePayment && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2">התקדמות תשלום</Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={selectedPayment.statusInfo.completionPercentage || 0}
                                                    sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.3)' }}
                                                />
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {selectedPayment.statusInfo.completionPercentage || 0}% הושלם
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            
                            {!selectedPayment.isSinglePayment && selectedPayment.paymentsDetails.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        פירוט התשלומים ({selectedPayment.paymentsDetails.length} תשלומים)
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>קוד תשלום</TableCell>
                                                    <TableCell>סכום</TableCell>
                                                    <TableCell>סטטוס</TableCell>
                                                    <TableCell>תאריך</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedPayment.paymentsDetails.map((detail, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{detail.code || `תשלום-${index + 1}`}</TableCell>
                                                        <TableCell>₪{Math.round(detail.sum || 0)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={
                                                                    detail.paid === true ? 'שולם' :
                                                                    detail.paid === false ? 'לא שולם' :
                                                                    'ממתין'
                                                                }
                                                                color={
                                                                    detail.paid === true ? 'success' :
                                                                    detail.paid === false ? 'error' :
                                                                    'warning'
                                                                }
                                                                size="small"
                                                                icon={
                                                                    detail.paid === true ? <CheckCircle /> :
                                                                    detail.paid === false ? <Error /> :
                                                                    <Schedule />
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {detail.date ? new Date(detail.date).toLocaleDateString('he-IL') : 'לא זמין'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )}

                            
                            {selectedPayment.isSinglePayment && (
                                <Grid item xs={12}>
                                    <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                ✅ תשלום יחיד שהושלם בהצלחה
                                            </Typography>
                                            <Typography variant="body1">
                                                זהו תשלום יחיד בסכום של ₪{Math.round(selectedPayment.totalAmount || 0)} שבוצע בהצלחה.
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                תאריך התשלום: {selectedPayment.groupDate ? new Date(selectedPayment.groupDate).toLocaleDateString('he-IL') : 'לא זמין'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                       
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} variant="contained">
                        סגור
                    </Button>
                    <Button
                        onClick={() => {
                            
                        }}
                        variant="outlined"
                    >
                        הדפס קבלה
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
