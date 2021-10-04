import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Select, Form, Input, Spin } from 'antd';
import TextEditor from '../../TextEditor';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalReOpen({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();
    const [reOpenData, setReOpenData] = useState(null);
    const [loading, setLoading] = useState(false);

    const configData = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                groups: "ReOpen"
            }

        }).then((res) => {
            setReOpenData(res.data)
        }).catch((error) => {

        })
    }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
                await Axios({
                    url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        comment_text: editorRef.current.getValue(),
                        comment_type: "customer",
                        files: uploadRef.current.getFiles().map((n) => n.response),
                    }
                });


            }
        } catch (error) {

        }
    }

    const FlowReOpen = async (param) => {
        setLoading(true);
        try {
            const completeflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/customer-send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutputid,
                    value: {
                        reason_id: param.reason,
                        comment_text: editorRef.current.getValue()
                    }
                }

            });

            if (completeflow.status === 200) {
                SaveComment();
                setLoading(false);
                onCancel();

                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        form.resetFields();
                        onOk();
                        history.push({ pathname: "/customer/issue/inprogress" });
                        window.location.reload(true);
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            onCancel();

            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    form.resetFields();
                    onOk();
                },
            });

        }
    }

    const onFinish = (param) => {
        setLoading(true);
        FlowReOpen(param);
    };

    useEffect(() => {
        if (visible) {
            configData()
        }
    }, [visible])

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => form.submit()}
            okText="Send"
            okButtonProps={""}
            onCancel={() => {
                onCancel();
                form.resetFields()
            }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form
                    form={form}
                    name="reopen"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="เหตุผลการ ReOpen"
                        name="reason"
                    >
                        <Select placeholder="เหตุผลการ ReOpen" style={{ width: "100%" }}
                            allowClear
                            maxTagCount={1}
                            onChange={(value) => configData()}
                            options={reOpenData && reOpenData.map((x) => ({ value: x.Id, label: x.Name }))}

                        />
                    </Form.Item>

                    {/* <Form.Item
                    label="เหตุผลการ ReOpen"
                    name="reason"
                >
                    <TextArea rows={5} style={{ width: "100%" }} />
                </Form.Item> */}

                    <Form.Item
                        label="Remark"
                        name="remark"
                    >
                        <TextEditor ref={editorRef} />
                        <br />
                        AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form >
            </Spin>
        </Modal>
    );
}
