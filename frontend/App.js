import React from 'react'

import { Navbar } from './components'
import Routes from './routes'

import 'antd/dist/antd.css';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  return (
    <Layout>
      <Navbar />
      <Layout style={{ marginTop: 62 }}>
        <Routes />
      </Layout>
    </Layout>
  )
}

export default App
