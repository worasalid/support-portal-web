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


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


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
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);
  function showdivProfile() {
    let divProfile = document.getElementById("divProfile")
    if (divProfile.style.display !== "none") {
      divProfile.style.display = "none";
    }
    else {
      divProfile.style.display = "block";
    }
  }

  return (
    <Layout>
      <Header className="Header">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>

          {/* {collapsed ? <MenuUnfoldOutlined onClick={toggle} /> : <MenuFoldOutlined onClick={toggle} />}
          <Avatar style={{ backgroundColor: '#87d068',marginLeft:500 }} icon={<UserOutlined />} /> */}
          <Row>
            <Col span={12}>
              {collapsed ? <MenuUnfoldOutlined onClick={toggle} /> : <MenuFoldOutlined onClick={toggle} />}
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
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

                  <Button type="primary" danger color="red" shape="circle" icon={<UserOutlined />} >
                  </Button>
                </Dropdown>

              </Tooltip>
            </Col>

          </Row>

        </Menu>

      </Header>
      <Layout>
        <Sider theme="light" collapsed={collapsed}>
          <Menu theme="light" mode="inline" defaultOpenKeys={['sub1']} defaultSelectedKeys={['2']} >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Issue">
              <Menu.Item key="1" onClick={() => history.push('/Internal/Issue/Unassign')}>
                Unassign
                  <Badge count={0}>
                  <span style={{ marginLeft: 70, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="2" onClick={() => history.push({ pathname: '/Internal/Issue/MyTask' })}>
                - My Task
                  <Badge count={3}>
                  <span style={{ marginLeft: 77, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="3">
                <span onClick={() => history.push('/Internal/Issue/InProgress')}>- InProgress</span>
                <Badge count={1}>
                  <span style={{ marginLeft: 61, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="4">
                <span onClick={() => newpage()}>- Wait for Info</span>
                <Badge count={0}>
                  <span style={{ marginLeft: 49, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="5">
                <span onClick={() => newpage()}>- On Due</span>
                <Badge count={0}>
                  <span style={{ marginLeft: 79, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="6">
                <span onClick={() => newpage()}>- Over Due</span>
                <Badge count={0}>
                  <span style={{ marginLeft: 68, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="7">
                <span onClick={() => this.newpage()}>- Resolved</span>
                <Badge count={0}>
                  <span style={{ marginLeft: 71, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="8">
                <span onClick={() => newpage()}>- Complete</span>
                <Badge count={0}>
                  <span style={{ marginLeft: 66, textAlign: "right" }}></span>
                </Badge>
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
            padding: 0,
            margin: 0,
            minHeight: 280,
          }}
        >

          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}
