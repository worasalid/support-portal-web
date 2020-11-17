import { EditOutlined } from '@ant-design/icons';
import { Button, Table, Input, Form } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Column from 'antd/lib/table/Column';
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import MasterPage from '../MasterPage'

export default function MasterCompany() {
    const [form] = Form.useForm();

    //modal
    const [visible, setVisible] = useState(false);

    //data
    const [listcompany, setListcompany] = useState([]);

    const GetCompany = async () => {
        try {
            const company = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            setListcompany(company.data)
        } catch (error) {

        }
    }

    const onFinish = values => {
        console.log(values);
    };

    useEffect(() => {
        GetCompany()
    }, [])

    console.log("listcompany", listcompany)
    return (
        <MasterPage>
            <Table dataSource={listcompany} loading={false}>
                <Column title="Code" width="10%" dataIndex="Code" />
                <Column title="CompanyName" width="20%" dataIndex="Name" />
                <Column title="FullName" width="60%" dataIndex="FullNameTH" />
                <Column title="Module ที่ดูแล"
                    align="center"
                    width="10%"
                    render={(record) => {
                        return (
                            <>
                                <Button type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        return (
                                            setVisible(true)
                                        )
                                    }
                                    }
                                >
                                    Edit
                                    </Button>
                            </>
                        )
                    }
                    }
                />
            </Table>

            <Modal
                title="ข้อมูลบริษัท"
                visible={visible}
                width={800}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <Form form={form}
                    layout="horizontal"
                    name="form-company"
                    onFinish={onFinish}
                >
                    <Form.Item name="code" label="code">
                        <Input />
                    </Form.Item>

                    <Form.Item name="name" label="name">
                        <Input />
                    </Form.Item>
                </Form>

            </Modal>

        </MasterPage>

    )
}