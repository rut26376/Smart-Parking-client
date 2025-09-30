import { createAsyncThunk } from "@reduxjs/toolkit";


export const addRoutineThunk = createAsyncThunk(
    'addRoutineThunk',

    async ({routine,driverCode}) => {

                const response = await fetch(`https://localhost:7164/api/Routine/AddRoutine/${driverCode}`, {
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