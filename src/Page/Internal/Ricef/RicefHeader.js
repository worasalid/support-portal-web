import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Row, Col, Form, Modal, Upload } from 'antd';
import Column from 'antd/lib/table/Column';
import { DownloadOutlined, LeftCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Axios from 'axios'
import moment from 'moment';
import MasterPage from '../MasterPage'
import { useRouteMatch, useHistory } from 'react-router-dom';
import xlsx from 'xlsx'
import UploadFile from '../../../Component/UploadFile';
import _ from 'lodash';
import ReactExport from 'react-data-export';


export default function RicefHeader({ name, ...props }) {
    const match = useRouteMatch();
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    //Data
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(null);
    const [company, setCompany] = useState(null);
    const [exceldata, setExceldata] = useState(null);
    const [listRicef, setListRicef] = useState(null);

    const multiDataSet = [
        {
            columns: [
                { title: "Headings", width: { wpx: 300 } },//pixels width 
                { title: "Text Style", width: { wch: 40 } },//char width 
                { title: "Colors", width: { wpx: 90 } },
            ],
            data: [
                [
                    { value: "H1", width: { wpx: 300 }, style: { font: { sz: "24", bold: true } }, width: 200 },
                    { value: "Bold", style: { font: { bold: true } } },
                    { value: "Red", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } },
                ],
                [
                    { value: "H2", style: { font: { sz: "18", bold: true } } },
                    { value: "underline", style: { font: { underline: true } } },
                    { value: "Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FF0000FF" } } } },
                ],
                [
                    { value: "H3", style: { font: { sz: "14", bold: true } } },
                    { value: "italic", style: { font: { italic: true } } },
                    { value: "Green", style: { fill: { patternType: "solid", fgColor: { rgb: "FF00FF00" } } } },
                ],
                [
                    { value: "H4", style: { font: { sz: "12", bold: true } } },
                    { value: "strike", style: { font: { strike: true } } },
                    { value: "Orange", style: { fill: { patternType: "solid", fgColor: { rgb: "FFF86B00" } } } },
                ],
                [
                    { value: "H5", style: { font: { sz: "10.5", bold: true } } },
                    { value: "outline", style: { font: { outline: true } } },
                    { value: "Yellow", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFFFF00" } } } },
                ],
                [
                    { value: "H6", style: { font: { sz: "7.5", bold: true } } },
                    { value: "shadow", style: { font: { shadow: true } } },
                    { value: "Light Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } }
                ]
            ]
        }
    ];

    const GetCompany = async (value) => {
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
                setCompany(companyby_id.data)
            }
        } catch (error) {

        }
    }

    const GetRicef = async (value) => {
        try {
            const ricef = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/load-header",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    companyid: value
                }
            });

            if (ricef.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                }, 500)

                setListRicef(ricef.data);
            }

        } catch (error) {

        }
    }

    const handleImportExcel = (file, fileList) => {
        let blob = new Blob([fileList[0].originFileObj], {
            type: fileList[0].type,
        });

        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
            const data = new Uint8Array(reader.result);
            const wb = xlsx.read(data, { type: "array" });

            let sheet0 = wb.SheetNames[0];
            let sheet1 = wb.SheetNames[1];

            const sheetData0 = xlsx.utils.sheet_to_json(wb.Sheets[sheet0], {
                raw: true,
                defval: null,
            });
            const sheetData1 = xlsx.utils.sheet_to_json(wb.Sheets[sheet1], {
                raw: true,
                defval: null,
            });
            ImportRicef(sheetData0, sheetData1)

            console.log({ sheetData0 });
            console.log({ sheetData1 });

        };

    };

    const ImportRicef = async (sheetData0, sheetData1) => {
        try {
            const ricef = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/import-ricef",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    companyid: company && company[0].Id,
                    header: sheetData0,
                    details: sheetData1
                }
            });
        } catch (error) {

        }
    }

    const GetRicefExport = async (value) => {
        try {
            const exportexcel = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/export-ricef",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    batchid: value
                }
            });
            if (exportexcel.status === 200) {
                setExceldata(exportexcel.data)

            }
        } catch (error) {

        }
    }

    const ExportExcel = () => {
        return (
            <>
                <ExcelFile
                    filename="RICEF"
                    element={<Button icon={<DownloadOutlined />} > Excel Download</Button>}
                >
                    {/* <ExcelSheet dataSet={multiDataSet} name="Organization"/> */}
                    <ExcelSheet data={exceldata} name="Ricef">
                        <ExcelColumn label="No" value="RowNo" />
                        <ExcelColumn label="Issue" value="IssueNumber" style={{ width: { wpx: "300" } }} />
                        <ExcelColumn label="Product" value="ProductName"/>
                        <ExcelColumn label="Module" value="ModuleName"/>
                        <ExcelColumn label="Type" value="IssueType" wpx="300" />
                        <ExcelColumn label="Priority" value="Priority" />
                        <ExcelColumn label="Title" value="Title" />
                        <ExcelColumn label="Description" value="Description" />
                        <ExcelColumn label="Status" value="Status" />
                        <ExcelColumn label="Manday" value="Manday" />
                        <ExcelColumn label="DueDate" value="DueDate" />
                        <ExcelColumn label="Owner" value="OwnerName" />
                        <ExcelColumn label="UnitTest_URL" value="UnitTest_URL" style={{ width: 300 }} />
                    </ExcelSheet>
                </ExcelFile>
            </>
        )
    }

    const onFinish = (values) => {
        console.log('Success:', values.excel_import.file, values.excel_import.fileList);
        Modal.info({
            title: 'ต้องการ Import Excel ใช่หรือไม่',
            content: (
                <div>

                </div>
            ),
            onOk() {
                handleImportExcel(values.excel_import.file, values.excel_import.fileList);
                setLoading(true)
            },
            onCancel() {
                setVisible(false);
            },
            okCancel: ""
        });
    };

    useEffect(() => {
        GetCompany(match.params.compid)
        GetRicef(match.params.compid)

    }, [])


    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
        GetRicef(match.params.compid)

    }, [loading])

    useEffect(() => {
        GetRicefExport()
    }, [])

    return (
        <MasterPage>
            <Row>
                <Col span={24}>
                    <Button type="link"
                        onClick={() => history.goBack()}
                    >
                        <LeftCircleOutlined />

                    </Button>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    {/* {company && company[0].Name} */}
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>{company && company[0].FullNameTH}</label>

                </Col>
            </Row>

            <Row style={{ textAlign: "right" }}>
                <Col span={24}>
                    <Button
                        type="default"
                        icon={<UploadOutlined />}
                        style={{ marginRight: 20 }} type="primary" onClick={() => setVisible(true)}>
                        Import
                    </Button>
                    <Button
                        type="default"
                        icon={<DownloadOutlined />}
                        target="_blank" onClick={() => window.open("https://drive.google.com/u/0/uc?id=1txcydTJ4PVCFJ_ElKuuhWk_5sz0Metux&export=download", "_blank")}>
                        DownLoad Templete
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: 40 }}>
                <Col span={24}>
                    <Table dataSource={listRicef} loading={loading}>
                        {/* <Column align="center" title="No" width="2%" key="1" dataIndex="1" /> */}
                        <Column align="center" title="GAP Document" width="40%" dataIndex="Description" />
                        <Column align="center" title="วันที่" width="10%" dataIndex=""
                            render={(record) => {
                                return (
                                    moment(record.document_date).format("DD/MM/YYYY")
                                )
                            }
                            }
                        />
                        <Column align="center" title="Owner" width="30%" dataIndex="Owner" />
                        <Column align="center" title="จำนวน" width="15%" dataIndex=""
                            render={(record) => {
                                return (
                                    <>
                                        <Row>
                                            <Col span={18} style={{ textAlign: "left" }}>
                                                <label style={{ fontWeight: "bold" }}>Total</label>
                                            </Col>
                                            <Col span={6}>
                                                <Button type="link"
                                                    onClick={() => history.push({ pathname: "/internal/ricef/comp-" + match.params.compid + "/batch-" + record.BatchId })}
                                                >
                                                    {record.cntTotal}
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={18} style={{ textAlign: "left" }}>
                                                <label >Open</label>
                                            </Col>
                                            <Col span={6}>
                                                {record.cntOpen}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={18} style={{ textAlign: "left" }}>
                                                <label style={{ color: "#2db7f5" }}>InProgress</label>

                                            </Col>
                                            <Col span={6}>
                                                {record.cntInprogress}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={18} style={{ textAlign: "left" }}>
                                                <label style={{ color: "#f50" }}>Resolved</label>

                                            </Col>
                                            <Col span={6}>
                                                {record.cntResolved}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={18} style={{ textAlign: "left" }}>
                                                <label style={{ color: "#87d068" }}>Complete</label>

                                            </Col>
                                            <Col span={6}>
                                                {record.cntComplete}
                                            </Col>
                                        </Row>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title={<DownloadOutlined style={{ fontSize: 30 }} />}
                            width="10%"
                            align="center"
                            render={(record) => {
                                return (
                                    <>
                                        <Button onClick={() => GetRicefExport(record.BatchId)}>GET Data</Button>
                                        {ExportExcel()}
                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </Col>
            </Row>

            <Modal
                visible={visible}
                onOk={() => { return (form.submit(), setVisible(false)) }}
                onCancel={() => setVisible(false)}
                okButtonProps={{ type: "primary", htmlType: "submit" }}
            >
                {/* <Button type="primary" onClick={() => handleImportExcel("", uploadRef.current.getFiles().map((n) => n))}>
                    Import
            </Button> */}
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white", marginTop: 0 }}
                    name="import_excel"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        style={{ minWidth: 300, maxWidth: 300 }}
                        label="ImportFile"
                        name="excel_import"
                        rules={[
                            {
                                required: false,
                                message: 'Please input your UnitTest!',
                            },
                        ]}
                    >
                        {/* <Upload beforeUpload={handleImportExcel}>
                            <Button type="default">
                            <UploadOutlined /> Click to Upload
                                </Button>
                        </Upload> */}
                        <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Modal>


        </MasterPage>
    )
}