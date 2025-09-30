import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPaymentsThunk = createAsyncThunk(
    'getAllPaymentsThunk',
    async () => {
        const response = await fetch(`https://localhost:7164/api/Payment/GetPayments`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)