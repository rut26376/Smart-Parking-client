import { createAsyncThunk } from "@reduxjs/toolkit";

export const findDriverCarThunk = createAsyncThunk(
    'findDriverCarThunk',
    async (licensePlate) => {
        const response = await fetch(`https://localhost:7164/api/Routine/FindMyCar/${licensePlate}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)