<<<<<<< HEAD
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { DriverSlice } from "./slices/driverSlice";
import { ParkingSlice } from "./slices/parkingSlice";
import { RoutineSlice } from "./slices/routineSlice";
import { CreditCardsSlice } from "./slices/creditCardsSlice";

const reducers = combineSlices(DriverSlice,ParkingSlice,RoutineSlice,CreditCardsSlice);



export const STORE = configureStore({
    reducer: reducers,
})
=======
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { DriverSlice } from "./slices/driverSlice";
import { ParkingSlice } from "./slices/parkingSlice";
import { RoutineSlice } from "./slices/routineSlice";
import { CreditCardsSlice } from "./slices/creditCardsSlice";

const reducers = combineSlices(DriverSlice,ParkingSlice,RoutineSlice,CreditCardsSlice);



export const STORE = configureStore({
    reducer: reducers,
})
>>>>>>> e221355f80b720573b47511843d11088f5ed922d
