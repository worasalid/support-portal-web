import React, { Component } from 'react';
import OrgChart from '@balkangraph/orgchart.js';



export default class extends Component {

    constructor(props) {
        super(props);
        this.divRef = React.createRef();
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.chart = new OrgChart(this.divRef.current, {
            nodes: this.props.nodes,
            mouseScrool: OrgChart.action.edit,
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            },
            nodeMenu:{
            	details: {text:"Details"},
            	edit: {text:"Edit"},
            	add: {text:"Add"},
            	remove: {text:"Remove"},
            },
            toolbar: {
                fullScreen: true,
                zoom: true,
                fit: true,
                expandAll: true
            },
            
        });
       
        this.chart.on("added", function (sender, id,node) {
            sender.editUI.show(id);
            console.log(sender.editUI.node.parent.id)
            console.log(sender.editUI.node.parent.pid)
        });
    }

    render() {
        return (
            <div id="tree" ref={this.divRef}></div>
        );
    }
}