import { Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

export default function PreviewImg({ ...props }) {
    return (
        <>
            <Modal
                {...props}
            >
                <img src={props.pathUrl} style={{ width: '100%' }}/>
            </Modal>
        </>
    )
}