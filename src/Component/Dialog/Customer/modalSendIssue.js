import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";


export default function ModalSendIssue({ visible = false, onOk, onCancel, datarow,details, ...props }) {
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
  const SendFlow = async () => {
    try {
      const sendflow = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/send",
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          mailbox_id: details && details.mailboxId,
          output_id: details && details.nodeoutput_id
        }
      });

      if (sendflow.status === 200) {
        await Modal.info({
          title: 'บันทึกข้อมูลสำเร็จ',
          content: (
            <div>
              <p>บันทึกข้อมูลสำเร็จ</p>
            </div>
          ),
          onOk() {
            editorRef.current.editor.setContent("")
            onOk()
          },
        });
      }
    } catch (error) {

    }

  }

  useEffect(() => {

  }, [])

  return (
    <Modal
      // title={title}
      visible={visible}
      onOk={() => { return (SaveComment(),SendFlow()) }}
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
