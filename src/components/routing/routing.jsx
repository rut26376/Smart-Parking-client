import { Route, Routes } from "react-router-dom"
import { Login } from "../כניסה למערכת/login"
import { Logon } from "../משתמש חדש/logon"
import { Parking } from "../חניה/parking"
import { Paying } from "../תשלום/paying"
import { Manager } from "../מנהל/manager"
import PageNotFound from "../page not found/pageNotFound"
import { PaymentReports } from "../מנהל/דוחות תשלום/paymentReports"
import UsersReports from "../מנהל/usersReports"



export const Routing = () => {
    return <div>
        <Routes>
            <Route path={'/'} element={<Login />} />
            <Route path={'/home'} element={<Login />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/logon'} element={<Logon />} />
            <Route path={'/parking'} element={<Parking />} />
            <Route path={'/manager/parking'} element={<Parking />} />
            <Route path={'/paying'} element={<Paying />} />
            <Route path={'/manager'} element={<Manager />} />
            <Route path='/manager/payments' element={<PaymentReports />} />
            <Route path='/manager/users' element={<UsersReports />} />
          
            <Route path="*" element={<PageNotFound />} />

        </Routes>


    </div>
}