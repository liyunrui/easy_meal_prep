import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'

function Profile(){
    // step1: define states u need
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')

    // we run this effect only once
    useEffect(
        () =>{
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        console.log("decoded info",decoded)
        setName(decoded.identity.name)
        setEmail(decoded.identity.email)

        },[])

    return(
    <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">歡迎加入備餐好輕鬆</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>暱稱</td>
                <td>{name}</td>
              </tr>
              <tr>
                <td>電子郵件</td>
                <td>{email}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>       
    )
}
export default Profile