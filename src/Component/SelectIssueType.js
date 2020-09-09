// import React from 'react'
// import {Dropdown, Menu, Card, Meta} from 'antd'
// import { BugOutlined, FileOutlined, DatabaseOutlined } from '@ant-design/icons'

// export default function SelectIssueType() {
//     return (
//         <Dropdown
//         placement="topCenter"
//         overlayStyle={{
//             width: 200,
//             boxShadow:
//                 "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
//         }}
//         overlay={
//             <Menu mode="inline" theme="light" onMouseOver="" >
//                 <Menu.Item key="1" onClick={
//                     () => { return (setTitle("bug"), history.push("/customer/servicedesk/issuecreate/bug")) }}>
//                     <Card hoverable>
//                         <Meta
//                             avatar={
//                                 <BugOutlined style={{ fontSize: 30 }} />
//                             }
//                             title={<label className="card-title-menu">Bug</label>}
//                             description={description}
//                         />
//                     </Card>
//                 </Menu.Item>
//                 <Menu.Item key="2" onClick={
//                     () => { return (setTitle("changerequest"), history.push("/customer/servicedesk/issuecreate/changerequest")) }}>
//                     <Card hoverable >
//                         <Meta
//                             avatar={
//                                 <FileOutlined style={{ fontSize: 30 }} />
//                             }
//                             title={<label className="card-title-menu">Change Request</label>}
//                             description={description}
//                         />
//                     </Card>
//                 </Menu.Item>
//                 <Menu.Item key="3" onClick={
//                     () => { return (setTitle("data"), history.push("/customer/servicedesk/issuecreate/data")) }}>
//                     <Card className="card-box" hoverable>
//                         <Meta
//                             avatar={
//                                 <DatabaseOutlined style={{ fontSize: 30 }} />
//                             }
//                             title={<label className="card-title-menu">Data</label>}
//                             description={description}
//                         />
//                     </Card>
//                 </Menu.Item>
//                 <Menu.Item key="4" onClick={
//                     () => { return (setTitle("use"), history.push("/customer/servicedesk/issuecreate/use")) }}>
//                     <Card hoverable style={{ width: "100%", marginTop: 16 }} >
//                         <Meta
//                             avatar={
//                                 <PhoneOutlined style={{ fontSize: 30 }} />
//                             }
//                             title={<label style={{ color: "rgb(0, 116, 224)" }}>Use</label>}
//                             description={description}
//                         />
//                     </Card>
//                 </Menu.Item>
//             </Menu>
//         }
//         trigger="click"
        
//     >
//         <Card className="card-box" hoverable>
//             <Meta
//                 avatar={
//                     `${title}` === "bug" ? <BugOutlined style={{ fontSize: 30 }} /> :
//                         `${title}` === "changequest" ? <FileOutlined style={{ fontSize: 30 }} /> :
//                             `${title}` === "data" ? <DatabaseOutlined style={{ fontSize: 30 }} /> :
//                                 <PhoneOutlined style={{ fontSize: 30 }} />
//                 }
//                 title={
//                     <label className="card-title-menu">
//                         {
//                             `${title}` === "bug" ? "Bug" :
//                                 `${title}` === "changerequest" ? "Change Request" :
//                                     `${title}` === "data" ? "Data" :
//                                         `${title}` === "use" ? "Use" : ""
//                         }
//                     </label>
//                 }
//                 description={description}
//             />
//         </Card>

//     </Dropdown>

//     )
// }
