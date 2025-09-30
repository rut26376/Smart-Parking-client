import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPriceThunk = createAsyncThunk(
    'getPriceThunk',
    async ({licensePlate}) => {
        const response = await fetch(`https://localhost:7164/api/Routine/GetPrice/${licensePlate}`);
        if (response.ok) {
            const data = await response.text();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)