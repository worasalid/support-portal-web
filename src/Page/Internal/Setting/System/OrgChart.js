import React, { Component } from 'react';
import MasterPage from '../../MasterPage';
import OrgChart from '../../../../Component/OrgChart';




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
                            { id: 1, name: "P. L ", title: "CEO", img: "http://localhost:4000/files/72" },
                            { id: 2, pid: 1, name: "Ava Field", title: "Developer", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "0878108255" },
                            { id: 3, pid: 1, name: "Peter Stevens", title: "HR Manager", img: "https://cdn.balkan.app/shared/3.jpg" },
                            { id: 4, pid: 1, name: "Avery Woods", title: "Sale & Margeting", img: "https://cdn.balkan.app/shared/4.jpg" },
                            { id: 5, pid: 1, name: "Avery Woods", title: "Accounting ", img: "https://cdn.balkan.app/shared/4.jpg" },
                            { id: 6, pid: 3, name: "Avery Woods", title: "HR", img: "https://cdn.balkan.app/shared/4.jpg" },
                            { id: 7, pid: 2, name: "A", title: "H.Developer", img: "https://cdn.balkan.app/shared/4.jpg" },
                            { id: 8, pid: 2, name: "B", title: "H.Developer", img: "https://cdn.balkan.app/shared/4.jpg" },
                            { id: 9, pid: 2, name: "C", title: "H.Developer", img: "https://cdn.balkan.app/shared/4.jpg" }
                        ]
                    }

                    />

                </div>
            </MasterPage>
        );
    }
}