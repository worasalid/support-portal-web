import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  Tooltip,
  Divider,
} from "antd";
import React from "react";
import { useHistory } from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function MasterPage(props) {
  const history = useHistory();

  return (
    <Layout>
      <Header style={{ backgroundColor: "#fff" }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["0"]}>
          <Row>
            <Col span={12}>
              <img
                style={{ height: "35px" }}
                src={`${process.env.PUBLIC_URL}/logo-brand.png`}
                alt=""
              />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
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
                <Button type="link">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined style={{ marginRight: 8 }} /> Worasalid
                  </div>
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Menu>
      </Header>
      <Layout>
        <Sider theme="light" style={{ textAlign: "center" }} width={250}>
          <Menu
            theme="light"
            mode="inline"
            defaultOpenKeys={["sub1"]}
            defaultSelectedKeys={["1"]}
          >
            <div style={{ padding: 16, paddingTop: 24 }}>
              <Button
                type="primary"
                block
                size="large"
                ghost
                onClick={() =>
                  history.push({ pathname: "/customer/issue/create" })
                }
              >
                แจ้งปัญหาการใช้งาน
              </Button>
            </div>
            <SubMenu key="sub1" title="Issues">
              <Menu.Item
                key="1"
                onClick={() =>
                  history.push({ pathname: "/Customer/Issue/InProgress" })
                }
              >
                In progress <span>(1)</span>
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() =>
                  history.push({ pathname: "/Customer/Issue/Complete" })
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
