import { Editor } from '@tinymce/tinymce-react';
import React, { forwardRef, useRef, useState, useImperativeHandle } from 'react';

export default forwardRef(function TextEditor(props, ref) {
    const [value, setValue] = useState(null)
    const editorRef = useRef(null)

    useImperativeHandle(ref, () => ({
        getValue: () => value,
        setvalue: () => editorRef.current.editor.setContent("")
    }));

    const image_upload_handler = (blobInfo, success, failure, progress) => {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", process.env.REACT_APP_API_URL + "/files?check_temp=0");

        xhr.upload.onprogress = function (e) {
            progress((e.loaded / e.total) * 100);
        };

        xhr.onload = function () {
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

            success(json.url);
        };

        xhr.onerror = function () {
            failure(
                "Image upload failed due to a XHR Transport error. Code: " + xhr.status
            );
        };

        formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    };

    return (
        <>
            <Editor
                ref={editorRef}
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
                    block_unsupported_drop: false,
                    paste_data_images: true,
                    images_upload_handler: image_upload_handler,
                    toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                    toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                }}
                onEditorChange={(content, editor) => setValue(content)}
            // onEditorChange={(content, editor) => { return (console.log("onEditorChange", content), setValue(content)) }}
            />
        </>
    )
})