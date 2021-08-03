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

        this.chart.editUI.on('field', function(sender, args){
            console.log("xxx",sender.editUI)
            if (args.type == 'edit' && args.name == 'title'){

                var txt = args.field.querySelector('input');
                var txtVal = txt.value;
                if (txt){
                    txt.style.color = "red";  
                    
                    var select = document.createElement('select');
                    select.innerHTML = '<option value="CEO">CEO</option>' 
                    + '<option value="IT Manager">IT Manager</option>'
                    + '<option value="HR Manager">HR Manager</option>';
                    
                    select.style.width = '100%';                    
                    select.setAttribute('val', '');
                    select.style.fontSize = '16px';
                    select.style.color = 'red';
                    select.style.paddingTop = '7px';
                    select.style.paddingBottom = '7px';
                    select.value = txtVal;
                    
                    txt.parentNode.appendChild(select);
                    txt.parentNode.removeChild(txt);
                }
            }
	    });
    }

    render() {
        return (
            <div id="tree" ref={this.divRef}></div>
        );
    }
}