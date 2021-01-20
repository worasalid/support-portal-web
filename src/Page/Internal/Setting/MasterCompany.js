import { EditOutlined } from '@ant-design/icons';
import { Button, Table, Input, InputNumber, Form, Modal } from 'antd';

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
    const [selectcompany, setSelectcompany] = useState(null);
    //const [companyid, setCompanyid] = useState(null);

    const GetCompany = async (value) => {
        console.log("value", value)
        try {
            const company_all = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            if (company_all.status === 200) {
                setListcompany(company_all.data)
            }

            const companyby_id = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: value
                }
            });

            if (companyby_id.status === 200) {
                setSelectcompany(companyby_id.data)
            }


        } catch (error) {

        }
    }

    const GetCompanyby_id = async (value) => {
        console.log("value", value)
        try {
            const companyby_id = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: value
                }
            });

            if (companyby_id.status === 200) {
                setSelectcompany(companyby_id.data);
            }


        } catch (error) {

        }
    }



    const onFinish = async (values) => {
        console.log(values);
        try {
            const updatecompany = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company-update",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: selectcompany[0]?.Id,
                    name: values.name,
                    full_name_th: values.fullname_th,
                    full_name_en: values.fullname_en,
                    cost: values.cost
                }
            });
            if (updatecompany.status === 200) {
                GetCompany()
                Modal.info({
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    onOk() {
                        setVisible(false)
                    },
                });
            }

        } catch (error) {

        }
    };

    useEffect(() => {
        GetCompany()
    }, [])


    return (
        <MasterPage>
            <Table dataSource={listcompany} loading={false}>
                <Column title="Code" width="10%" dataIndex="Code" />
                <Column title="CompanyName" width="20%" dataIndex="Name" />
                <Column title="FullName" width="60%" dataIndex="FullNameTH" />
                <Column title=""
                    align="center"
                    width="10%"
                    render={(record) => {
                        return (
                            <>
                                <Button type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        return (
                                            GetCompany(record.Id),
                                            form.setFieldsValue({
                                                code: record.Code,
                                                name: record.Name,
                                                fullname_th: record.FullNameTH,
                                                fullname_en: record.FullNameEN,
                                                cost: record.CostManday
                                            }),
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
                title={`ข้อมูลบริษัท - ${selectcompany && selectcompany[0]?.Name}`}
                visible={visible}
                width={800}
                onOk={() => {
                    form.submit();
                    setVisible(false);
                }
                }
                okButtonProps={{ type: "primary", htmlType: "submit" }}
                onCancel={() => { setVisible(false); form.resetFields(); setSelectcompany(null) }}
            >
                <Form form={form}
                    layout="horizontal"
                    name="form-company"
                    onFinish={onFinish}

                >
                  
                    <Form.Item name="code" label="code">
                        <Input disabled={true} />
                    </Form.Item>

                    <Form.Item name="name" label="name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="fullname_th" label="FullName TH">
                        <Input />
                    </Form.Item>
                    <Form.Item name="fullname_en" label="FullName EN">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="cost" label="Cost manday">
                        <InputNumber
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>
                </Form>

            </Modal>

        </MasterPage>

    )
}