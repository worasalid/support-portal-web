import React, { Component } from 'react';
import MasterPage from '../../MasterPage';
import OrgChart from '../../../../Component/OrgChart';
import { UserOutlined } from '@ant-design/icons';




export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MasterPage>
                <div style={{ height: '100%' }}>

                    <OrgChart nodes={
                        [
                            { id: 1, name: "K. Wannathep ", title: "CEO", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 2, pid: 1, name: "K.Nithi", title: "CFO", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 3, pid: 1, name: "K.Navarat", title: "COO/BD", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "000" },
                            { id: 4, pid: 3, name: "K.Watchara", title: "Project Director", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 5, pid: 3, name: "K.Anupong", title: "CIO", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 6, pid: 3, name: "K.Natthapong", title: "CTO", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 7, pid: 4, name: "K.Sukanya", title: "PM/BD", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "000" },
                            { id: 8, pid: 4, name: "Team1", title: "Consult", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 9, pid: 4, name: "Team2", title: "Consult", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 10, pid: 8, name: "Santi", title: "Consult", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 11, pid: 8, name: "Wannaporn", title: "Consult", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 12, pid: 8, name: "Jarusdao", title: "Consult", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 13, pid: 8, name: "Thippawan", title: "Consult", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 14, pid: 8, name: "Anchalee", title: "Consult", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "000" },
                            { id: 15, pid: 9, name: "Sasimaporn", title: "Consult", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "000" },
                            { id: 16, pid: 9, name: "Chanita", title: "Consult", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "000" },
                            { id: 17, pid: 4, name: "", title: "PM Legacy",tags:[""], img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 18, pid: 5, name: "K.Kittipong", title: "Development Director/SA",tags:[""], img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 19, pid: 18, name: "Naphat", title: "BA", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 20, pid: 19, name: "Parayu", title: "BA", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 21, pid: 18, name: "UX/UI", title: "UX/UI" },
                            { id: 22, pid: 21, name: "Kannipa", title: "UX/UI", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                            { id: 23, pid: 21, name: "Paphanun", title: "UX/UI", img: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", mobile: "000" },
                        ]
                    }

                    />

                </div>
            </MasterPage>
        );
    }
}