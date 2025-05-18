import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDriversCardsThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'getDriversCardsThunk',
    // פונקציה להפעלה 
   
    async (driverCode) => {
        console.log("driverCode",driverCode);
        const response = await fetch(`https://localhost:7164/api/CreditCards/get/${driverCode}`);
        console.log(response);
        if (response.ok) {
            console.log("came to thunk");
            const data = await response.json();
            console.log(data);
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)