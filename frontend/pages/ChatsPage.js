import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { getFriends, getRequests } from '../store/friends'
import { getEmptyChats } from '../store/chats'
import { getPopulatedChat } from '../store/single_chat'

import { ChatsNavbar, ChatComponent } from '../components'

import { Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

const _ChatsPage = props => {

  useEffect(() => {
    props.loadAll()
  }, [])
  return (
    <Layout>
      <Sider><ChatsNavbar /></Sider>
      <Content>
        {/*<ChatComponent chat={props.single_chat || null} /> */}
      </Content>
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
    single_chat: state.single_chat
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(_ChatsPage)