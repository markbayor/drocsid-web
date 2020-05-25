import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { default as SearchComponent } from './SearchComponent'
import { getPopulatedChat, sendMessageToChat } from '../store/single_chat'


import { Empty, Form, Layout, List, Avatar, Input, Button } from 'antd';
const { Header, Content, Footer } = Layout;



const ChatComponent = ({ user, single_chat, sendMessage, showSearch }) => {
  const [form] = Form.useForm();
  const [text, setText] = useState('')

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [single_chat.messages])

  function send() {
    sendMessage(single_chat.id, text, user.username)
    setText('')
    form.resetFields()
  }

  return (
    <Layout className="site-layout" style={{ marginLeft: 198 }}>
      <Header className="site-layout-background" style={{ zIndex: 1000, padding: 0, color: 'white', position: 'fixed', top: 64, right: 0, width: 'calc(100vw - 200px)' }}>
        Chat with {single_chat.users && single_chat.users.filter(u => u.username !== user.username).map(u => u.username).join(', ')}

      </Header>
      <Content style={{ margin: '90px 16px 65px ', overflow: 'initial', top: 0 }}>
        {showSearch ? <SearchComponent />
          :
          (<div className="site-layout-background" style={{ padding: '22px 22px 90px 22px', minHeight: 400, backgroundColor: 'white', boxShadow: '0px 0px 8px 1px rgba(138,135,138,1)' }}>
            <List itemLayout="horizontal">
              {single_chat.messages && single_chat.messages.length ? single_chat.messages.map((message, idx) => {
                const isSentByMe = message.userId === user.id

                return (
                  <List.Item key={idx} style={{ marginRight: isSentByMe ? 7 : 'auto', justifyContent: isSentByMe ? 'flex-end' : 'flex-start', margin: 7, backgroundColor: isSentByMe ? '#69c0ff' : '#e6f7ff', padding: 8, border: 1, borderRadius: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                      {!isSentByMe && <Avatar style={{ marginRight: 10 }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      <div>
                        <h4 style={{ textAlign: isSentByMe ? 'right' : 'left' }}>{message.user.username}</h4>
                        <div style={{ textAlign: isSentByMe ? 'right' : 'left', color: isSentByMe ? 'white' : '#595959' }}>{message.text}</div>
                      </div>
                      {isSentByMe && <Avatar style={{ marginLeft: 10 }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    </div>
                  </List.Item>
                )

              }) : <Empty description='No messages yet!' />}
              <div ref={messagesEndRef} />
            </List>

          </div>)
        }
      </Content>
      {single_chat.id && <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' }}>
        <Form form={form} name="horizontal_send_message" autoComplete='off' layout="inline" onFinish={send}>
          <Form.Item
            name="text"
            onChange={e => setText(e.target.value)}
          >
            <Input type='text' allowClear value={text} placeholder="Message" style={{ width: 'calc(100vw - 350px)' }} />
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
    showSearch: state.search.show
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
