import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllParkingThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'getAllParkingThunk',
    // פונקציה להפעלה 
   
    async (level) => {
        console.log("level",level);
        const response = await fetch(`https://localhost:7164/api/Parking/GetAllParkingPlaces/${level}`);
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