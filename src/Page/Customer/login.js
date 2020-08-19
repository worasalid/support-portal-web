import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import qs from 'query-string'
import axios from 'axios'

export default function Login() {
    const history = useHistory();

    const onFinish = async (value) => {
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/auth/customer",
                method: "POST",
                data: value
            });
            console.log(result.data)
            localStorage.setItem("sp-ssid", result.data);


            history.push('/customer/issue/create');

        } catch (error) {
            alert("ข้อมููลไม่ถูกต้อง")
            history.push('/customer/issue/create');

        }

    };

    useEffect(() => {
        onFinish(qs.parse(history.location.search))
    }, [])

    return (
        <div>
            loading...
        </div>
    )
}
