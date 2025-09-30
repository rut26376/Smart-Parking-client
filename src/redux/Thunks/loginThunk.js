import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
    'loginThunk',
    async ({name,password}) => {
        const response = await fetch(`https://localhost:7164/api/Driver/GetDriverVehicles/${name}/${password}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)