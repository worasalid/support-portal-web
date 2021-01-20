import 'antd/dist/antd.css';
import React, { Component, useState, useContext, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Layout, Menu, Col, Row, Button, Tooltip, Dropdown } from 'antd';
import { Badge, Avatar } from 'antd';
import { UserOutlined, NotificationOutlined, SettingOutlined, FileOutlined, AuditOutlined, BarChartOutlined } from '@ant-design/icons';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Axios from 'axios';
import AuthenContext from "../../utility/authenContext";
import MasterContext from "../../utility/masterContext";


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
  const match = useRouteMatch();
  const { state, dispatch } = useContext(AuthenContext);
  const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);

  const [collapsed, setCollapsed] = useState(false);
  const [show_notice, setshow_notice] = useState(true)
  const [activemenu, setActivemenu] = useState([])
  const [active_submenu, setActive_submenu] = useState([])


  const toggle = () => setCollapsed(!collapsed);

  const getuser = async () => {
    try {
      const result = await Axios({
        url: process.env.REACT_APP_API_URL + "/auth/customer/me",
        method: "get",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
      });
      dispatch({ type: 'Authen', payload: true });
      dispatch({ type: 'LOGIN', payload: result.data.usersdata });
    } catch (error) {

    }
  }

  const CountStatus = async () => {
    try {
      const countstatus = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/countstatus",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          type: "user"
        }
      });
      masterdispatch({ type: "COUNT_MYTASK", payload: countstatus.data.filter((x) => x.MailType === "in").length });
      masterdispatch({ type: "COUNT_INPROGRESS", payload: countstatus.data.filter((x) => x.MailType === "out" && (x.InternalStatus === "InProgress" || x.InternalStatus === "ReOpen")).length });
      masterdispatch({ type: "COUNT_RESOLVED", payload: countstatus.data.filter((x) => x.MailType === "out" && (x.InternalStatus === "Resolved" || x.InternalStatus === "Pass" || x.InternalStatus === "Deploy")).length });
      masterdispatch({ type: "COUNT_CANCEL", payload: countstatus.data.filter((x) => x.InternalStatus === "Cancel").length });
      masterdispatch({ type: "COUNT_COMPLETE", payload: countstatus.data.filter((x) => x.InternalStatus === "Complete").length })

    } catch (error) {

    }
  }

  useEffect(() => {
    if (!state.authen) {
      getuser()
    }
    getuser();
    CountStatus();
  }, [])



  useEffect(() => {
    if (match.url.search("mytask") > 0) {
      setActive_submenu(active_submenu.push("1"))
    }
    if (match.url.search("inprogress") > 0) {
      setActive_submenu(active_submenu.push("2"))
    }
    if (match.url.search("resolved") > 0) {
      setActive_submenu(active_submenu.push("3"))
    }
    if (match.url.search("cancel") > 0) {
      setActive_submenu(active_submenu.push("4"))
    }
    if (match.url.search("complete") > 0) {
      setActive_submenu(active_submenu.push("5"))
    }
    if (match.url.search("ricef") > 0) {
      setActive_submenu(active_submenu.push("6"))
    }


  }, [])


  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#0099FF" }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['0']} style={{ backgroundColor: "#0099FF" }}>
          <Row>
            <Col span={12}>

              {/* {collapsed ? <MenuUnfoldOutlined onClick={toggle} /> : <MenuFoldOutlined onClick={toggle} />} */}
              <img
                style={{ height: "35px" }}
                src={`${process.env.PUBLIC_URL}/logo-space.jpg`}
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
                              <label style={{ fontSize: 24, fontWeight: "bold" }}>Notifications</label><br />

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
                      <Button type="text">{state.usersdata && `${state.usersdata?.users.first_name} ${state.usersdata?.users.last_name}`}</Button> <br />
                      <hr />
                      <Menu.Item key="1" onClick={() => history.push({ pathname: "/internal/user/profile" })}>
                        Profile
                      </Menu.Item>
                      <Menu.Item key="2" onClick={() => alert("Setting")}>
                        Setting
                      </Menu.Item>
                      <hr />
                      <Button type="link" onClick={() => history.push("/Login")}>Log Out</Button> <br />
                    </Menu>
                  )} trigger="click">

                  <Button type="text" ghost >
                    {/* <Avatar style={{ backgroundColor: '#87d068', display: state?.usersdata?.users?.profile_image !== "" ? "block" : "none"}}
                      size={48} src={state?.usersdata?.users?.profile_image} /> */}
                    {/* <Avatar  style={{ backgroundColor: '#87d068', display: state?.usersdata?.users?.profile_image === undefined ? "block" : "none"}}
                      size={48} icon={<UserOutlined />} /> */}

                    <Avatar 
                      size={48} icon={<UserOutlined />} />
                  </Button>


                </Dropdown>
                &nbsp;<label className="user-login">{state.usersdata && `${state.usersdata?.users.first_name} ${state.usersdata?.users.last_name}`}</label>
              </Tooltip>

            </Col>
          </Row>
        </Menu>
      </Header>
      <Layout>
        <Sider theme="light" style={{ textAlign: "center", height: "100%", borderRight: "1px solid", borderColor: "#CBC6C5" }} width={200}>
          <Menu theme="light" mode="inline"
            defaultOpenKeys={activemenu}
            defaultSelectedKeys={active_submenu}

          >
            <SubMenu key="sub1" icon={<FileOutlined />} title="Issue">
              <Menu.Item key="1" onClick={() => history.push({ pathname: '/internal/issue/mytask' })}>
                My Task
                {
                  masterstate.toolbar.sider_menu.issue.mytask.count === 0
                    ? ""
                    : <span>{` (${masterstate.toolbar.sider_menu.issue.mytask.count})`}</span>

                }
              </Menu.Item>
              <Menu.Item key="2" onClick={() => history.push('/internal/issue/inprogress')}>
                In progress
                {
                  masterstate.toolbar.sider_menu.issue.inprogress.count === 0
                    ? ""
                    : <span>{` (${masterstate.toolbar.sider_menu.issue.inprogress.count})`}</span>

                }
              </Menu.Item>

              <Menu.Item key="3" onClick={() => history.push('/internal/issue/resolved')}>
                Resolved
                {
                  masterstate.toolbar.sider_menu.issue.resolved.count === 0
                    ? ""
                    : <span>{` (${masterstate.toolbar.sider_menu.issue.resolved.count})`}</span>

                }
              </Menu.Item>
              <Menu.Item key="4" onClick={() => history.push('/internal/issue/cancel')}>
                Cancel
                {
                  masterstate.toolbar.sider_menu.issue.cancel.count === 0
                    ? ""
                    : <span>{` (${masterstate.toolbar.sider_menu.issue.cancel.count})`}</span>

                }
              </Menu.Item>
              <Menu.Item key="5" onClick={() => history.push('/internal/issue/complete')}>
                <span >Complete</span>
              </Menu.Item>

            </SubMenu>

            <SubMenu
              style={{
                display: state.usersdata?.organize.OrganizeCode === "consult" ||
                  state.usersdata?.organize.OrganizeCode === "dev" ? "block" : "none"
              }}
              key="sub2" icon={<AuditOutlined />} title="RICEF">
              <Menu.Item key="6" onClick={() => history.push('/internal/ricef')}>
                - All Task
                  <Badge count={1}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="7" onClick={() => history.push('/internal/ricef/mytask')}>
                - My Task
                  <Badge count={1}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
              <Menu.Item key="8" onClick={() => history.push('/internal/ricef/inprogress')}>
                - InProgress
                  <Badge count={1}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="sub3" icon={<BarChartOutlined />} title="Report">
              <Menu.Item key="10" onClick={() => history.push('/internal/report/charts')}>
                - Report
                  <Badge count={1}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" icon={<SettingOutlined />} title="Setting">
              <Menu.Item key="11" onClick={() => history.push('/internal/issue/setting/mastercompany')}>
                - ข้อมูลบริษัท
              </Menu.Item>
              <Menu.Item key="12" onClick={() => history.push('/internal/issue/setting/mapcompany')}>
                - Mapping Support
              </Menu.Item>
              <Menu.Item key="13" onClick={() => history.push('/internal/issue/setting/mapdeveloper')}>
                - Mapping Developer
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
