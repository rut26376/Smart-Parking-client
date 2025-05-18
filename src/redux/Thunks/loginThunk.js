<<<<<<< HEAD
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'loginThunk',
    // פונקציה להפעלה 
   
    async ({name,password,lisencePlate}) => {
        
        
        const response = await fetch(`https://localhost:7164/api/Driver/GetDriver/${name}/${password}/${lisencePlate}`);
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
=======
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
   
    // הפונקציה מקבלת את השם 
    'loginThunk',
    // פונקציה להפעלה 
   
    async ({name,password,lisencePlate}) => {
        
        
        const response = await fetch(`https://localhost:7164/api/Driver/GetDriver/${name}/${password}/${lisencePlate}`);
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
>>>>>>> e221355f80b720573b47511843d11088f5ed922d
)