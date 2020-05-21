import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

const ChatsNavbar = ({ handleClick, isLoggedIn }) => (
  <div>
    <hr />

  </div>
)

const mapState = state => {
  return {
    isLoggedIn: !!state.user.email,
    chats: state.chats
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {

    }
  }
}

export default connect(mapState, mapDispatch)(ChatsNavbar)
