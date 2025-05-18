import { createAsyncThunk } from "@reduxjs/toolkit";


export const addRoutineThunk = createAsyncThunk(
    // הפונקציה מקבלת את השם 
    'addRoutineThunk',
    // פונקציה להפעלה 
   
    async (routine) => {
   
                   console.log(routine,"cameToAddRoutine");

                const response = await fetch(`https://localhost:7164/api/Routine`, {
                    method: 'POST',
                    body: JSON.stringify(routine),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                if (response.ok) {
                    return response;
                }
                else {
                    throw new Error('faild to fetch');
                }
            }
)