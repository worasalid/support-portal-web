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
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log("uploadData", info.file, "B", info.fileList);
                // console.log("uploadListData", info.fileList);
                setFileList(info.fileList)
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
   
            <Upload {...Uploadprops}>
                <Button>
                    <UploadOutlined /> Click to Upload
                 </Button>
            </Upload>
   
    )
})