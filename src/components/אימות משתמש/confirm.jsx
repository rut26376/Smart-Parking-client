
import {useSelector } from "react-redux";

import './confirm.css';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


export const Confirm = () => {

    const userCode = useSelector(state => state.driver.code)
    const [code, setCode] = useState()
    
    const navigate = useNavigate()

return <div className='loginInputs'>

    <input type="password" placeholder="הכנס קוד אימות" className='inputs' onChange={(e)=>setCode(e.target.value)}/>
    <Button disabled={code !== userCode}  style={code !== userCode?{backgroundColor:"gray"}:{backgroundColor:"white",color:'black'}} onClick={() => navigate(`/parking`)}>login</Button>
   

</div>
}
