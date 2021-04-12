import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate, Form, Input, Row, Col, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalCompleteIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
  const history = useHistory();
  const [textValue, setTextValue] = useState("")
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const layout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    },
  };

  const FlowComplete = async (values) => {
    setLoading(true);
    try {
      const completeflow = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/customer-complete",
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: details.ticketid,
          mailboxid: details.mailboxid,
          flowoutputid: details.flowoutputid,
          satisfication: {
            score: values.score,
            score2: values.score2,
            score3: values.score3,
            score4: values.score4,
            score5: values.score5,
            suggestion: textValue

          }
        }
      });

      if (completeflow.status === 200) {
        setLoading(false);
        onOk();

        await Modal.success({
          title: 'บันทึกข้อมูลสำเร็จ',
          content: (
            <div>
              <p>Completed Issue</p>
            </div>
          ),
          okText: "Close",
          onOk() {
            form.resetFields();
            onOk();
            history.push({ pathname: "/customer/issue/complete" })
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

  const onFinish = values => {
    
    FlowComplete(values);
  };

  useEffect(() => {

  }, [])



  return (
    <Modal
      visible={visible}
      confirmLoading={loading}
      onOk={() => form.submit()}
      okButtonProps={{ className: "modal-button-save" }}
      okText="Save"

      onCancel={() => { return onCancel(), form.resetFields() }}
      {...props}
    >
      <Spin spinning={loading} size="large" tip="Loading...">
        <Form
          {...layout}
          form={form}
          name="satisfication"
          initialValues={{ remember: true }}
          onFinish={onFinish}

        >

          <Form.Item
            style={{ border: "1px solid", marginBottom: 0 }}
            label="แก้ไขปัญหาได้ถูกต้อง"
            name="score"
            rules={[{ required: true, message: 'กรุณาให้คะแนนความพึงพอใจ!' }]}
          >
            <Rate
              tooltips={['ควรปรับปรุง', 'แย่', 'พอใช้', 'ดี', 'ยอดเยี่ยม']}
              onChange={(x) => console.log(x)}
            >
            </Rate>
          </Form.Item>
          <Form.Item
            style={{ border: "1px solid", marginBottom: 0 }}
            label="แก้ไขปัญหาได้ภายในเวลาที่กำหนด"
            name="score2"
            rules={[{ required: true, message: 'กรุณาให้คะแนนความพึงพอใจ!' }]}
          >
            <Rate
              tooltips={['ควรปรับปรุง', 'แย่', 'พอใช้', 'ดี', 'ยอดเยี่ยม']}
              onChange={(x) => console.log(x)}
            >
            </Rate>
          </Form.Item>
          <Form.Item
            style={{ border: "1px solid", marginBottom: 0 }}
            label="ความสะดวกในการการติดต่อประสานงาน"
            name="score3"
            rules={[{ required: true, message: 'กรุณาให้คะแนนความพึงพอใจ!' }]}
          >
            <Rate
              tooltips={['ควรปรับปรุง', 'แย่', 'พอใช้', 'ดี', 'ยอดเยี่ยม']}
              onChange={(x) => console.log(x)}
            >
            </Rate>
          </Form.Item>
          <Form.Item
            style={{ border: "1px solid", marginBottom: 0 }}
            label="การให้บริการ (Service Mind)"
            name="score4"
            rules={[{ required: true, message: 'กรุณาให้คะแนนความพึงพอใจ!' }]}
          >
            <Rate
              tooltips={['ควรปรับปรุง', 'แย่', 'พอใช้', 'ดี', 'ยอดเยี่ยม']}
              onChange={(x) => console.log(x)}
            >
            </Rate>
          </Form.Item>
          <Form.Item
            style={{ border: "1px solid", marginBottom: 0 }}
            label="คะแนนการให้บริการโดยรวม"
            name="score5"
            rules={[{ required: true, message: 'กรุณาให้คะแนนความพึงพอใจ!' }]}
          >
            <Rate
              tooltips={['ควรปรับปรุง', 'แย่', 'พอใช้', 'ดี', 'ยอดเยี่ยม']}
              onChange={(x) => console.log(x)}
            >
            </Rate>
          </Form.Item>


          <Row style={{ marginTop: 40 }}>
            <Col span={24}>
              แนะนำคำติชม
          </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TextArea rows={5} style={{ width: "100%" }} onChange={(x) => setTextValue(x.target.value)} />
            </Col>
          </Row>
        </Form >
      </Spin>
    </Modal>
  );
}
