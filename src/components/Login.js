import React, { useState, useEffect } from 'react';
import axios from 'axios' // easy to use Json Placeholde API

function Login(props){
    // step1: define states u need
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    // step2: define execution function
    const onChange_email=(e)=>{
        console.log(e.target)
        setEmail(e.target.value)
    }
    const onChange_password=(e)=>{
        console.log(e.target)
        setPassword(e.target.value)
    }
    const login=(user)=>{
        // access rest API, if successfully log in, we return json defined from backend
        return axios
          .post('users/login', {
            email: user.email,
            password: user.password
            // Since the post request we defined in the backend, it need two arguments: email and password
          })
          .then(response => {
            // console.log('response',response.data) // response.data: return restful API result
            console.log('localStorage before setItem', localStorage)
            localStorage.setItem('usertoken', response.data)
            console.log('localStorage after setItem', localStorage)
            console.log('response', response)
            return response.data
          })
          .catch(err => {
              //如果上面function 失敗了, 就會跑這個function
            console.log("Error handling")
            console.log(err)
          }) // catch request error
      }   
    const onSubmit=(e)=>{
        e.preventDefault()
        console.log(e)
        // the json object we need to send to backend
        const user = {
            email: email,
            password: password
          }
        // chaining for executing tow or more asynchronous operations back to back
        // run login first, then run function 
        login(user).then(function(res) {
            console.log('what login function return',res)
            if (!res.error) {
              // if response from backedn there is no key called error, we execute the below code.
              props.history.push(`/profile`)
            }
          })
    }
    
    // step3: render JSX
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5 mx-auto">
                    <form noValidate onSubmit={onSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">請登入</h1>
                        <div className="form-group">
                            <label htmlFor="email">電子郵件</label>
                            <input type="email" className="form-control" name="email" placeholder="Enter email" value = {email} onChange = {onChange_email}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">密碼</label>
                            <input type="password" className="form-control" name="Password" placeholder="Password" value = {password} onChange = {onChange_password}/>
                        </div>
                        <button type="submit" className="btn btn-lg btn-primary btn-block">登入</button>
                    </form>
                </div>
            </div>
        </div>
    )
    };

export default Login
