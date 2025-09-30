import { createAsyncThunk } from "@reduxjs/toolkit";

export const isManagerThunk = createAsyncThunk(
    'isManagerThunk',
    async ({name,code}) => {
        const response = await fetch(`https://localhost:7164/api/CPManager/isManager/${name}/${code}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)