import React, { useEffect, useState } from 'react'
import { Table, Button} from 'antd';
import Column from 'antd/lib/table/Column';
import { EditOutlined } from '@ant-design/icons';
import Axios from 'axios'
import MasterPage from '../MasterPage'
import { useHistory } from 'react-router-dom';
import BatchRicef from './BatchRicef';


export default function Ricef() {
const history = useHistory();

    //data
    const [listcompany, setListcompany] = useState([]);
    const [selectcompany, setSelectcompany] = useState(null);

    const GetCompany = async (value) => {
        try {
            const company_all = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            if (company_all.status === 200) {
                setListcompany(company_all.data)
            }

            const companyby_id = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: value
                }
            });

            if (companyby_id.status === 200) {
                setSelectcompany(companyby_id.data)
            }


        } catch (error) {

        }
    }

    useEffect(() => {
        GetCompany()
    }, [])

    return (
        <MasterPage>
           <Table dataSource={listcompany} loading={false}>
                <Column title="Code" width="10%" dataIndex="Code" />
                <Column title="CompanyName" width="20%" dataIndex="Name" />
                <Column title="FullName" width="60%" dataIndex="FullNameTH" />
                <Column title=""
                    align="center"
                    width="10%"
                    render={(record) => {
                        return (
                            <>
                                <Button type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        return (
                                            GetCompany(record.Id),
                                            history.push({pathname: "/internal/ricef/comp-" + record.Id})
                                        )
                                    }
                                    }
                                >
                                    View
                                    </Button>
                            </>
                        )
                    }
                    }
                />

            </Table>
          
        </MasterPage>
    )
}
