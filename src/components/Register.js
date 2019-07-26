import React, { useState, useEffect } from 'react';
import axios from 'axios' // easy to use Json Placeholde API

function Register(props){
    // step1: define states u need 
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    // step2: define execution function
    const onChange_name=(e)=>{
        console.log(e.target)
        setName(e.target.value)
    }
    const onChange_email=(e)=>{
        console.log(e.target)
        setEmail(e.target.value)
    }
    const onChange_password=(e)=>{
        console.log(e.target)
        setPassword(e.target.value)
    }
    const register = (newUser) => {
        return axios
          .post('users/register', {
            name: newUser.name,
            email: newUser.email,
            password: newUser.password
          })
          .then(response => {
            console.log('Registered Succesfully')
          })
      }
      const onSubmit=(e)=>{
        e.preventDefault()
        console.log(e)
        // the json object we need to send to backend
        const newUser = {
            name: name,
            email: email,
            password: password
          }
        // chaining for executing tow or more asynchronous operations back to back
        register(newUser).then(res => {
            console.log('what register function return',res)
            console.log(props.history)
            //navigate the user to /login once they’ve registered for our app.
            props.history.push(`/login`)
          })

    }

    // step3: render JSX
    return(
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5 mx-auto">
                    <form noValidate onSubmit={onSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">請註冊</h1>
                        <div className="form-group">
                            <label htmlFor="name">暱稱</label>
                            <input type="text" 
                            className="form-control" 
                            name="name" 
                            placeholder="Enter your nickname" 
                            value = {name} 
                            onChange = {onChange_name}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">電子郵件</label>
                            <input type="email" 
                            className="form-control" 
                            name="email" 
                            placeholder="Enter email" 
                            value = {email} 
                            onChange = {onChange_email}
                            />
                        </div>
 
                        <div className="form-group">
                            <label htmlFor="password">密碼</label>
                            <input type="password" 
                            className="form-control" 
                            name="password" 
                            placeholder="password" 
                            value = {password} 
                            onChange = {onChange_password}
                            />
                        </div>
                        <button type="submit" className="btn btn-lg btn-primary btn-block">怒註冊一發！</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Register