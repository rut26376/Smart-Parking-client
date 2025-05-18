import { createAsyncThunk } from "@reduxjs/toolkit";

export const findDriverCarThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'findDriverCarThunk',
    // פונקציה להפעלה 
   
    async (licensePlate) => {

        console.log("licensePlate",licensePlate);
        const response = await fetch(`https://localhost:7164/api/Routine/FindMyCar/${licensePlate}`);
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