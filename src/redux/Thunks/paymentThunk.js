import { createAsyncThunk } from "@reduxjs/toolkit";

export const paymentThunk = createAsyncThunk(
    'paymentThunk',
    async ({blPayment , blCreditCards , licensePlate , numOfPayments}) => {
      
 
        const shalvush = {
           
                blPayment: {
                  creditCardCode: blPayment.creditCardCode,
                  sum: blPayment.sum,
                  date: blPayment.date,
                },
                blCreditCards: {
                  code: 0,
                  creditCardNum: blCreditCards.creditCardNum,
                  validityCard: blCreditCards.validityCard,
                  id: blCreditCards.id,
                  cvv: blCreditCards.cvv,
                  driverCode:blCreditCards.driverCode
                  
                }
            
        }

            const response = await fetch(`https://localhost:7164/api/Payment/AddPayment/${licensePlate}/${numOfPayments}`, {
            method: 'POST',
            body: JSON.stringify(shalvush),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)