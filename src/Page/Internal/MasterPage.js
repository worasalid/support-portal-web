import 'antd/dist/antd.css';
import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Menu, Col, Row, Breadcrumb, Button, Tooltip, Dropdown } from 'antd';
import { Avatar, Badge } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, TwitterOutlined, SlidersTwoTone } from '@ant-design/icons';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined
} from '@ant-design/icons';




function newpage() {
  alert();
}


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
  const { SubMenu } = Menu;
  const { Header, Content, Sider } = Layout;

  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const [show_notice,setshow_notice] = useState(true)

  const toggle = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#0099FF" }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['0']} style={{ backgroundColor: "#0099FF" }}>
          <Row>
            <Col span={12}>
              {collapsed ? <MenuUnfoldOutlined onClick={toggle} /> : <MenuFoldOutlined onClick={toggle} />}
              <img
                style={{ height: "35px" }}
                src={`${process.env.PUBLIC_URL}/logo-brand.png`}
                alt=""
              />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>

              <Tooltip title="Notifications">
                <Dropdown
                  placement="bottomCenter"
                  overlayStyle={{ width: 500, height: 400 }}
                  overlay={(
                    <Menu mode="inline" theme="light" style={{ width: 500, height: 400 }}>
                      <Menu.Item key="1" onClick={() => alert("Profile")}>
                        <div style={{ height: "50vh", overflowY: "scroll" }}>
                          <Row style={{ padding: 16 }}>
                            <Col span={24}>
                              <label style={{ fontSize: 24, fontWeight: "bold" }}>Notifications</label><br/>

                            </Col>
                          </Row>
                        </div>
                      </Menu.Item>
                    </Menu>
                  )} trigger="click">

                  <Button type="text" style={{ marginRight: 20 }} size="middle"
                    icon={<Badge dot={show_notice}><NotificationOutlined style={{ fontSize: 20 }} /></Badge>}
                  >
                  </Button>
                </Dropdown>
              </Tooltip>

              <Tooltip title="User Profile">
                <Dropdown
                  placement="topCenter"
                  overlayStyle={{ width: 200, boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px" }}
                  overlay={(
                    <Menu mode="inline" theme="light" onMouseOver="">
                      <Button type="text">UserName</Button> <br />
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
                  )} trigger="click">

                  <Button type="primary" danger color="red" shape="circle" size="middle" icon={<UserOutlined />} >
                  </Button>
                </Dropdown>
              </Tooltip>
            </Col>
          </Row>
        </Menu>
      </Header>
      <Layout>
        <Sider theme="light" style={{ textAlign: "center", height: "100%", borderRight: "1px solid", borderColor: "#CBC6C5" }} width={200}>
          <Menu theme="light" mode="inline" defaultOpenKeys={['sub1']} defaultSelectedKeys={['2']} >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Issue">
              <Menu.Item key="1" onClick={() => history.push('/Internal/Issue/Unassign')}>
                Unassign
                  <Badge count={0}>
                  <span style={{ marginLeft: 70, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="2" onClick={() => history.push({ pathname: '/Internal/Issue/MyTask' })}>
                - My Task (3)
              </Menu.Item>
              <Menu.Item key="3">
                <span onClick={() => history.push('/Internal/Issue/InProgress')}>- InProgress (1)</span>
              </Menu.Item>
              <Menu.Item key="4">
                <span onClick={() => newpage()}>- Wait for Info</span>
              </Menu.Item>
              <Menu.Item key="5">
                <span onClick={() => newpage()}>- On Due</span>
              </Menu.Item>
              <Menu.Item key="6">
                <span onClick={() => newpage()}>- Over Due</span>
              </Menu.Item>
              <Menu.Item key="7">
                <span onClick={() => this.newpage()}>- Resolved</span>
              </Menu.Item>
              <Menu.Item key="8">
                <span onClick={() => newpage()}>- Complete</span>
              </Menu.Item>
              <Menu.Item key="9">
                <span onClick={() => history.push('/test')}>- Test</span>
                <Badge count={0}>
                  <span style={{ marginLeft: 66, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UserOutlined />} title="Report">
              <Menu.Item key="1" onClick={() => history.push('/Issue/Unassign')}>
                - InProgress
                  <Badge count={1}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="1" onClick={() => history.push('/Issue/Unassign')}>
                - Complete
                  <Badge count={1}>
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
            padding: 24,
            margin: 0,
            minHeight: 280,
            backgroundColor: "#fff",
          }}
        >

          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}
