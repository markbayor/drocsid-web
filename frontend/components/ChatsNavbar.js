import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { getFriends, getRequests } from '../store/friends'
import { getEmptyChats } from '../store/chats'
import { getPopulatedChat } from '../store/single_chat'

import { UserOutlined, CommentOutlined, MessageOutlined, DeleteOutlined, CheckSquareOutlined, CloseSquareOutlined, ArrowDownOutlined, ArrowUpOutlined, TeamOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

const ChatsNavbar = ({ user, friends, chats, incomingRequests, sentRequests, loadAll, loadSingleChat }) => {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  function handleFriendsClick() { }

  function handleChatClick(id) {
    loadSingleChat(id)
  }

  return (
    <Sider style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
    }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <Menu theme="light" mode="inline">
        <SubMenu title={<span><TeamOutlined /><span>Friends</span></span>}>
          <SubMenu title={<span><MailOutlined /><span>Requests</span></span>}>
            <SubMenu title="Sent Requests" title={<span><ArrowUpOutlined /><span>Sent Requests</span></span>}>
              {sentRequests.map((request, idx) => {
                return (
                  <SubMenu key={idx} title={<span>{request.username}</span>}>

                  </SubMenu>
                )
              })}
            </SubMenu>
            <SubMenu title="Incoming Requests" title={<span><ArrowDownOutlined /><span>Incoming requests</span></span>}>
              {incomingRequests.map((request, idx) => {
                return (
                  <SubMenu key={idx} title={<span>{request.username}</span>}>

                  </SubMenu>
                )
              })}
            </SubMenu>
          </SubMenu>
          {friends.map((friend, idx) => <Menu.Item key={idx} icon={<UserOutlined />}>{friend.username}</Menu.Item>)}
        </SubMenu>
      </Menu>
      <Menu theme="light" mode="vertical" onClick={({ key }) => handleChatClick(key)}>
        {chats &&
          chats.map((chat) => {
            let name = ''
            if (chat.users.length === 2) {
              const otherUser = chat.users.find(_user => _user.username !== user.username)
              name = otherUser.username
              return <Menu.Item key={chat.id} icon={<MessageOutlined />}>Chat with {name}</Menu.Item>
            } else {
              return <Menu.Item key={chat.id} icon={<CommentOutlined />}>Groupchat "{chat.name}"</Menu.Item>
            }
          })
        }
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
