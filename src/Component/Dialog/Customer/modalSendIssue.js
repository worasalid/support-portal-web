import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';
import TextEditor from '../../TextEditor';



export default function ModalSendIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
  const history = useHistory();
  const uploadRef = useRef(null);
  const editorRef = useRef(null)
  //const [textValue, setTextValue] = useState("")
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);

  // const handleEditorChange = (content, editor) => {
  //   setTextValue(content);
  // }

  const SaveComment = async () => {
    try {
      if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null) {
        await Axios({
          url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
          },
          data: {
            ticketid: details && details.ticketid,
            comment_text: editorRef.current.getValue(),
            comment_type: "customer",
            files: uploadRef.current.getFiles().map((n) => n.response.id),
          }
        });
      }
    } catch (error) {

    }
  }

  const SendFlow = async () => {
    try {
      const sendflow = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/customer-send",
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: details.ticketid,
          mailboxid: details.mailboxid,
          flowoutputid: details.flowoutputid
        }
      });

      if(sendflow.status === 200){
        SaveComment();
        onOk();
        if(details.flowoutput.value === "AssignIcon" || details.flowoutput.value === "Continue"){
          await Modal.info({
            title: 'บันทึกข้อมูลสำเร็จ',
            content: (
              <div>
                <p>ส่ง Issue เลขที่ : {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number}</p>
                <p>ให้ ICON ดำเนินการแก้ไข</p>
              </div>
            ),
            onOk() {
              editorRef.current.setvalue()
              onOk();
                history.push({ pathname: "/customer/issue/inprogress" })
            },
          });
        }
        if(details.flowoutput.value === "SendInfo"){
          await Modal.info({
            title: 'บันทึกข้อมูลสำเร็จ',
            content: (
              <div>
                <p>ส่งข้อมูลเพิ่มเติม ให้ ICON ดำเนินการต่อ</p>
              </div>
            ),
            onOk() {
              editorRef.current.setvalue()
              onOk();
              history.push({ pathname: "/customer/issue/inprogress" })
  
            },
          });
        }
        if(details.flowoutput.value === "Hold"){
          await Modal.info({
            title: 'บันทึกข้อมูลสำเร็จ',
            content: (
              <div>
                <p>Hold Issue เลขที่: {customerstate.issuedata.details[0].Number}</p>
              </div>
            ),
            onOk() {
              editorRef.current.setvalue()
              onOk();
              history.push({ pathname: "/customer/issue/mytask" })
  
            },
          });
        }
        if(details.flowoutput.value === "Pass"){
          await Modal.info({
            title: 'บันทึกข้อมูลสำเร็จ',
            content: (
              <div>
                <p>ทดสอบ Issue เลขที่ : {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number} ผ่าน</p>
                <p>รอดำเนินการ Deploy PRD </p>
              </div>
            ),
            onOk() {
              editorRef.current.setvalue()
              onOk();
              history.push({ pathname: "/customer/issue/pass" })
  
            },
          });
        }
        

      }

    } catch (error) {
      await Modal.info({
        title: 'บันทึกข้อมูลไม่สำเร็จ',
        content: (
          <div>
            <p>{error.message}</p>
            <p>{error.response.data}</p>
          </div>
        ),
        onOk() {
          editorRef.current.setvalue()

        },
      });

    }
  }

  useEffect(() => {

  }, [])


  return (
    <Modal
      // title={title}
      visible={visible}
      okText="Send"
      onOk={() => { return (SendFlow()) }}
      onCancel={() => { return (editorRef.current.setvalue(), onCancel()) }}
      {...props}
    >

      <TextEditor ref={editorRef} />
      <br />
      AttachFile : <UploadFile ref={uploadRef} />
    </Modal>
  );
}
