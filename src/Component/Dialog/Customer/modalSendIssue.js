import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';


export default function ModalSendIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
  const history = useHistory();
  const uploadRef = useRef(null);
  const editorRef = useRef(null)
  const [textValue, setTextValue] = useState("")
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);

  const handleEditorChange = (content, editor) => {
    setTextValue(content);
  }

  const SaveComment = async () => {
    try {
      if (textValue !== "") {
        const comment = await Axios({
          url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
          },
          data: {
            ticketId: details && details.ticketId,
            comment_text: textValue,
            comment_type: "customer",
            files: uploadRef.current.getFiles().map((n) => n.response.id),
          }
        });


      }
    } catch (error) {

    }
  }
  // const SendFlow = async () => {
  //   try {
  //     const sendflow = await Axios({
  //       url: process.env.REACT_APP_API_URL + "/workflow/send",
  //       method: "POST",
  //       headers: {
  //         "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
  //       },
  //       data: {
  //         mailbox_id: details && details.mailboxId,
  //         node_output_id: details && details.node_output_id,
  //         to_node_id: details && details.to_node_id,
  //         node_action_id: details && details.to_node_action_id,
  //         product_id: details && details.productId,
  //         flowstatus: details.flowstatus,
  //         groupstatus: details.groupstatus,
  //         history: {
  //           historytype: "Customer",
  //           description: details.flowaction,
  //         }
  //       }
  //     });

  //     if (sendflow.status === 200) {
  //       await Modal.info({
  //         title: 'บันทึกข้อมูลสำเร็จ',
  //         content: (
  //           <div>
  //             <p>บันทึกข้อมูลสำเร็จ</p>
  //           </div>
  //         ),
  //         onOk() {
  //           editorRef.current.editor.setContent("")
  //           onOk();
  //           if (details.flowstatus === "Waiting ICON Support") {
  //             history.push({ pathname: "/customer/issue/inprogress" })
  //           }
  //           if (details.flowstatus === "Complete") {
  //             history.push({ pathname: "/customer/issue/complete" })
  //           }

  //         },
  //       });
  //     }

  //   } catch (error) {
  //     await Modal.info({
  //       title: 'บันทึกข้อมูลไม่สำเร็จ',
  //       content: (
  //         <div>
  //           <p>{error.message}</p>
  //           <p>{error.response.data}</p>
  //         </div>
  //       ),
  //       onOk() {
  //         editorRef.current.editor.setContent("")
  //         onOk();
  //       },
  //     });

  //   }
  // }

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

      if (sendflow.status === 200) {
        await Modal.info({
          title: 'บันทึกข้อมูลสำเร็จ',
          content: (
            <div>
              <p>ส่ง Issue เลขที่ : {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number}</p>
              <p>ให้ ICON ดำเนินการแก้ไข</p>
            </div>
          ),
          onOk() {
            editorRef.current.editor.setContent("")
            onOk();
            if (sendflow.data === "InProgress") {
              history.push({ pathname: "/customer/issue/inprogress" })
            }
            if (sendflow.data === "Complete") {
              history.push({ pathname: "/customer/issue/complete" })
            }

          },
        });
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
          editorRef.current.editor.setContent("")
        
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
      onOk={() => { return (SaveComment(), SendFlow(), onOk()) }}
      onCancel={() => { return (editorRef.current.editor.setContent(""), onCancel()) }}
      {...props}
    >

      <Editor
        apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
        ref={editorRef}
        initialValue=""
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
          toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
        }}
        onEditorChange={handleEditorChange}
      />
      <br />
      AttachFile : <UploadFile ref={uploadRef} />
    </Modal>
  );
}
