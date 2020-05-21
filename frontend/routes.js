import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'

import { Home } from './pages'
import { Navbar } from './components'
import { me } from './store'

class Routes extends Component {
  async componentDidMount() {
    await this.props.loadInitialData()
  }
  render() {
    const { isLoggedIn } = this.props
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/home" component={Home} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            { /*<Route path="/admin" component={AdminPage} />
        <Route path="/account" component={AccountPage} /> */ }
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        {/* <Route component={Login} /> */}
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    userId: state.user.id,
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.email
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
