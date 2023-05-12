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
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isValidate, setIsValidate] = useState(false);

  const layout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    },
  };

  const flowComplete = async (values, values2) => {
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
            suggestion: values2.suggestion
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
            history.push({ pathname: "/customer/issue/complete" });
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

  const onFinish = (values, values2) => {
    const totalScore = (values.score + values.score2 + values.score3 + values.score4 + + values.score5)

    if ((totalScore / 5) <= 3.5) {
      setIsValidate(true);
      form2.submit();
      if (textValue !== "") {
        onFinish2(values, values2)
      }
    } else {
      setIsValidate(false);
      form2.submit();
      onFinish2(values, values2)
    }
  };

  const onFinish2 = (values, values2) => {
    flowComplete(values, values2)
  };

  return (
    <Modal
      visible={visible}
      confirmLoading={loading}
      onOk={() => {
        form.submit();
      }}
      okButtonProps={{ className: "modal-button-save" }}
      okText="Save"
      onCancel={() => {
        form.resetFields();
        form2.resetFields();
        onCancel();
      }}
      {...props}
    >
      <Spin spinning={loading} size="large" tip="Loading...">
        <Form
          {...layout}
          form={form}
          name="satisfication"
          // initialValues={{ remember: true }}
          onFinish={() => onFinish(form.getFieldValue(), form2.getFieldValue())}
        >
          <Form.Item
            style={{ border: "1px solid", marginBottom: 0 }}
            label="แก้ไขปัญหาได้ถูกต้อง"
            name="score"
            rules={[{ required: true, message: 'กรุณาให้คะแนนความพึงพอใจ!' }]}
          >
            <Rate
              tooltips={['ควรปรับปรุง', 'แย่', 'พอใช้', 'ดี', 'ยอดเยี่ยม']}
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
            >
            </Rate>
          </Form.Item>
        </Form>

        <Form
          form={form2}
          name="textSuggestion"
          layout='vertical'
          initialValues={{ suggestion: '' }}
          style={{ marginTop: '24px' }}
          onFinish={() => onFinish2(form.getFieldValue(), form2.getFieldValue())}
        >
          <Form.Item
            // style={{ border: "1px solid", marginBottom: 0 }}
            name="suggestion"
            label="แนะนำคำติชม"
            rules={[{ required: isValidate, message: 'กรุณาระบุ รายละเอียด!' }]}
          >
            <TextArea rows={5} style={{ width: "200%" }} />
          </Form.Item>

          ทุกความคิดเห็นของคุณ มีความสำคัญต่อการพัฒนาทีมงานและการพัฒนาระบบของเรา ขอเชิญคุณมาร่วมเป็นส่วนหนึ่งในแบ่งปันข้อเสนอแนะ ข้อคิดเห็นต่างๆที่จะช่วยFeedback ให้กับทาง ICON Framework นำไปปรับปรุงและพัฒนาต่อไป
        </Form>
      </Spin>
    </Modal >
  );
}
