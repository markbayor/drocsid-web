import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { loadSearchResults } from '../store/search'
import { sendRequest } from '../store/friends'

import { UserAddOutlined } from '@ant-design/icons'
import { Empty, message, Avatar, Input, Layout, Button, Form, List } from 'antd'
const { Header, Content } = Layout;

const SearchComponent = ({ search_results, sendReq, user, friends, incomingRequests, sentRequests, searchFriends }) => {
  const [form] = Form.useForm();

  function handleSearch(searchVal) {
    searchFriends(searchVal)
  }

  function handleSendReq(id) {
    sendReq(id)
    message.info('Request sent!')
  }

  return (
    <Layout className="site-layout" style={{ marginLeft: 198 }}>
      <Header className="site-layout-background" style={{ zIndex: 1000, padding: 0, color: 'white', position: 'fixed', top: 64, right: 0, width: 'calc(100vw - 200px)' }}>
        <Form style={{ justifyContent: 'center', marginTop: 12 }} form={form} name="horizontal_send_message" autoComplete='off' layout="inline">
          <Form.Item
            name="text"
            onChange={e => handleSearch(e.target.value)}
          >
            <Input type='text' allowClear placeholder="Enter user's username" style={{ width: 'calc(100vw - 350px)' }} />
          </Form.Item>
        </Form>
      </Header>
      <Content style={{ margin: '100px 16px 65px ', overflow: 'initial', top: 200 }}>
        <div className="site-layout-background" style={{ minHeight: 400, padding: 24, backgroundColor: 'white', boxShadow: '0px 0px 8px 1px rgba(138,135,138,1)' }}>
          <List itemLayout="horizontal">
            {search_results.length ? search_results.filter(result => {
              return !friends.find(f => f.id === result.id) && !incomingRequests.find(r => r.id === result.id) && !sentRequests.find(r => r.id === result.id)
            }).map(result => {
              return (
                <List.Item key={result.id} style={{ padding: 8, border: 1, borderRadius: 5 }}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={result.username}
                  />
                  <Button type='primary' icon={<UserAddOutlined />} onClick={() => handleSendReq(result.id)}>Send friend request</Button>
                </List.Item>
              )
            }) : <Empty description='No results' />
            }
          </List>
        </div>
      </Content>
    </Layout>
  )
}


const mapState = state => {
  return {
    user: state.user,
    friends: state.friends.friends,
    incomingRequests: state.friends.incomingRequests,
    sentRequests: state.friends.sentRequests,
    search_results: state.search.results
  }
}

const mapDispatch = dispatch => {
  return {
    searchFriends(searchVal) {
      dispatch(loadSearchResults(searchVal))
    },
    sendReq(id) {
      dispatch(sendRequest(id))
    }
  }
}

export default connect(mapState, mapDispatch)(SearchComponent)
