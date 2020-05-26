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
      <h4>Download the <a href='https://anonfiles.com/Zbfdmc3co8/drocsid-darwin-x64-1.0.0_zip'>desktop app</a></h4>
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
