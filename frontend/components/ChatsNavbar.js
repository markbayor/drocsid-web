import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getFriends, getRequests } from '../store/friends'
import { getEmptyChats } from '../store/chats'
import { getPopulatedChat } from '../store/single_chat'

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

const ChatsNavbar = ({ user, friends, chats, incomingRequests, sentRequests, loadAll }) => {

  useEffect(() => {
    loadAll()
  }, [])

  return (
    <Sider style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
    }}>
      <Menu theme="dark" mode="inline">
        <SubMenu title="Friends">
          <SubMenu title="Requests">
            <SubMenu title="Incoming Requests">
              {incomingRequests.map(request => <Menu.Item>{request.username}</Menu.Item>)}
            </SubMenu>
            <SubMenu title="Sent Requests">
              {sentRequests.map(request => <Menu.Item>{request.username}</Menu.Item>)}
            </SubMenu>
          </SubMenu>
          {friends.map(friend => <Menu.Item>Chat with {friend.username}</Menu.Item>)}
        </SubMenu>
      </Menu>
    </Sider>
  )
}

const mapState = state => {
  return {
    user: state.user,
    friends: state.friends.friends,
    incomingRequests: state.friends.incomingRequests,
    sentRequests: state.friends.sentRequests,
    chats: state.chats,
  }
}

const mapDispatch = dispatch => {
  return {
    loadAll() {
      dispatch(getFriends())
      dispatch(getRequests())
      dispatch(getEmptyChats())
    },
    loadSingleChat(id) {
      dispatch(getPopulatedChat(id))
    }
  }
}

export default connect(mapState, mapDispatch)(ChatsNavbar)
