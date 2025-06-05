import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPaymentsThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'getAllPaymentsThunk',
    // פונקציה להפעלה 
   
    async () => {
        const response = await fetch(`https://localhost:7164/api/Payment/GetPayments`);
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)