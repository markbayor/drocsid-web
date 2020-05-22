import React from 'react'
import { connect } from 'react-redux'
import { signup } from '../store'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
/**
 * COMPONENT
 */
const _SignupForm = props => {
  const { handleSubmit, error } = props

  return (
    <Form name='normal_signup' className='signup-form' initialValues={{ remember: true }} onFinish={handleSubmit} >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
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
        <Button type="primary" htmlType="submit" className="login-form-button">
          Sign up
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

const mapSignup = state => {
  return {
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      const username = evt.username
      const email = evt.email
      const password = evt.password
      dispatch(signup(username, email, password))
    }
  }
}

export const SignupForm = connect(mapSignup, mapDispatch)(_SignupForm)