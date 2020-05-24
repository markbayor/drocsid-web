import React from 'react'

import { Navbar } from './components'
import Routes from './routes'

import 'antd/dist/antd.css';

import { Layout } from 'antd';

const App = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Navbar />
      <Layout style={{ marginTop: 62 }}>
        <Routes />
      </Layout>
    </Layout>
  )
}

export default App
