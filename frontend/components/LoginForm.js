import React from 'react'
import { connect } from 'react-redux'
import { login } from '../store'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

/**
 * COMPONENT
 */
const _LoginForm = props => {
  const { handleSubmit, error } = props

  return (
    <Form name='normal_login' className='login-form' initialValues={{ remember: true }} onFinish={handleSubmit} >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your email' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" >
          Log in
          </Button>
      </Form.Item>
      {error && error.response && <div> {error.response.data} </div>}
    </Form>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      const email = evt.email
      const password = evt.password
      dispatch(login(email, password))
    }
  }
}

export const LoginForm = connect(mapLogin, mapDispatch)(_LoginForm)
