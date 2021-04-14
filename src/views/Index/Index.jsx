import React, { Component } from 'react'
import {Result, Spin, Modal, Layout, Row, Col, Icon, Divider, Upload, Button, message, notification} from 'antd'
import screenfull from 'screenfull'
import '@/style/view-style/index.scss'
import { withRouter } from 'react-router-dom'


import { Typography } from 'antd';
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import {API} from "../../api/config";
import axios from "../../api";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const { Dragger } = Upload
const { confirm } = Modal;

class Index extends Component {
    constructor(props) {
        super(props);

        // this.state = {loadingID: false}

        // this.jumpToReport = this.jumpToReport.bind(this)
        // this.handleScan = this.handleScan.bind(this)
        this.handleUploadChange = this.handleUploadChange.bind(this)
        // this.handleCancel = this.handleCancel.bind(this)
    }

    // jumpToReport() {
    //     // localStorage.setItem('resultID', "146")
    //     let { history } = this.props
    //     history.push({pathname: '/report'})
    // }
    //
    // handleScan() {
    //     // return new Promise((resolve, reject) => {
    //     //     setTimeout(Math.random() > 0.5 ? resolve : reject, 12000);
    //     //
    //     //     notification.open({
    //     //         message: 'The model is scanning the file!',
    //     //         duration: null,
    //     //         description: 'It might takes a few minutes. A report will be shown automatically when it is ready'
    //     //     })
    //     //
    //     //     let content = {userID:localStorage.getItem("ID"),
    //     //         fileID:localStorage.getItem("uploadID")}
    //     //
    //     //     // request to scan
    //     //     fetch(`${API}/scanfile/`, {
    //     //         method: 'post',
    //     //         headers: {
    //     //             'Content-Type': 'application/json'
    //     //         },
    //     //         body: JSON.stringify(content)
    //     //     })
    //     //         .then(r => r.json())
    //     //         .then(data => {
    //     //             console.log("fetch data " + data)
    //     //             console.log("fetch data ID " + data.ResultsID)
    //     //             localStorage.setItem('resultID', data.ResultsID)
    //     //
    //     //             this.jumpToReport()
    //     //         })
    //     //
    //     // }).catch(() => console.log('Scan Promise errors!'));
    //     this.setState({loadingID: true})
    //     notification.open({
    //         type:'info',
    //         message: 'The model is scanning the file!',
    //         duration: null,
    //         description: 'It might takes a few minutes. A report will be shown automatically when it is ready'
    //     })
    //
    //     let content = {userID:localStorage.getItem("ID"),
    //         fileID:localStorage.getItem("uploadID")}
    //
    //     // request to scan
    //     fetch(`${API}/scanfile/`, {
    //         method: 'post',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(content)
    //     })
    //         .then(r => r.json())
    //         .then(data => {
    //             console.log("fetch data " + data)
    //             console.log("fetch data ID " + data.ResultsID)
    //             localStorage.setItem('resultID', data.ResultsID)
    //
    //             this.jumpToReport()
    //         })
    // }
    //
    // handleCancel() {
    //
    // }
    //
    // showConfirm() {
    //     confirm({
    //         title: 'Successfully upload the file!',
    //         content: 'You can scan the file and view the report now. Do you want to scan it? ',
    //         onOk:this.handleScan,
    //         onCancel:this.handleCancel,
    //     });
    // }


    handleUploadChange =(info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`)
            let parseData = JSON.stringify(info.file.response)
            console.log("scan parseData  " + parseData)

            let arr = []
            arr = info.file.response
            // let arr1 = []
            // arr1 = arr["msg"]
            // console.log(" response result id " + arr1["ResultsID"])
            // let resultID = arr1["ResultsID"]
            // localStorage.setItem('resultID', resultID)
            // let { history } = this.props
            // history.push({pathname: '/report'})
            let id = arr["id"]
            console.log(" response scan id " + id)
            console.log(" response scan USER id " + arr["UserID"])
            localStorage.setItem('uploadID',id)

            // this.showConfirm()
            let { history } = this.props
            history.push({pathname: '/scanResult'})



        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
        else {
            // this.timer = setTimeout(() => {
            //     notification.open({
            //         message: 'Fail to upload',
            //         duration: null,
            //         description: ''
            //     })
            //
            // }, 240000)
        }
    }


    fullToggle = () => {
        if (screenfull.isEnabled) {
            screenfull.request(document.getElementById('bar'))
        }
    }
    render() {
        const props = {
            name: 'uploadlocation',
            accept: '.o, .asm, .exe',
            // action: 'http://121.5.57.180:8000/api/uploadfile/',
            action: `${API}/uploadfile/`,
            data: { UserID: localStorage.getItem("ID"), },
            headers: {
                authorization: 'authorization-text'
            },
            onChange: this.handleUploadChange,
        };
        return (
            <Layout className='index animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['']}/>
                </div>
                <Row>
                    <div className='base-style'>
                        <div className='bar-header'>
                            <Title>Welcome to the BIVULD scanner</Title>
                            {/*<Icon type='fullscreen' style={{ cursor: 'pointer' }} onClick={this.fullToggle} />*/}
                        </div>
                        <Divider />
                        <p>Please press the upload button to begin.</p>
                        {/*<BarEcharts />*/}

                    </div>
                </Row>
                <Layout>
                    <Row>
                        <div className='base-style'>
                            <Divider orientation='left'>Upload a file</Divider>
                            <Dragger {...props}>
                                <p className='ant-upload-drag-icon'>
                                    <Icon type='inbox' />
                                </p>
                                <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                                <p className='ant-upload-hint' >FILENAME FORMAT MUST BE XXX.o OR XXX.asm</p>
                            </Dragger>
                        </div>
                        {/*<div>*/}
                        {/*    <Spin size="large" spinning={this.state.loadingID}>*/}
                        {/*        <Dragger {...props}>*/}
                        {/*            <p className='ant-upload-drag-icon'>*/}
                        {/*                <Icon type='inbox' />*/}
                        {/*            </p>*/}
                        {/*            <p className='ant-upload-text'>Click or drag file to this area to upload</p>*/}
                        {/*            <p className='ant-upload-hint' >FILENAME FORMAT MUST BE XXX.o OR XXX.asm</p>*/}
                        {/*        </Dragger>*/}
                        {/*    </Spin>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <Button onClick={this.jumpToReport}>jump</Button>*/}
                        {/*</div>*/}
                    </Row>
                </Layout>

            </Layout>
        )
    }
}

export default Index
