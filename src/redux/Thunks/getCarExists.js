import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCarExists = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'getCarExists',
    // פונקציה להפעלה 
   
    async (licensePlate) => {
        console.log("licensePlate",licensePlate);
        const response = await fetch(`https://localhost:7164/api/Routine/GetCarExists/${licensePlate}`);
        console.log("response",response);
        if (response.ok) {
            console.log("came to thunk");
            const data = await response.text();
            console.log(data);
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)