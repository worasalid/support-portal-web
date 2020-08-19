import { Button, Form, Input, Select, Card } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import UploadFile from "../Component/UploadFile";

const { TextArea } = Input;

let page = {
  data: {
    ProductData: [
      {
        text: "REM",
        value: "REM",
      },
      {
        text: "PM",
        value: "PM",
      },
      {
        text: "Rental",
        value: "Rental",
      },
    ],
    PriorityData: [
      {
        text: "Low",
        id: "Low",
      },
      {
        text: "Medium",
        id: "Medium",
      },
      {
        text: "High",
        id: "High",
      },
    ],
    IssueTypeData: [
      {
        text: "Bug",
        value: "Bug",
      },
      {
        text: "Data",
        value: "Data",
      },
      {
        text: "Use",
        value: "Use",
      },
      {
        text: "New Requirement",
        value: "New Requirement",
      },
    ],
    ModuleData: [
      {
        text: "CRM",
        value: "CRM",
      },
      {
        text: "Finance",
        value: "Finance",
      },
      {
        text: "SaleOrder",
        value: "SaleOrder",
      },
      {
        text: "Report",
        value: "Report",
      },
      {
        text: "PrintForm",
        value: "PrintForm",
      },
    ],
  },
  loaddata: {
    Product: [],
    Priority: [],
    IssueType: [],
    Module: [],
  },
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

/// Binding DropDown
page.loaddata.Product = page.data.ProductData.map((x) => ({
  name: x.text,
  value: x.value,
}));
page.loaddata.IssueType = page.data.IssueTypeData.map((x) => ({
  name: x.text,
  value: x.value,
}));
page.loaddata.Module = page.data.ModuleData.map((x) => ({
  name: x.text,
  value: x.value,
}));

export default function Customer() {
  const history = useHistory();

  const [product, setProduct] = useState("");

  const uploadRef = useRef(null);

  //#region function
  const loadmaster = async () => {
    try {
      let products = await axios({
        url: process.env.REACT_APP_API_URL + "/master/products",
        method: "GET",
      });

      let issueType = await axios({
        url: process.env.REACT_APP_API_URL + "/master/issue-types",
        method: "GET",
      });

      let module = await axios({
        url: process.env.REACT_APP_API_URL + "/master/modules",
        method: "GET",
        params: {
          product_id: "REM",
        },
      });
      console.log("products", products.data);
      console.log("issueType", issueType.data);
      console.log("module", module.data);
    } catch (error) {
      console.log("xxx");
    }
  };

  const onFinish = async (values) => {
    history.push("/customer/issue/inprogress");

    // console.log("values", values);
    // //  console.log("dataUpload", uploadRef.current.getFiles());
    // try {
    //   let createTicket = await axios({
    //     url: process.env.REACT_APP_API_URL + "",
    //     method: "POST",
    //     // headers: {
    //     //     "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImJhbmtfY29kZSI6IkJCTCIsInRva2VuIjpudWxsLCJ0b2tlbl9leHBpcmUiOm51bGwsImZpcnN0bmFtZV90aCI6bnVsbCwibGFzdG5hbWVfdGgiOm51bGwsImZpcnN0bmFtZV9lbiI6bnVsbCwibGFzdG5hbWVfZW4iOm51bGwsIm1vYmlsZV9ubyI6bnVsbCwicm9sZV9pZCI6MSwiaWF0IjoxNTk2NTMzNDYyLCJleHAiOjE1OTY1NzY2NjJ9.QM6GEzXP-5ZwrQk43snThcJxY3Z5pLKasnYGsXzEQUDANy2S_WW0-BAk0b3LGwUNvScJr-bBS4U33MBuQaL8Bg"
    //     // },
    //     data: {
    //       product: values.Product,
    //       module: values.Module,
    //       issuetype: values.IssueType,
    //       topic: values.Topic,
    //       details: values.Details,
    //       attachment: [],
    //     },
    //   });
    //   console.log("data", createTicket.data);
    //   ////////////////////////////////////////////////
    //   //////////////////////////////////////////////////////
    // } catch (error) {
    //   alert(error);
    //   history.push({ pathname: "/customer/issue/inprogress" });
    // }
  };
  //#endregion

  useEffect(() => {
    // loadmaster();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "36px 0px",
        height: "100vh",
      }}
    >
      <Card style={{ width: "500px" }}>
        <h3 style={{ marginTop: 10 }}>แจ้งปัญหาการใช้งาน</h3>
        <hr />
        <Form
          {...layout}
          name="issue"
          initialValues={{
            product: "REM",
            module: "CRM",
            issue_type: "Bug",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Product"
            name="product"
            rules={[
              {
                // required: true,
                message: "กรุณาระบุ Product!",
              },
            ]}
          >
            <Select
              options={page.loaddata.Product}
              onChange={(value) => setProduct(value)}
            ></Select>
          </Form.Item>
          <Form.Item label="Module" name="module">
            <Select placeholder="None" options={page.loaddata.Module}></Select>
          </Form.Item>
          <Form.Item
            label="IssueType"
            name="issue_type"
            rules={[
              {
                // required: true,
                message: "กรุณาระบุ IssueType!",
              },
            ]}
          >
            <Select
              placeholder="None"
              options={page.loaddata.IssueType}
            ></Select>
          </Form.Item>

          <Form.Item
            label="หัวข้อ"
            name="subject"
            rules={[
              {
                // required: true,
                message: "กรุณาระบุ หัวข้อ!",
              },
            ]}
          >
            <Input placeholder="หัวข้อ" />
          </Form.Item>

          <Form.Item
            label="รายละเอียด"
            name="description"
            rules={[
              {
                // required: true,
                message: "กรุณาระบุ รายละเอียด!",
              },
            ]}
          >
            <TextArea rows={5} placeholder="รายละเอียด" />
          </Form.Item>

          <Form.Item label="ไฟล์แนบ" name="attach">
            <UploadFile ref={uploadRef} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={onFinish}>
              ยื่นเรื่อง
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
