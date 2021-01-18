import { Upload, Button, Avatar, Image } from "antd";
import React, { useState, useEffect } from "react";
import Axios from 'axios';
import MasterPage from './MasterPage';


export default function Profile() {
    const [fileList, setFileList] = useState(null)

    const toBase64 = file => new Promise((resolve, reject) => {
        let blob = new Blob([file], {
            type: file.type,
        });

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handlePreview = async (file) => {
        //console.log("sdsd", file.preview)
        if (!file.url && !file.preview) {
            // file.preview = await toBase64(file.originFileObj);
        }

    }


    function onChange(info) {
        console.log(info.file);
        const basae64 = toBase64(info.file.originFileObj)
        basae64.then((x) => {
            setFileList(x)
            //console.log("xxx", x)
        })
        // if (info.file.status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
    }
    const getProfile = async () => {
        try {
            const saveprofile = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/profile",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    userid: 16
                }
            });

            setFileList(saveprofile.data.profile_image)
        } catch (error) {

        }
    }

    const saveProfile = async () => {
        try {
            const saveprofile = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/save-profile",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    base64_image: fileList
                }
            });


        } catch (error) {

        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    console.log("fileList", fileList)

    return (
        <MasterPage>
            <Avatar style={{ backgroundColor: '#87d068' }} size={64} src={fileList && fileList} />
            <Upload
                onChange={onChange}
                onPreview={handlePreview}
                //listType="picture-card"
            // fileList={fileList}
            >
                <Button type="primary">Click to Upload</Button>

            </Upload>



            <Button onClick={() => saveProfile()} type="primary">Click to Save</Button>

        </MasterPage>
    )
}




