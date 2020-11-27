import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate, Form, Input } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalCompleteIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
  const history = useHistory();
  const [textValue, setTextValue] = useState("")
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  const [form] = Form.useForm();


  const FlowComplete = async (values) => {
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
            suggestion: values.suggestion

          }
        }
      });

      if (completeflow.status === 200) {
        onCancel();
        await Modal.info({
          title: 'บันทึกข้อมูลสำเร็จ',
          content: (
            <div>
              <p>บันทึกข้อมูลสำเร็จ</p>
            </div>
          ),
          onOk() {
            form.resetFields();
            onOk();
            history.push({ pathname: "/customer/issue/complete" })
          },
        });
      }

    } catch (error) {
      onCancel();
      await Modal.info({
        title: 'บันทึกข้อมูลไม่สำเร็จ',
        content: (
          <div>
            <p>{error.message}</p>
            <p>{error.response.data}</p>
          </div>
        ),
        onOk() {
          form.resetFields();
          onOk();
        },
      });

    }
  }

  const onFinish = values => {
    console.log('Success:', values);

    FlowComplete(values)
  };

  useEffect(() => {

  }, [])

  return (
    <Modal
      visible={visible}
      onOk={() => { return (form.submit()) }}
      okButtonProps={""}
      onCancel={() => { return onCancel(), form.resetFields() }}
      {...props}
    >
      <Form
        form={form}
        name="satisfication"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="ระดับความพึงพอใจ"
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
          name="suggestion"
        >
          <TextArea rows={5} style={{ width: "100%" }} />
        </Form.Item>
      </Form >



    </Modal>
  );
}
