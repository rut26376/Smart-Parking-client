import React, { useEffect, useState } from 'react'
import './paying.css'
import { useDispatch, useSelector } from 'react-redux'
import { getDriversCardsThunk } from '../../redux/Thunks/getDriversCardsThunk'
import { paymentThunk } from '../../redux/Thunks/paymentThunk'
import { changeCcDetails } from '../../redux/slices/creditCardsSlice'
import masterCard from './Mastercard_2019_logo.svg.png'
import { ReactComponent as MastercardLogo } from './cardLogos/mastercard.svg';
import { ReactComponent as VisaLogo } from './cardLogos/visa.svg';
import { ReactComponent as AmexLogo } from './cardLogos/amex.svg';
import { CreditCard, Receipt, Payment, CheckCircle, Lock, Error, Warning } from '@mui/icons-material'


export const Paying = () => {
  const dispatch = useDispatch()
  const sum = useSelector(state => state.routine.price)
  const [numOfPayments, setNumOfPayments] = useState(1)
  const [flag, setFlag] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const cards = useSelector(state => state.cards.creditCards)
  const licensePlate = useSelector(state => state.driver.licensePlate)
  const driverCode = useSelector(state => state.driver.code)
  const lastCreditCards = useSelector(state => state.cards.lastCreditCards)
  const [activeCardType, setActiveCardType] = useState(null)
  const [blPayment, setBlPeyment] = useState({
    creditCardCode: 0,
    sum: 0,
    date: Date()
  })

  const [blCreditCards, setblCreditCards] = useState(
    {
      creditCardNum: "",
      validityCard: "",
      id: "",
      cvv: "",
      driverCode: ""
    }
  )

  // מצב שדות שנגעו בהם
  const [touchedFields, setTouchedFields] = useState({
    cardNumber: false,
    cvv: false,
    expiryDate: false,
    id: false
  });

  // פונקציה לסימון שדה כ"נגע"
  const markFieldAsTouched = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  useEffect(() => {
    setBlPeyment({ ...blPayment, sum: sum, creditCardCode: lastCreditCards.code })
    setblCreditCards({
      ...blCreditCards, creditCardNum: lastCreditCards.creditCardNum,
      validityCard: lastCreditCards.validityCard,
      id: lastCreditCards.id,
      cvv: lastCreditCards.cvv,
      driverCode: driverCode
    })
  }, [lastCreditCards])


  useEffect(() => {
    dispatch(getDriversCardsThunk(driverCode))
    setBlPeyment({ creditCardCode: lastCreditCards.code, sum: sum })
    setblCreditCards({ ...lastCreditCards, driverCode: driverCode })
  }, [])

  // מצבי אימות כרטיס אשראי
  const [cardValidation, setCardValidation] = useState({
    cardNumber: { valid: false, message: '' },
    cvv: { valid: false, message: '' },
    expiryDate: { valid: false, message: '' },
    id: { valid: false, message: '' }
  });

  // פונקציות אימות משופרות
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.length !== 16) {
        return {
            valid: false,
            message: 'מספר כרטיס אשראי חייב להכיל 16 ספרות'
        };
    }
    let sum = 0;
    let isEven = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber.charAt(i), 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isEven = !isEven;
    }
    return {
        valid: (sum % 10 === 0),
        message: sum % 10 !== 0 ? 'מספר כרטיס אשראי לא תקין' : ''
    };
  };

  const validateCVV = (cvv) => {
    const cvvRegex = /^[0-9]{3,4}$/;
    return {
        valid: cvvRegex.test(cvv),
        message: !cvvRegex.test(cvv) ? 'CVV חייב להכיל 3-4 ספרות' : ''
    };
  };

  const validateExpiryDate = (date) => {
    // בדיקה אם הפורמט תקין
    const dateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!dateRegex.test(date)) {
      return {
        valid: false,
        message: 'פורמט לא תקין, יש להזין MM/YY'
      };
    }

    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // שנה נוכחית בפורמט 2 ספרות
    const currentMonth = currentDate.getMonth() + 1; // חודש נוכחי (1-12)
    
    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);
    
    // בדיקה אם התאריך בעבר
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return {
        valid: false,
        message: 'תוקף הכרטיס פג'
      };
    }
    
    return {
      valid: true,
      message: ''
    };
  };

  const validateID = (id) => {
    // בדיקה שהקלט מכיל רק ספרות
    if (!/^\d+$/.test(id)) {
      return {
        valid: false,
        message: 'תעודת זהות חייבת להכיל ספרות בלבד'
      };
    }
    
    // בדיקת אורך
    if (id.length !== 9) {
      return {
        valid: false,
        message: 'תעודת זהות חייבת להכיל 9 ספרות'
      };
    }
    
    // אלגוריתם ביקורת ת.ז. ישראלית
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(id.charAt(i));
      if (i % 2 === 0) {
        digit *= 1;
      } else {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }
    
    if (sum % 10 !== 0) {
      return {
        valid: false,
        message: 'מספר תעודת זהות לא תקין'
      };
    }
    
    return {
      valid: true,
      message: ''
    };
  };

  // פונקציות פורמט
  const formatCardNumber = (number) => {
    if (!number) return "";
    const cleanNumber = number.replace(/\s/g, '');
    const groups = [];
    
    for (let i = 0; i < cleanNumber.length; i += 4) {
      groups.push(cleanNumber.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };

  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 2) {
      return cleanValue;
    }
    
    // הוספת / אוטומטית אחרי החודש
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
  };

  // זיהוי סוג כרטיס אשראי
  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    // זיהוי סוג הכרטיס לפי מספר
    if (/^4/.test(cleanNumber)) {
      return 'visa';
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return 'mastercard';
    } else if (/^3[47]/.test(cleanNumber)) {
      return 'amex';
    }
    
    return null;
  };

  // פונקציות טיפול בשינויים
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formattedValue = formatCardNumber(value);
    
    e.target.value = formattedValue;
    
    setblCreditCards({ 
      ...blCreditCards, 
      creditCardNum: value
    });
    
    const validation = validateCardNumber(value);
    setCardValidation(prev => ({
      ...prev,
      cardNumber: validation
    }));
    
    // עדכון סוג הכרטיס המוצג
    const cardType = detectCardType(value);
    setActiveCardType(cardType);
    
    // סימון השדה כ"נגע"
    markFieldAsTouched('cardNumber');
  };

  const handleExpiryDateChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formattedValue = inputValue;
    
    // פורמט אוטומטי MM/YY
    if (inputValue.length > 2) {
      formattedValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
    }
    
    // עדכון הערך בשדה
    e.target.value = formattedValue;
    
    setblCreditCards({ ...blCreditCards, validityCard: formattedValue });
    
    const validation = validateExpiryDate(formattedValue);
    setCardValidation(prev => ({
      ...prev,
      expiryDate: validation
    }));
    
    markFieldAsTouched('expiryDate');
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = value;
    
    setblCreditCards({ ...blCreditCards, cvv: value });
    
    const validation = validateCVV(value);
    setCardValidation(prev => ({
      ...prev,
      cvv: validation
    }));
    
    markFieldAsTouched('cvv');
  };

  const handleIDChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    e.target.value = value;
    
    setblCreditCards({ ...blCreditCards, id: value });
    
    const validation = validateID(value);
    setCardValidation(prev => ({
      ...prev,
      id: validation
    }));
    
    markFieldAsTouched('id');
  };

  // פונקציית תשלום משופרת
  const pay = () => {
    debugger
    // בדיקת תקינות כל השדות
    const finalValidation = {
      cardNumber: validateCardNumber(blCreditCards.creditCardNum),
      cvv: validateCVV(blCreditCards.cvv),
      expiryDate: validateExpiryDate(blCreditCards.validityCard),
      id: validateID(blCreditCards.id)
    };

    setCardValidation(finalValidation);

    // בדיקה אם יש שגיאות
    const hasErrors = Object.values(finalValidation).some(field => !field.valid);

    if (hasErrors) {
      // סימון כל השדות כנגעו בהם
      setTouchedFields({
        cardNumber: true,
        cvv: true,
        expiryDate: true,
        id: true
      });
      
      alert('אנא תקן את השגיאות בטופס לפני ביצוע התשלום');
      return;
    }

    // המשך התהליך אם הכל תקין
    setIsProcessing(true);
    setNumOfPayments(document.getElementById("numOf").value);
    
    setTimeout(() => {
      dispatch(paymentThunk({ 
        blPayment: blPayment, 
        blCreditCards: blCreditCards, 
        licensePlate: licensePlate, 
        numOfPayments: document.getElementById("numOf").value 
      }));
      
      setIsProcessing(false);
      setPaymentComplete(true);
      
      setTimeout(() => {
        setBlPeyment({
          creditCardCode: 0,
          sum: 0,
          date: Date()
        });
        
        setblCreditCards({
          creditCardNum: "",
          validityCard: "",
          id: "",
          cvv: "",
          driverCode: ""
        });
        
        window.location.href = '/';
      }, 3000);
    }, 2000);
  };

  return (
    <>
      {/* Background Elements */}
      <div className="premium-payment-background">
        <div className="premium-payment-shape payment-shape-1"></div>
        <div className="premium-payment-shape payment-shape-2"></div>
      </div>

      <div className='inputsPaying'>
        {!paymentComplete ? (
          <>
            {/* Payment Header */}
            <div className="payment-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60">
                <rect width="100" height="60" rx="10" fill="#1434CB"/>
                <path d="M38.5 40L42.5 20H49L45 40H38.5ZM66.5 21.5C65 20.8 62.5 20 59.5 20C52.5 20 47.5 23.5 47.5 28.5C47.5 32.5 51 34.5 53.5 36C56.1 37.5 57 38.5 57 40C57 42 54.5 43 52 43C49 43 47.5 42.5 46 41.5L45 46.5C46.5 47.3 49 48 52 48C59.5 48 64.5 44.5 64.5 39.5C64.5 35.5 61.5 33.5 59 32C56.5 30.5 55.5 29.5 55.5 28C55.5 26 57 24.5 59.5 24.5C61.5 24.5 63 25 64 25.5L66.5 21.5ZM84 40H78.5L73 20H79.5L82 33.5L84.5 20H90.5L84 40Z" fill="white"/>
              </svg>
              <p>תשלום מאובטח</p>
            </div>

            {/* Payment Summary */}
            <div className="payment-summary">
              <div className="payment-summary-title">
                <Receipt style={{ fontSize: '1.2rem' }} />
                פרטי התשלום
              </div>
              <div className="payment-summary-row">
                <div className="payment-summary-label">סכום לתשלום:</div>
                <div className="payment-summary-value">{sum} ₪</div>
              </div>
              <div className="payment-summary-row">
                <div className="payment-summary-label">מספר תשלומים:</div>
                <div className="payment-summary-value">{numOfPayments}</div>
              </div>
              <div className="payment-summary-row">
                <div className="payment-summary-label">סה"כ לתשלום:</div>
                <div className="payment-summary-value">{sum} ₪</div>
              </div>
            </div>

            {/* Card Type Indicator */}
            <div className="card-type-indicator">
              <MastercardLogo 
                alt="MasterCard" 
                className={activeCardType === 'mastercard' ? 'active' : ''} 
              />
              <VisaLogo 
                alt="Visa" 
                className={activeCardType === 'visa' ? 'active' : ''} 
              />
              <AmexLogo 
                alt="American Express" 
                className={activeCardType === 'amex' ? 'active' : ''} 
              />
            </div>

            {/* Credit Card Form */}
            <div className="card-form-section">
              <div className="card-form-title">
                <CreditCard />
                פרטי כרטיס אשראי
              </div>

              {/* מספר כרטיס אשראי */}
              <div className="input-with-icon">
                <input 
                  className={`inputs card-number-input ${touchedFields.cardNumber && !cardValidation.cardNumber.valid ? 'error' : touchedFields.cardNumber && cardValidation.cardNumber.valid ? 'success' : ''}`}
                  type="text" 
                  defaultValue={cards.length != 0 ? formatCardNumber(lastCreditCards.creditCardNum) : ""} 
                  placeholder='מספר כרטיס אשראי' 
                  required 
                  onChange={handleCardNumberChange}
                  onBlur={() => markFieldAsTouched('cardNumber')}
                  maxLength={19} // 16 ספרות + 3 רווחים
                />
                {touchedFields.cardNumber && cardValidation.cardNumber.message && (
                  <div className="input-error-message">
                    <Error fontSize="small" /> {cardValidation.cardNumber.message}
                  </div>
                )}
              </div>

              {/* שורת פרטי אבטחה */}
              <div className="card-security-row">
                <div style={{ flex: 1 }}>
                  <input 
                    className={`inputs ${touchedFields.expiryDate && !cardValidation.expiryDate.valid ? 'error' : touchedFields.expiryDate && cardValidation.expiryDate.valid ? 'success' : ''}`}
                    defaultValue={cards.length !== 0 ? lastCreditCards.validityCard.substring(0, 5) : ""} 
                    type="text" 
                    placeholder="תוקף (MM/YY)" 
                    required 
                    onChange={handleExpiryDateChange}
                    onBlur={() => markFieldAsTouched('expiryDate')}
                    maxLength={5}
                  />
                  {touchedFields.expiryDate && cardValidation.expiryDate.message && (
                    <div className="input-error-message">
                      <Warning fontSize="small" /> {cardValidation.expiryDate.message}
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <input 
                    className={`inputs ${touchedFields.cvv && !cardValidation.cvv.valid ? 'error' : touchedFields.cvv && cardValidation.cvv.valid ? 'success' : ''}`}
                    defaultValue={cards.length !== 0 ? lastCreditCards.cvv : ""} 
                    type="text" 
                    placeholder="CVV" 
                    required 
                    onChange={handleCVVChange}
                    onBlur={() => markFieldAsTouched('cvv')}
                    maxLength={4}
                  />
                  {touchedFields.cvv && cardValidation.cvv.message && (
                    <div className="input-error-message">
                      <Warning fontSize="small" /> {cardValidation.cvv.message}
                    </div>
                  )}
                </div>
              </div>

              {/* תעודת זהות */}
              <div>
                <input 
                  className={`inputs ${touchedFields.id && !cardValidation.id.valid ? 'error' : touchedFields.id && cardValidation.id.valid ? 'success' : ''}`}
                  defaultValue={cards.length !== 0 ? lastCreditCards.id : ""} 
                  type="text" 
                  placeholder="תעודת זהות" 
                  required 
                  onChange={handleIDChange}
                  onBlur={() => markFieldAsTouched('id')}
                  maxLength={9}
                />
                {touchedFields.id && cardValidation.id.message && (
                  <div className="input-error-message">
                    <Error fontSize="small" /> {cardValidation.id.message}
                  </div>
                )}
              </div>

              <div className="card-form-title" style={{ marginTop: '20px' }}>
                <Payment />
                אפשרויות תשלום
              </div>

              <label className='inputs'>מספר תשלומים</label>
              <select className='inputs' style={{ marginTop: 0 }} required id='numOf' onChange={(e) => setNumOfPayments(e.target.value)}>
                <option>1</option>
                <option>2</option>
                {sum > 100 &&
                  <>
                    <option>3</option>
                    <option>4</option>
                  </>
                }
              </select>

              <button 
                onClick={() => pay()} 
                disabled={isProcessing}
                className={Object.values(cardValidation).every(field => field.valid) && Object.values(touchedFields).every(touched => touched) ? 'valid-payment' : ''}
              >
                {isProcessing ? (
                  <>
                    <span className="loading-spinner"></span>
                    מבצע תשלום...
                  </>
                ) : (
                  <>לתשלום {sum} ₪</>
                )}
              </button>

              <div className="security-badge">
                <Lock />
                התשלום מאובטח ומוצפן בתקן SSL
              </div>

              <u onClick={() => setFlag(true)}>לבחירת כרטיס אשראי שמור</u>
            </div>
          </>
        ) : (
          <div className="payment-success">
            <div className="payment-success-icon">
              <CheckCircle style={{ fontSize: '40px' }} />
            </div>
            <div className="payment-success-title">התשלום בוצע בהצלחה!</div>
            <div className="payment-success-message">
              התשלום על סך {sum} ₪ בוצע בהצלחה. מעבירים אותך למערכת החניה...
            </div>
          </div>
        )}
      </div>

      {flag && cards.map(c => (
        <div 
          className='chooseCC' 
          key={c.code} 
          onClick={() => { 
            dispatch(changeCcDetails(c.code)); 
            setFlag(false);
          }}
        >
          <img width={"50px"} height={"30px"} src={masterCard} alt="MasterCard" />
          <div>
            <div className='ccDetails'>**** **** **** {c.creditCardNum.substring(12)}</div>
            <div className='ccDetails'>{c.validityCard.substring(0, 10)}</div>
          </div>
        </div>
      ))}
    </>
  );
};
 
