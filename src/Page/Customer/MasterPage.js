import 'antd/dist/antd.css';
import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Menu, Col, Row, Button, Tooltip, Dropdown } from 'antd';
import { Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


export class Menucollapsed extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div>
        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          height: 20,
          onClick: this.toggle,
        })}
      </div>
    )
  }
}



export default function MasterPage(props) {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <Layout>
      <Header className="Header" style={{ backgroundColor: "#1976d2" }}>
        <Menu theme="light" style={{ backgroundColor: "#1976d2" }} mode="horizontal" defaultSelectedKeys={['0']}>

          {/* {collapsed ? <MenuUnfoldOutlined onClick={toggle} /> : <MenuFoldOutlined onClick={toggle} />}
          <Avatar style={{ backgroundColor: '#87d068',marginLeft:500 }} icon={<UserOutlined />} /> */}
          <Row>
            <Col span={12}>
              {collapsed ? <MenuUnfoldOutlined style={{ backgroundColor: "#fff" }} onClick={toggle} /> : <MenuFoldOutlined style={{ backgroundColor: "#fff" }} onClick={toggle} />}
              <img width="70vh" height="30vh" src={`${process.env.PUBLIC_URL}/logo-brand.png`} />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button style={{ color: "#fff" }} type="link" onClick={() => history.push({ pathname: "/customer/issue/create" })}>
                <label style={{ cursor: "pointer" }}>แจ้งปัญหาการใช้งาน</label>
              </Button>
              <Tooltip title="User Profile">
                <Dropdown
                  placement="topCenter"
                  overlayStyle={{ width: 200, boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px" }}
                  overlay={(
                    <Menu mode="inline" theme="light" onMouseOver="">
                      <Button type="text">CustomerName</Button> <br />
                      <hr />
                      <Menu.Item key="1" onClick={() => alert("Profile")}>
                        Profile
                      </Menu.Item>
                      <Menu.Item key="2" onClick={() => alert("Setting")}>
                        Setting
                      </Menu.Item>
                      <hr />
                      <Button type="link" onClick={() => history.push("/Login")}>Log Out</Button> <br />

                    </Menu>
                  )} trigger="click" >
                  <Button type="primary" danger color="red" shape="circle" icon={<UserOutlined />} >
                  </Button>
                </Dropdown>
              </Tooltip>
            </Col>
          </Row>
        </Menu>
      </Header>
      <Layout>
        <Sider theme="light" collapsed={collapsed} style={{textAlign:"center"}}>
          <Col md={{span:24}} style={{backgroundColor:"white", textAlign:"center"}} >
            <Avatar shape={collapsed ? 'circle' : 'square'} size={collapsed ? 'large':120 } icon={<UserOutlined/>} />
          </Col>

          <Menu theme="light" mode="inline" defaultOpenKeys={['sub1']} defaultSelectedKeys={['1']} >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Issue">
              <Menu.Item key="1" onClick={() => history.push({ pathname: '/Customer/Issue/InProgress' })}>
                - InProgress
                  <Badge count={1} style={{ color: "white", backgroundColor: "gray" }}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="2" onClick={() => history.push({ pathname: '/Customer/Issue/Complete' })}>
                - Complete
                  <Badge count={0} style={{ color: "white", backgroundColor: "gray" }}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb> */}
        <Content
          className="site-layout-background"
          style={{
            padding: 0,
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* <div tabIndex="999" id="divProfile" style={{
            position: "fixed", transform: "translate3d(930px, 0px, 0px)",
            display: "none",
            width: 200,
            height: 300,
            zIndex: 1,
            backgroundColor: "rgb(255, 255, 255)",
            boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
            // borderRadius:3,
            // boxSizing:"border-box"
          }}>
            <Button type="link">Profile</Button> <br />
            <Button type="link">Setting</Button> <br />
            <hr />
            <Button type="link" onClick={() => history.push("/Login")}>Log Out</Button> <br />

          </div> */}
          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}
