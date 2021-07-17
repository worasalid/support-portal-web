import { Editor } from '@tinymce/tinymce-react';
import React, { forwardRef, useRef, useState, useImperativeHandle } from 'react';

export default forwardRef(function TextEditor(props = null, ref) {
    const [value, setValue] = useState(null);
    const [fileList, setFileList] = useState([]);
    const editorRef = useRef(null)

    useImperativeHandle(ref, () => ({
        getValue: () => value,
        setvalue: () => editorRef.current.editor.setContent(""),
        getFiles: () => fileList,
    }));


    const image_upload_handler = (blobInfo, success, failure, progress) => {

        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        // xhr.open("POST", process.env.REACT_APP_API_URL + "/files?check_temp=0");
        xhr.open("POST", process.env.REACT_APP_API_URL + "/files/upload");

        xhr.upload.onprogress = function (e) {
            progress((e.loaded / e.total) * 100);
        };

        xhr.onload = function (data) {
            var json;
            if (xhr.status === 403) {
                failure("HTTP Error: " + xhr.status, { remove: true });
                return;
            }

            if (xhr.status < 200 || xhr.status >= 300) {
                failure("HTTP Error: " + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.url != "string") {
                failure("Invalid JSON: " + xhr.responseText);
                return;
            }

            // success(json.url);
            success(json.googledrive_url);
        };

        xhr.onerror = function () {
            failure(
                "Image upload failed due to a XHR Transport error. Code: " + xhr.status
            );
        };

        formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());
        formData.append("ticket",props.ticket_id);

        xhr.send(formData);
    };

    return (
        <>
            <Editor
                ref={editorRef}
                apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
                value={props?.value === undefined ? "" : props?.value}

                init={{
                    height: (props?.init?.height === undefined ? 300 : props?.init?.height),
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    block_unsupported_drop: false,
                    paste_data_images: true,
                    images_upload_handler: image_upload_handler,
                    toolbar1: (props?.init?.toolbar1 === undefined ?
                        'undo redo | bold italic underline forecolor fontsizeselect | link image' : props?.init?.toolbar1[0]),
                    toolbar2: (props?.init?.toolbar2 === undefined ?
                        'alignleft aligncenter alignright alignjustify bullist numlist preview' : props?.init?.toolbar2[0]),
                }}
                onEditorChange={(content, editor) => { setValue(content); console.log("content", content) }}
            // onEditorChange={(content, editor) => { return (console.log("onEditorChange", content), setValue(content)) }}
            />
        </>
    )
})