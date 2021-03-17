import { BarChartOutlined, NotificationOutlined,PieChartOutlined, FileOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Dropdown, Layout, Menu, Row, Tooltip, Divider, List } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import AuthenContext from "../../utility/authenContext";
import IssueContext from '../../utility/issueContext';
//import IssueContext, { customerReducer, customerState } from "../../utility/issueContext";
import Axios from "axios";
import MasterContext from "../../utility/masterContext";
import Notifications from "../../Component/Notifications/Customer/Notification";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function MasterPage({bgColor='#fff',...props}) {
  const history = useHistory();
  const match = useRouteMatch();
  const [show_notice, setshow_notice] = useState(true);
  const { state, dispatch } = useContext(AuthenContext);
  //const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext)
  const [activemenu, setActivemenu] = useState([])

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
          type: "customer"
        }
      });
      masterdispatch({ type: "COUNT_MYTASK", payload: countstatus.data.filter((x) => x.MailType === "in" && x.GroupStatus !== "Complete").length });
      masterdispatch({ type: "COUNT_INPROGRESS", payload: countstatus.data.filter((x) => x.MailType === "out" && (x.GroupStatus === "InProgress" || x.GroupStatus === "ReOpen")).length });
      masterdispatch({ type: "COUNT_PASS", payload: countstatus.data.filter((x) => x.MailType === "out" && x.GroupStatus === "Pass").length });
      masterdispatch({ type: "COUNT_CANCEL", payload: countstatus.data.filter((x) => x.GroupStatus === "Cancel").length });
      masterdispatch({ type: "COUNT_COMPLETE", payload: countstatus.data.filter((x) => x.MailType === "out" && x.GroupStatus === "Complete").length })

    } catch (error) {

    }
  }

  const GetNotifications = async () => {
    try {
      const notification = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/countstatus",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        }
      });
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
    if (match.url.search("alltask") > 0) {
      setActivemenu(activemenu.push("2"))
    }
    if (match.url.search("mytask") > 0) {
      setActivemenu(activemenu.push("3"))
    }
    if (match.url.search("inprogress") > 0) {
      setActivemenu(activemenu.push("4"))
    }
    if (match.url.search("pass") > 0) {
      setActivemenu(activemenu.push("5"))
    }
    if (match.url.search("cancel") > 0) {
      setActivemenu(activemenu.push("6"))
    }
    if (match.url.search("complete") > 0) {
      setActivemenu(activemenu.push("7"))
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
                src={`${process.env.PUBLIC_URL}/logo-space.png`}
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
                      <Menu.Item key="1">
                        <div>
                          <label style={{ fontSize: 24, fontWeight: "bold" }}>Notifications</label><br />
                          <div style={{ height: "50vh", overflowY: "scroll" }}>
                            <Row style={{ padding: 16 }}>
                              <Col span={24}>

                                <Notifications />
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Menu.Item>
                    </Menu>
                  )} trigger="click">

                  <Button type="text" style={{ marginRight: 15 }} size="middle"
                    icon={<Badge dot={show_notice}><NotificationOutlined style={{ fontSize: 20 }} /></Badge>}
                  >
                  </Button>
                </Dropdown>
              </Tooltip>
              {/* <Dropdown
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
                     {state?.usersdata?.users.first_name + ' ' + state?.usersdata?.users.last_name}
                    <Divider style={{ margin: 4 }} />
                    <Menu.Item key="2" onClick={() => history.push("/Login")}>
                      Log Out
                    </Menu.Item>
                  </Menu>
                }
                trigger="click"
              >
                <Button type="link" >
                  <div style={{ display: "inline-block", alignItems: "center" }}>
                    <Avatar size={48} icon={state?.usersdata?.users?.email.substring(0, 1).toLocaleUpperCase()}>

                    </Avatar>
                  </div>
                  <div style={{ display: "inline-block", marginLeft: 8 }}>
                    <label className="user-login">
                      {state?.usersdata?.users.first_name + ' ' + state?.usersdata?.users.last_name}
                    </label>
                  </div>
                </Button>
              </Dropdown> */}
              <div style={{ display: "inline-block", alignItems: "center" }}>
                    <Avatar size={48} icon={state?.usersdata?.users?.email.substring(0, 1).toLocaleUpperCase()}>

                    </Avatar>
                  </div>
                  <div style={{ display: "inline-block", marginLeft: 8 }}>
                    <label className="user-login">
                      {state?.usersdata?.users.first_name + ' ' + state?.usersdata?.users.last_name}
                    </label>
                  </div>
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
            <SubMenu key="sub0" icon={<PieChartOutlined />} title="DashBoard">
              <Menu.Item key="0" onClick={() => history.push('/customer/dashboard')}>
                - DashBoard
                
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub1" icon={<FileOutlined />} title="Issues">
              <Menu.Item
                key="2"
                onClick={() =>  history.push('/customer/issue/alltask')
                  // {
                  //   return ( history.push({ pathname: "/customer/issue/allmytask" }), window.location.reload(true)) 
                  // }
                  
                }
              >
                All Task
               

              </Menu.Item>
              <Menu.Item
                key="3"
                onClick={() => history.push('/customer/issue/mytask')
                  // {
                  //   return ( history.push({ pathname: "/customer/issue/mytask" }), window.location.reload(true)) 
                  // }
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
                key="4"
                onClick={() =>
                  // history.push({ pathname: "/customer/issue/inprogress" })
                  history.push('/customer/issue/inprogress')
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
                key="5"
                onClick={() =>  history.push('/customer/issue/pass')
                  // {
                  //   return ( history.push({ pathname: "/customer/issue/pass" }), window.location.reload(true)) 
                  // }
                }
              >
                Resolved
                {
                  masterstate.toolbar.sider_menu.issue.pass.count === 0
                    ? ""
                    : <span>{` (${masterstate.toolbar.sider_menu.issue.pass.count})`}</span>

                }
              </Menu.Item>
              <Menu.Item
                key="6"
                onClick={() =>
                  {
                    return ( history.push({ pathname: "/customer/issue/cancel" }), window.location.reload(true)) 
                  }
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
                key="7"
                onClick={() => history.push('/customer/issue/complete')
                  // {
                  //   return ( history.push({ pathname: "/customer/issue/complete" }), window.location.reload(true)) 
                  // }
                }
              >
                Completed
              </Menu.Item>
            </SubMenu>
            {/* <SubMenu key="sub2" icon={<BarChartOutlined />} title="Report">
              <Menu.Item key="10" onClick={() => history.push('/customer/report/charts')}>
                - Report
                  <Badge count={1}>
                  <span style={{ marginLeft: 60, textAlign: "right" }}></span>
                </Badge>
              </Menu.Item>
            </SubMenu> */}
          </Menu>
        </Sider>


        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,

            backgroundColor: bgColor,
            // backgroundColor: "#fff",
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}
