import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SingupForm'



const Navbar = ({ handleClick, isLoggedIn, tst }) => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showSignUpForm, setShowSignUpForm] = useState(false)

  return (
    <div>
      <h1>DROCSID</h1>
      <nav>
        <div>
          {isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <a href="#" onClick={handleClick}>
                Logout
          </a>
            </div>
          ) : (
              <div>
                {/* The navbar will show these links before you log in */}
                <h2 onClick={() => {
                  setShowLoginForm(!showLoginForm)
                  setShowSignUpForm(false)
                }}>Log in</h2>
                {showLoginForm && <LoginForm />}
                <h2 onClick={() => {
                  setShowSignUpForm(!showSignUpForm)
                  setShowLoginForm(false)
                }}>Sign Up</h2>
                {showSignUpForm && <SignupForm />}
              </div>
            )}
        </div>
      </nav>

      <hr />
    </div>
  )
}
const mapState = state => {
  return {
    isLoggedIn: !!state.user.email
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    tst() {
      dispatch(test())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)
