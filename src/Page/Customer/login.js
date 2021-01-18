import React, {useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import qs from 'query-string'
import axios from 'axios'
import AuthenContext from '../../utility/authenContext';

export default function Login() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    
    const onFinish = async (value) => {
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/auth/customer",
                method: "get",
                params: value
            });
            localStorage.setItem("sp-ssid", result.data.ssid);
            dispatch({ type: 'Authen', payload: true});
            dispatch({ type: 'LOGIN', payload: result.data.usersdata});
             history.push('/customer/servicedesk');
        } catch (error) {
            alert("ข้อมููลไม่ถูกต้อง")
        }
    };

    useEffect(() => {
        onFinish(qs.parse(history.location.search));
        
    }, [])

    return (
        
        <div>
            loading...
        </div>
    )
}
