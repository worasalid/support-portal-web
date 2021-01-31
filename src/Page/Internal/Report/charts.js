import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'


export default function Charts() {
    var data = [
        {
            company: 'ICONICONICON',
            status: 'Open',
            value: 1,
        },
        {
            company: 'ICON',
            status: 'InProgress',
            value: 2,
        },
        {
            company: 'ICON',
            status: 'Resolved',
            value: 2,
        },
        {
            company: 'ICON',
            status: 'Complete',
            value: 2,
        },
        {
            company: 'ICON2',
            status: 'Complete',
            value: 2,
        },
        {
            company: 'ICON3',
            status: 'Open',
            value: 5,
        },
        {
            company: 'ICON4',
            status: 'Open',
            value: 5,
        },
        {
            company: 'ICON5',
            status: 'Open',
            value: 5,
        },
        {
            company: 'ICON6',
            status: 'Open',
            value: 5,
        },
        {
            company: 'ICON7',
            status: 'Open',
            value: 7,
        },
        {
            company: 'ICON8',
            status: 'Open',
            value: 8,
        },
        {
            company: 'ICON9',
            status: 'Open',
            value: 9,
        },
        {
            company: 'ICON10',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON11',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON12',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON13',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON14',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON15',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON16',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON17',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON18',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON19',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON20',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON21',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON22',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON23',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON24',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON25',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON26',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON27',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON28',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON29',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON30',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON31',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON32',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON33',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON34',
            status: 'Open',
            value: 10,
        },
        {
            company: 'ICON35',
            status: 'Open',
            value: 10,
        },


    ];
    var config = {
        data: data,
        xField: 'company',
        yField: 'value',
        seriesField: 'status',
        //isPercent: true,
        isStack: true,
        
        slider: {
            start: 0,
            end: 2,
            maxLimit:100,
        },
        label: {
            position: 'middle',
            content: function content(item) {
                return item.value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
          },
        color: function color(x) {
            if (x.status === "Open") { return "gray" }
            if (x.status === "InProgress") { return "#5B8FF9" }
            if (x.status === "Resolved") { return "#FF5500" }
            if (x.status === "Cancel") { return "green" }
            if (x.status === "Complete") { return "#87D068" }

        },
    };
    return (
        <MasterPage>
            <div style={{ height: 400, width:"100%" }}>
                <Column {...config} scrollbar="true" xAxis={{position:"bottom"}} />
            </div>
        </MasterPage>
    )
}
