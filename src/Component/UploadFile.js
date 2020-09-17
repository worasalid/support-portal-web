import React, { useState, useImperativeHandle } from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { forwardRef } from 'react';



export default forwardRef(function UploadFile(props, ref) {
    const [fileList, setFileList] = useState([]);
    useImperativeHandle(ref, () => ({
        getFiles: () => fileList,
        display: (text) => alert(text)
      }));  

    const Uploadprops = {
        name: 'file',
        action: process.env.REACT_APP_API_URL + "/files",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                setFileList(info.fileList)
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                console.log("info",info)
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove(info){
            console.log("removeinfo",info)
        }
    };

    return (
   
            <Upload {...Uploadprops} >
                <Button>
                    <UploadOutlined /> Click to Upload
                 </Button>
            </Upload>
   
    )
})