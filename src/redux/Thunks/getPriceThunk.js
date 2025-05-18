<<<<<<< HEAD
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPriceThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'getPriceThunk',
    // פונקציה להפעלה 
   
    async (licensePlate) => {
        console.log("licensePlate",licensePlate);
        const response = await fetch(`https://localhost:7164/api/Routine/GetPrice/${licensePlate}`);
        
        console.log(response);
        if (response.ok) {
            console.log("came to thunk");
            const data = await response.text();
            console.log(data,"data");
          
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
=======
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPriceThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'getPriceThunk',
    // פונקציה להפעלה 
   
    async (licensePlate) => {
        console.log("licensePlate",licensePlate);
        const response = await fetch(`https://localhost:7164/api/Routine/GetPrice/${licensePlate}`);
        
        console.log(response);
        if (response.ok) {
            console.log("came to thunk");
            const data = await response.text();
            console.log(data,"data");
          
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
>>>>>>> e221355f80b720573b47511843d11088f5ed922d
)