import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllParkingThunk = createAsyncThunk(
    'getAllParkingThunk',
    async (level) => {
        const response = await fetch(`https://localhost:7164/api/Parking/GetAllParkingPlaces/${level}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else { 
            throw new Error('faild to fetch');
        }
    }
)