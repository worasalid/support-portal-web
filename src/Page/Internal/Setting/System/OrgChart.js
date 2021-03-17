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
                            { id: 1, name: "Amber McKenzie", title: "CEO", img: "https://cdn.balkan.app/shared/1.jpg" },
                            { id: 2, pid: 1, name: "Ava Field", title: "IT Manager", img: "https://cdn.balkan.app/shared/2.jpg", mobile: "0878108255" },
                            { id: 3, pid: 1,  name: "Peter Stevens", title: "HR Manager", img: "https://cdn.balkan.app/shared/3.jpg" },
                            { id: 4, pid: 3, name: "Avery Woods", title: "HR", img: "https://cdn.balkan.app/shared/4.jpg" }
                        ]
                    } />

                </div>
            </MasterPage>
        );
    }
}