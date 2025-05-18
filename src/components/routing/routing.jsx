import { Route, Routes } from "react-router-dom"
import { Login } from "../כניסה למערכת/login"
import { Logon } from "../משתמש חדש/logon"
import { Confirm } from "../אימות משתמש/confirm"
import { Parking } from "../חניה/parking"
import { Paying } from "../תשלום/paying"
import { Manager } from "../מנהל/manager"



export const Routing = () => {
    return <div>
        <Routes>
            <Route path={'/'} element={<Login />} />
            <Route path={'/home'} element={<Login />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/logon'} element={<Logon />} />
            <Route path={'/login/confirm'} element={<Confirm/>} />
            <Route path={'/parking'} element={<Parking/>} />
            <Route path={'/paying'} element={<Paying/>} />
            <Route path={'/manager'} element={<Manager/>} />
            
        </Routes>


    </div>
}