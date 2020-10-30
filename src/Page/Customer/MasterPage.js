import { UserOutlined, NotificationOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Divider, } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import axios from 'axios'
import AuthenContext from "../../utility/authenContext";
import Axios from "axios";
import MasterContext from "../../utility/masterContext";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function MasterPage(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const [show_notice, setshow_notice] = useState(true);
  const { state, dispatch } = useContext(AuthenContext);
  const {state: masterstate, dispatch: masterdispatch} = useContext(MasterContext)
  const userlogin = state.user
  const [activemenu, setActivemenu] = useState([])

  const getuser = async () => {
    try {
      const result = await axios({
        url: process.env.REACT_APP_API_URL + "/auth/customer/me",
        method: "get",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
      });
      dispatch({ type: 'Authen', payload: true });
      dispatch({ type: 'LOGIN', payload: result.data.users });
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
        }
      });
      masterdispatch({type: "COUNT_MYTASK", payload: countstatus.data.filter((x) => x.MailType === "in" && x.GroupStatus !== "Complete").length});
      masterdispatch({type: "COUNT_INPROGRESS", payload: countstatus.data.filter((x) => x.MailType === "out" && x.GroupStatus === "InProgress").length});
      masterdispatch({type: "COUNT_CANCEL", payload: countstatus.data.filter((x) => x.GroupStatus === "Cancel").length});
      masterdispatch({type: "COUNT_COMPLETE", payload: countstatus.data.filter((x) => x.MailType === "out" && x.GroupStatus === "Complete").length})

    } catch (error) {

    }
  }


  useEffect(() => {
    if (!state.authen) {
      getuser()
    }
    CountStatus();
  }, [])

  useEffect(() => {
    if (match.url.search("mytask") > 0) {
      setActivemenu(activemenu.push("1"))
    }
    if (match.url.search("inprogress") > 0) {
      setActivemenu(activemenu.push("2"))
    }
    if (match.url.search("cancel") > 0) {
      setActivemenu(activemenu.push("3"))
    }
    if (match.url.search("complete") > 0) {
      setActivemenu(activemenu.push("4"))
    }
  }, [])
  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#1a73e8" }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["0"]} style={{ backgroundColor: "#1a73e8" }}>
          <Row>
            <Col span={12}>
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
                              <label style={{ fontSize: 24, fontWeight: "bold" }}>Notifications</label><br />

                            </Col>
                          </Row>
                        </div>
                      </Menu.Item>
                    </Menu>
                  )} trigger="click">

                  <Button type="text" style={{ marginRight: 5 }} size="middle"
                    icon={<Badge dot={show_notice}><NotificationOutlined style={{ fontSize: 20 }} /></Badge>}
                  >
                  </Button>
                </Dropdown>
              </Tooltip>
              <Dropdown
                placement="topCenter"
                overlayStyle={{
                  width: 200,
                  boxShadow:
                    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
                }}
                overlay={
                  <Menu mode="inline" theme="light" onMouseOver="">
                    <Menu.Item key="1" onClick={() => alert("Profile")}>
                      Profile
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => alert("Setting")}>
                      Setting
                    </Menu.Item>
                    <Divider style={{ margin: 4 }} />
                    <Menu.Item key="2" onClick={() => history.push("/Login")}>
                      Log Out
                    </Menu.Item>
                  </Menu>
                }
                trigger="click"
              >
                <Button type="link" >
                  {/* <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="user-login">
                      {state.user && state.user.users.first_name + ' ' + state.user.users.last_name}
                    </label>
                    <Avatar size="default" icon={<UserOutlined/>}>

                    </Avatar>
                 
                  </div> */}
                  <div
                    style={{
                      textAlign: "right",
                      padding: "16px",
                    }}>
                    <label className="user-login">
                      {userlogin && userlogin.first_name + ' ' + userlogin.last_name}
                    </label>
                    <Avatar size="default" icon={<UserOutlined />}></Avatar>

                  </div>
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Menu>
      </Header>
      <Layout >
        <Sider theme="light" style={{ textAlign: "center", height: "100%", borderRight: "1px solid", borderColor: "#CBC6C5" }} width={200}>
          <Menu
            theme="light"
            mode="inline"
            defaultOpenKeys={["sub1"]}
            // defaultSelectedKeys={["3"]}
            defaultSelectedKeys={activemenu}
          >
            <div style={{ padding: 16, paddingTop: 24 }}>
              <Button
                type="primary"
                block
                size="large"
                ghost
                onClick={() =>
                  history.push({ pathname: "/customer/servicedesk/issuemenu" })
                }
              >
                แจ้งปัญหาการใช้งาน
              </Button>
            </div>

            <SubMenu key="sub1" title="Issues">
              <Menu.Item
                key="1"
                onClick={() =>
                  history.push({ pathname: "/customer/issue/mytask" })
                }
              >
                My Task 
                {
                  masterstate.toolbar.sider_menu.issue.mytask.count === 0
                  ? ""
                  : <span>{` (${masterstate.toolbar.sider_menu.issue.mytask.count})`}</span>

                }
              
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() =>
                  history.push({ pathname: "/customer/issue/inprogress" })
                }
              >
                In progress 
                {
                  masterstate.toolbar.sider_menu.issue.inprogress.count === 0
                  ? ""
                  : <span>{` (${masterstate.toolbar.sider_menu.issue.inprogress.count})`}</span>

                }
              </Menu.Item>
              <Menu.Item
                key="3"
                onClick={() =>
                  history.push({ pathname: "/customer/issue/cancel" })
                }
              >
                Cancel
                {
                  masterstate.toolbar.sider_menu.issue.cancel.count === 0
                  ? ""
                  : <span>{` (${masterstate.toolbar.sider_menu.issue.cancel.count})`}</span>

                }
              </Menu.Item>
              <Menu.Item
                key="4"
                onClick={() =>
                  history.push({ pathname: "/customer/issue/complete" })
                }
              >
                Completed 
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
  );
}
