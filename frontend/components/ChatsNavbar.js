import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { getFriends, getRequests, acceptRequest, rejectRequest, cancelRequest, deleteFriend } from '../store/friends'
import { getEmptyChats, createTwoPersonChat, deleteTwoPersonChat } from '../store/chats'
import { getPopulatedChat } from '../store/single_chat'
import { setShowSearchComponent } from '../store/search'

import {
  UserOutlined,
  CommentOutlined,
  MessageOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  TeamOutlined,
  MailOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { Collapse, Layout, Menu, Button, } from 'antd';
const { Sider } = Layout;
const { Panel } = Collapse;

const ChatsNavbar = ({ user, friends, chats, showSearch, setShowSearch, incomingRequests, sentRequests, loadAll, loadSingleChat, newTwoPersonChat, acceptReq, rejectReq, cancelReq, deleteFrnd }) => {
  useEffect(() => {
    loadAll()
  }, [])

  const handleAcceptFriendRequest = (id) => acceptReq(id)
  const handleRejectFriendRequest = (id) => rejectReq(id)
  const handleCancelFriendRequest = (id) => cancelReq(id)
  const handleDeleteFriend = (id) => deleteFrnd(id)
  const handleChatClick = (id) => loadSingleChat(id)
  const handleClickOnFriend = (friendId) => {
    const chatExists = chats.find(chat => chat.users.length === 2 && chat.users.find(user => user.id === friendId))
    if (chatExists) {
      loadSingleChat(chatExists.id)
    } else {
      newTwoPersonChat(friendId)
      loadSingleChat(null, friendId)
    }
  }


  return (
    <Sider style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0
    }}>
      <Menu theme="light" mode="inline">
        <Collapse>
          <Panel header={<span><TeamOutlined />{' '}<span>Friends</span></span>} key="1">
            <Button style={{ marginLeft: 19, marginBottom: 12 }} type='primary' icon={<SearchOutlined />} onClick={() => setShowSearch(!showSearch)}>Find friends!</Button>
            <Collapse>
              <Panel header={<span><MailOutlined />{' '}<span>Requests</span></span>} key="1">
                <Collapse>
                  <Panel header={<span><span>Sent</span></span>} key="1">
                    {sentRequests.map((request) => {
                      return (
                        <div key={request.id} style={{ display: 'flex', flexDirection: 'space-around' }}>
                          <h4>{request.username}</h4>{' '}<Button icon={<CloseSquareOutlined />} onClick={() => handleCancelFriendRequest(request.id)}></Button>
                        </div>
                      )
                    })}
                  </Panel>
                </Collapse>
                <Collapse>
                  <Panel header={<span><span>Received</span></span>} key="1">
                    {incomingRequests.map((request) => {
                      return (
                        <div key={request.id} style={{ display: 'flex', flexDirection: 'space-around' }}>
                          <h4>{request.username}</h4>
                          <Button onClick={() => handleAcceptFriendRequest(request.id)} icon={<CheckSquareOutlined />} />
                          <Button onClick={() => handleRejectFriendRequest(request.id)} icon={<CloseSquareOutlined />} />
                        </div>
                      )
                    })}
                  </Panel>
                </Collapse>

              </Panel>
            </Collapse>
            <br />
            {friends.map((friend, idx) => {
              return (
                <Collapse key={friend.id}>
                  <Panel header={<span><UserOutlined />{friend.username}</span>} key={idx}>
                    <Button onClick={() => handleClickOnFriend(friend.id)} icon={<MessageOutlined />}>Chat!</Button>
                    <Button onClick={() => handleDeleteFriend(friend.id)} icon={<DeleteOutlined />}>Delete :(</Button>
                  </Panel>
                </Collapse>
              )
            })
            }
          </Panel>
        </Collapse>
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
    showSearch: state.search.show
  }
}

const mapDispatch = dispatch => {
  return {
    loadAll() {
      dispatch(getFriends())
      dispatch(getRequests())
      dispatch(getEmptyChats())
    },
    loadSingleChat(chatId, friendId) {
      dispatch(getPopulatedChat(chatId, friendId))
    },
    acceptReq(id) {
      dispatch(acceptRequest(id))
    },
    rejectReq(id) {
      dispatch(rejectRequest(id))
    },
    cancelReq(id) {
      dispatch(cancelRequest(id))
    },
    deleteFrnd(friendId) {
      dispatch(deleteFriend(friendId))
      dispatch(deleteTwoPersonChat(friendId))
    },
    newTwoPersonChat(friendId) {
      dispatch(createTwoPersonChat(friendId))
    },
    setShowSearch(bool) {
      dispatch(setShowSearchComponent(bool))
    }
  }
}

export default connect(mapState, mapDispatch)(ChatsNavbar)
