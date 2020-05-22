import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { getPopulatedChat, sendMessageToChat } from '../store/single_chat'


import { Form, Layout, Menu, List, Avatar, Input, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;


import { UserOutlined } from '@ant-design/icons'

const ChatComponent = ({ user, single_chat, sendMessage }) => {
  const [form] = Form.useForm();
  const [text, setText] = useState('')

  useEffect(() => {

  }, [])

  function send() {
    sendMessage(single_chat.id, text, user.username)
    setText('')
  }
  console.log('SINGLE CHAT', single_chat)

  return (
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ zIndex: 10000, padding: 0, color: 'white', position: 'fixed', top: 50, right: 0, width: 'calc(100vw - 200px)' }}>
        chat menu will go here
      </Header>
      <Content style={{ margin: '24px 16px 65px ', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ padding: 24, backgroundColor: 'white', boxShadow: '0px 0px 8px 1px rgba(138,135,138,1)' }}>
          <List itemLayout="horizontal">
            {single_chat.messages && single_chat.messages.map((message, idx) => {
              const isSentByMe = message.userId === user.id
              // if (isSentByMe) {
              return (
                <List.Item key={idx} >
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} //TODO
                    title={<span>{message.user.username}</span>} //SHOW LEFT OR RIGHT OR CHANGE COLOR FOR MINE OR SOMETHING
                    description={message.text}
                  />
                </List.Item>
              )
              // }
            })}
          </List>

        </div>
      </Content>
      {single_chat.id && <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' }}>
        <Form form={form} name="horizontal_send_message" layout="inline" onFinish={send}>
          <Form.Item
            name="text"

            onChange={e => setText(e.target.value)}
          >
            <Input value={text} placeholder="Message" style={{ width: 'calc(100vw - 350px)' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              Send
              </Button>
          </Form.Item>
        </Form>
      </Footer>}
    </Layout>
  )
}


const mapState = state => {
  return {
    user: state.user,
  }
}

const mapDispatch = dispatch => {
  return {
    loadSingleChat(id) {
      dispatch(getPopulatedChat(id))
    },
    sendMessage(chatId, text, username) {
      dispatch(sendMessageToChat(chatId, text, username))
    }
  }
}

export default connect(mapState, mapDispatch)(ChatComponent)
