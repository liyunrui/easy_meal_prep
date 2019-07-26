import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom'

function Landing(props) {
    const logOut=(e)=>{
        e.preventDefault()
        console.log("localStorage before removeItem", localStorage)
        localStorage.removeItem('usertoken')
        console.log("localStorage after logout", localStorage)
        props.history.push(`/`)
    }
    const loginRegLink = (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
        </ul>
      )
    const userLink = (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              User
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-link">
              Search
            </Link>
          </li>
          <li className="nav-item">
            <a href="" onClick={logOut} className="nav-link">
              Logout
            </a>
          </li>
        </ul>
      )

    return (
    <div className="Landing">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
            <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarsExample10"
            aria-controls="navbarsExample10"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse justify-content-md-center" id="navbarsExample10">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                </ul>
                {localStorage.usertoken ? userLink : loginRegLink}
            </div>
        </nav>
    </div>
    );
}
//If it’s not rendered by React Router, then we won’t have access to history.push. 
// So we need do this by adding withRouter
export default withRouter(Landing)
