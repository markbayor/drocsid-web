import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { default as socket } from '../socket'


import { getFriends, getRequests } from '../store/friends'
import { getEmptyChats } from '../store/chats'
import { getPopulatedChat, _sendMessage, _addMessageToChats } from '../store/single_chat'

import { ChatsNavbar, ChatComponent, SearchComponent } from '../components'

import { Layout } from 'antd';


const _ChatsPage = props => {

  useEffect(() => {
    props.loadAll()
    socket.on('message', ({ message, username }) => {
      console.log('MESSAGE', message)
      const chat = props.chats.find(chat => chat.id === message.chatId)
      if (chat) {
        if (props.single_chat.id === message.chatId) {
          props.addMessageToChat({ message, username })
        } else {
          props.addMessageToChats({ message, username })
        }
      }
    })
  }, [])

  return (
    <Layout>
      <ChatsNavbar />
      {props.showSearch ? <SearchComponent /> :
        <ChatComponent single_chat={props.single_chat || null} />
      }
    </Layout>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user,
    friends: state.friends.friends,
    incomingRequests: state.friends.incomingRequests,
    sentRequests: state.friends.sentRequests,
    chats: state.chats,
    single_chat: state.single_chat,
    showSearch: state.search.show
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadAll() {
      dispatch(getFriends())
      dispatch(getRequests())
      dispatch(getEmptyChats())
    },
    loadSingleChat(id) {
      dispatch(getPopulatedChat(id))
    },
    addMessageToChat(data) {
      dispatch(_sendMessage(data))
    },
    addMessageToChats(data) {
      dispatch(_addMessageToChats(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(_ChatsPage)