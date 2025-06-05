import { createAsyncThunk } from "@reduxjs/toolkit";

export const isManagerThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'isManagerThunk',
    // פונקציה להפעלה 
   
    async ({name,code}) => {
       ;
        const response = await fetch(`https://localhost:7164/api/CPManager/isManager/${name}/${code}`);
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