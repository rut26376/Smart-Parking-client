import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDriversCardsThunk = createAsyncThunk(
    'getDriversCardsThunk',
    async (driverCode) => {
        const response = await fetch(`https://localhost:7164/api/CreditCards/get/${driverCode}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)