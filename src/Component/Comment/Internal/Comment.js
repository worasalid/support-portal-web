import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';

const { TabPane } = Tabs;

const CommentList = ({ comments }) => (

    <List
        dataSource={comments}
        // header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);


const TextEditor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>

            {/* <TextArea rows={4} onChange={onChange} value={value} style={{ marginRight: 50 }} /> */}
            <Editor
                apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
                initialValue=""
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                    toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                }}
                onEditorChange={onChange}

            />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
      </Button>
        </Form.Item>
    </>
);

export default class CommentBox extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
        usertype: "Dev"
    };
    handleSubmit = (value) => {
        if (!this.state.value) {
        }
        this.setState({
            submitting: true,   
        });
        console.log("usertype",this.state.usertype)

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: this.state.usertype,
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p dangerouslySetInnerHTML={{ __html: this.state.value }}></p>,
                        // datetime: moment().fromNow(),
                        datetime: new Date().toLocaleDateString() + " : " + new Date().toLocaleTimeString(),
                        author2: 'ICON Support'
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e,
        });
    };

    render() {
        const { comments, submitting, value,usertype } = this.state;

        return (
            <>
                {/* // */}
                <Comment
                    author={
                        'ICON Support'
                    }
                    datetime={
                        new Date().toLocaleDateString() + " : " + new Date().toLocaleTimeString()
                    }
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="ICON Support"
                        />
                    }
                    content={
                        <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure), to help people create their product prototypes beautifully
                            and efficiently.
                                 </p>
                    }>
                </Comment>
                {/* // */}
                {comments.length > 0 && <CommentList comments={comments} />}
                <Tabs defaultActiveKey="2" onChange={(values) => this.setState({usertype: values === "1" ? "support" : "Dev"})}>
                    <TabPane tab="Reply To Customer" key="1" forceRender>
                            <Comment
                                style={{ marginRight: 50 }}
                                // avatar={
                                //     <Avatar
                                //         src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                //         alt="ICON Support"
                                //     />
                                // }
                                content={
                                    <TextEditor
                                        key="Editor1"
                                        onChange={this.handleChange}
                                        onSubmit={this.handleSubmit}
                                        submitting={submitting}
                                        value={value}
                                    />
                                }
                            />
                    </TabPane>


                    <TabPane tab="Reply To Internal" key="2" onClick={() => this.setState({usertype: "Dev"})}>
                        <Comment
                            style={{ marginRight: 16 }}
                            // avatar={
                            //     <Avatar
                            //         src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            //         alt="ICON Support"
                            //     />
                            // }
                            content={
                                <TextEditor
                                    key="Editor1"
                                    onChange={this.handleChange}
                                    onSubmit={this.handleSubmit}
                                    submitting={submitting}
                                    value={value}
                                />
                            }
                        />
                    </TabPane>
                </Tabs>

            </>
        );
    }
}
