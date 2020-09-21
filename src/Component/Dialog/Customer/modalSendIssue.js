import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import Comment from '../../Comment'
import { Editor } from '@tinymce/tinymce-react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'
import Axios from 'axios';


export default function ModalSendIssue({ visible = false, onOk, onCancel, datarow, ...props }) {
  const uploadRef = useRef(null);
  const editorRef = useRef(null)
  const [textValue, setTextValue] = useState("")
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
            ticketId: datarow.data.Id,
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
          mailbox_id: datarow.data.MailId,
          output_id: datarow.outputnode_id
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


  return (
    <Modal
      // title={title}
      visible={visible}
      onOk={() => { return (SaveComment(),SendFlow(), onOk()) }}
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
