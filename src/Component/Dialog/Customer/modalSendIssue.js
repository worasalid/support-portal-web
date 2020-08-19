import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import Comment from '../../Comment'
import { Editor } from '@tinymce/tinymce-react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'


export default function ModalSupport({ visible = false, title, onOk, onCancel, ...props }) {
const uploadRef = useRef(null);
  const [textValue, setTextValue] = useState("")
  const handleEditorChange = (content, editor) => {
    setTextValue(content);
  }

  return (
    <Modal
      title={title}
      width={700}
      visible={visible}
      onOk={onOk => { return (console.log(uploadRef.current.getFiles()) , console.log(textValue)) }}
      onCancel={onCancel}
      {...props}
    >
      <Editor
        apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
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
      <br/>
      AttachFile : <UploadFile ref={uploadRef} />
    </Modal>
  );
}
