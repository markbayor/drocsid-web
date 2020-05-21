import React from 'react'
import { connect } from 'react-redux'

/**
 * COMPONENT
 */
export const Home = props => {
  const { email } = props

  return (
    <div>
      <h2>Welcome, {email}</h2>
      <h3>Go to your chatpage to start chatting with people!!!</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(Home)
