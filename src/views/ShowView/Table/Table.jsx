import React, { Component } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import {Layout, Divider, Row, Col, Tag, Table, Button, Anchor, notification} from 'antd'
import '@/style/view-style/table.scss'
import axios from 'axios'
import {API} from "../../../api/config";
import moment from "moment";

const { Column } = Table
const { Link } = Anchor


class TableView extends Component {

    state = {
        tableData: [],
        total: 0,
        resultsList: [],
        columns : [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'File Name',
                dataIndex: 'fileName',
                key: 'fileName'
            },
            {
                title: 'Date Created',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                <Button type='link' href='#/report' onClick={() => {
                    localStorage.setItem('resultID', record.id)
                    console.log('result id: ' + localStorage.getItem('resultID'))
                }}>
                View</Button>

                <Divider type='vertical' />
                <Button type='link' onClick={() => {
                    let reportID = parseInt(record.id)
                    console.log('report id: ' + reportID)
                    window.open(`${API}/linkfile/?ID=${reportID}`)
                    // axios
                    //     .get(`${API}/linkfile/?ID=${reportID}/`, {})
                    //     .then(res => {
                    //         notification.open({
                    //             message: 'Download result successfully!',
                    //             duration: null,
                    //             description: ''
                    //         })
                    //     })
                    //     .catch(err => {
                    //         console.log(err)
                    //         notification.open({
                    //             message: 'Fail to download the result',
                    //             duration: null,
                    //             description: ''
                    //         })
                    //     })
                }}>Download</Button>

                <Divider type='vertical' />
                <Button type='link'onClick={() => {
                    // let UserID = localStorage.getItem('ID')
                    let deleteID = record.id
                    // if (!(parseInt(UserID) === 1)) {
                    //     notification.open({
                    //         message: 'Only admin allowed to delete!',
                    //         duration: null,
                    //         description: ''
                    //     })
                    //     return
                    // }
                    axios
                        .delete(`${API}/uploadfile/${deleteID}/`, {})
                        .then(res => {
                            notification.open({
                                message: 'Delete result successfully!',
                                duration: null,
                                description: ''
                            })
                            this.getData()
                        })
                        .catch(err => {
                            console.log(err)
                            notification.open({
                                message: 'Fail to delete the result',
                                duration: null,
                                description: ''
                            })
                        })
                }}>Delete</Button>
            </span>
                )
            }
        ]
    }

    getData() {
        axios
            .get(`${API}/ResultsListByUserID/?UserID=${localStorage.getItem('ID')}`, { })
            .then(res => {
                if (res.data.count) {

                    let countResults = res.data.count
                    let results = res.data.results
                    // console.log(resCountUser)

                    let tableData = []

                    for (let i = 0; i < countResults; i++) {
                        // console.log('id:' + resUsersList[i].username)
                        // let str = "" + results[i].DateUploaded
                        // console.log(results[i].DateUploaded)
                        let dateStr = moment(results[i].DateUploaded).format('YYYY-MM-DD HH:mm:ss')
                        const total = tableData.push({
                            key: i,
                            id: results[i].ID,
                            fileName: results[i].FileName,
                            date: dateStr
                        });
                        // console.log(' total ' + total)
                        // console.log('data ' + tableData)

                    }

                    this.setState({tableData: tableData,
                        total: countResults,
                        resultsList: results
                    })
                    // console.log('data: ' + resUsersList)
                } else {
                    // 这里处理一些错误信息
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['Reports List', '']}/>
                </div>

                <Row>
                    <Col>
                        <div className='base-style'>
                            <h3 id='basic'>Reports List</h3>
                            <Divider />
                            <Table columns={this.state.columns} dataSource={this.state.tableData}/>
                        </div>
                    </Col>
                </Row>
            </Layout>
        );
    }
}


export default TableView
