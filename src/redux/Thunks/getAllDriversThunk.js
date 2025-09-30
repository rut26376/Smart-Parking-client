import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllDriversThunk = createAsyncThunk(
    'getAllDriversThunk',
    async () => {
        const response = await fetch(`https://localhost:7164/api/Driver/getAll`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)