import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'antd'
import Axios from 'axios'
//import { useHistory } from 'react-router-dom'
import Column from 'antd/lib/table/Column';
import { DownloadOutlined } from '@ant-design/icons';

export default function ModalFileDownload({ visible = false, onOk, onCancel, details, ...props }) {
    const [listFiledownload, setListFiledownload] = useState([]);

    const getfile = async () => {
        try {
            const file = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    reftype: details.reftype,
                    grouptype: details.grouptype
                }
            });

            setListFiledownload(file.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        if (visible) {
            getfile();
        }

    }, [visible])

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            cancelText="Close"
            okButtonProps={{ hidden: true }}
            {...props}
        >
            <Table dataSource={listFiledownload}>

                <Column title="No"
                    width="10%"
                    render={(value, record, index) => {
                        return (
                            <>
                                <label>{index + 1}</label>

                            </>
                        )
                    }
                    }
                />
                <Column title="ชื่อไฟล์" dataIndex="FileName" ></Column>
                <Column title="Size" dataIndex="FileSize" ></Column>
                <Column title=""
                    render={(value, record, index) => {
                        return (
                            <>
                                <Button type="link"
                                    onClick={() => {
                                        record.Url === "" || record.Url === null ?
                                            window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank") :
                                            window.open(record.Url, "_blank")
                                    }}
                                >
                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                </Button>

                            </>
                        )
                    }
                    }
                />
            </Table>
        </Modal>
    )
}
