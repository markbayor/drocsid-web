import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SingupForm'

import { Popover, Layout, Menu, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const Navbar = ({ handleClick, isLoggedIn, loaded }) => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)

  function handleVisibleChangeLogin(visible) {
    setShowLoginForm(visible)
  }
  function handleVisibleChangeSignup(visible) {
    setShowSignupForm(visible)
  }

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      {isLoggedIn && <Button type="primary" href='/chats'>Go to Chats</Button>}
      {!isLoggedIn &&
        <Popover trigger='click' visible={showLoginForm} content={<LoginForm />} title='login' onVisibleChange={handleVisibleChangeLogin}>
          <Button type="primary" onClick={() => setShowLoginForm(!showLoginForm)}>Log in</Button>
        </Popover>
      }
      {!isLoggedIn &&
        <Popover trigger='click' visible={showSignupForm} content={<SignupForm />} title='login' onVisibleChange={handleVisibleChangeSignup}>
          <Button type="primary" onClick={() => setShowSignupForm(!showSignupForm)}>Sign up</Button>
        </Popover>
      }
      {isLoggedIn && <Button type="primary" onClick={handleClick}>Log out</Button>}
    </Header>
  )
}
const mapState = state => {
  return {
    isLoggedIn: !!state.user.email,
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)