import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { DriverSlice } from "./slices/driverSlice";
import { ParkingSlice } from "./slices/parkingSlice";
import { RoutineSlice } from "./slices/routineSlice";
import { CreditCardsSlice } from "./slices/creditCardsSlice";
import { ManagerSlice } from "./slices/managerSlice";
import { PaymentSlice } from "./slices/paymentSlice";

const reducers = combineSlices(DriverSlice,ParkingSlice,RoutineSlice,CreditCardsSlice,ManagerSlice,PaymentSlice);



export const STORE = configureStore({
    reducer: reducers,
})
