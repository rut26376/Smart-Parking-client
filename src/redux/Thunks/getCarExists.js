import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCarExists = createAsyncThunk(
    'getCarExists',
    async (licensePlate) => {
        const response = await fetch(`https://localhost:7164/api/Routine/GetCarExists/${licensePlate}`);
        if (response.ok) {
            const data = await response.text();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)