import React, { Component } from 'react'
import {Layout, Row, Col, Upload, message, Button, Icon, Divider, Modal, Table, Anchor, Tag, notification} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb'
import {API} from "../../../api/config";
import axios from "axios";

const { Dragger } = Upload


function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

function getBase_64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
}

const { Column } = Table
const { Link } = Anchor


// let countUser = 0
// let usersList = []
// let data = []

// const Table1 = () => <Table columns={columns} dataSource={data} />

// class Table1 extends Component {
//     componentDidMount() {
//
//     }
//
//     render() {
//         console.log('xxx:' + this.data)
//         return (
//             <Table columns={columns} dataSource={this.data} />
//         )
//     }
// }



class UploadView extends Component {
    state = {
        loading: false,
        previewVisible: false,
        previewImage: '',
        canRecover: 0,
        imageUrl: '',

        // fileList: [
        //     {
        //         uid: '-1',
        //         name: 'image.png',
        //         status: 'done',
        //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        //     },
        //     {
        //         uid: '-2',
        //         name: 'image.png',
        //         status: 'done',
        //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        //     },
        //     {
        //         uid: '-3',
        //         name: 'image.png',
        //         status: 'done',
        //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        //     },
        //     {
        //         uid: '-4',
        //         name: 'image.png',
        //         status: 'done',
        //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        //     },
        //     {
        //         uid: '-5',
        //         name: 'image.png',
        //         status: 'done',
        //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        //     }
        // ],

        columns : [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render: text => <Button type='link'>{text}</Button>
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (

                    <span>
                <Button type='link'  onClick={() => {
                    let UserID = localStorage.getItem('ID')
                    let deleteID = record.id
                    if (!(parseInt(UserID) === 1)) {
                        notification.open({
                            message: 'Only admin allowed to delete!',
                            duration: null,
                            description: ''
                        })
                        return
                    }
                    axios
                        .post(`${API}/userdelete/`, {UserID, deleteID })
                        .then(res => {
                            if (res.data.msg === 'success') {

                                notification.open({
                                    message: 'Delete user successfully!',
                                    duration: null,
                                    description: ''
                                })
                                this.getData()
                                // this.props.history.push('#/others/upload/')
                            } else {
                                // 这里处理一些错误信息
                                notification.open({
                                    message: 'Fail to delete the user',
                                    duration: null,
                                    description: ''
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }}>Delete</Button>
            </span>
                )
            }
        ],
        countUser : 0,
        usersList : [],
        data : [],
        modelColumns : [
            {
                title: 'Model Name',
                dataIndex: 'modelName',
                key: 'modelName'
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Update Date',
                dataIndex: 'updateDate',
                key: 'updateDate'
            }],
        modelData: []
    }


    checkRecoverBtn() {
        axios
            .get(`${API}/userlist/?UserID=${localStorage.getItem('ID')}`, { })
            .then(res => {
                if (res.data.count) {

                    let canrecover = res.data.canrecover
                    console.log('check canrecover: ' + canrecover)
                    // localStorage.setItem('canrecover', canrecover)
                    this.setState({canRecover: canrecover})
                } else {
                    // 这里处理一些错误信息
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    getData() {
        axios
            .get(`${API}/userlist/?UserID=${localStorage.getItem('ID')}`, { })
            .then(res => {
                if (res.data.count) {

                    // let parseData = JSON.stringify(res)
                    // console.log("scan parseData  " + parseData)

                    let resCountUser = res.data.count
                    let resUsersList = res.data.results
                    // console.log(resCountUser)

                    let tableData = []

                    for (let i = 0; i < resCountUser; i++) {
                        // console.log('id:' + resUsersList[i].username)
                        const total = tableData.push({
                            key: i,
                            id: resUsersList[i].ID,
                            name: resUsersList[i].username,
                            email: resUsersList[i].email
                        });
                        // console.log(' total ' + total)
                        // console.log('data ' + tableData)

                    }

                    let canrecover = res.data.canrecover
                    console.log('getdata canrecover: ' + canrecover)
                    // localStorage.setItem('canrecover', canrecover)

                    this.setState({data: tableData,
                        countUser: resCountUser,
                        canRecover: canrecover,
                        usersList: resUsersList
                    })

                    // console.log('data: ' + resUsersList)
                } else {
                    // 这里处理一些错误信息
                }
            })
            .catch(err => {
                console.log(err)
            })

        axios
            .get(`${API}/modelinfo/`, { })
            .then(res => {
                let modelArr = []
                modelArr = res.data.msg
                if (modelArr.length >= 1) {

                    let modelTableData = []

                    for (let i = 0; i < modelArr.length; i++) {
                        // console.log('id:' + resUsersList[i].username)
                        const total = modelTableData.push({
                            modelName: modelArr[i].ModelName,
                            description: modelArr[i].Description,
                            updateDate: modelArr[i].UpdateDate
                        });

                    }

                    this.setState({modelData: modelTableData
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


    handleRecover = e => {
        e.preventDefault()
        let UserID = localStorage.getItem('ID')
        axios
            .post(`${API}/usepremodel/`, {UserID})
            .then(res => {
                if (res.data.msg === 'success') {
                    console.log(res.data)
                    // this.props.history.push('/others/upload')
                    message.success('Recover model successfully!')
                    this.checkRecoverBtn()
                } else {
                    // 这里处理一些错误信息
                    this.timer = setTimeout(() => {
                        notification.open({
                            message: 'Fail to recover',
                            duration: null,
                            description: ''
                        })

                    }, 10000)
                }
            })
            .catch(err => {})
        // this.enterLoading()

    }

    // handleChange = info => {
    //     if (info.file.status === 'uploading') {
    //         this.setState({ loading: true })
    //     }
    //     if (info.file.status === 'done') {
    //         // Get this url from response in real world.
    //         getBase64(info.file.originFileObj, imageUrl =>
    //             this.setState({
    //                 imageUrl,
    //                 loading: false
    //             })
    //         )
    //     }
    // }

    // handleCancel = () => this.setState({ previewVisible: false })

    // handlePreview = async file => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase_64(file.originFileObj)
    //     }
    //
    //     this.setState({
    //         previewImage: file.url || file.preview,
    //         previewVisible: true
    //     })
    // }
    // handle_Change = ({ fileList }) => this.setState({ fileList })

    handleModelUploadChange =(info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file)
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} model upload successfully`)
            this.checkRecoverBtn()
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} model upload failed.`)
            // console.log(" info.file " + info.file)
        }
        else {
            // this.timer = setTimeout(() => {`
            //     notification.open({
            //         message: 'Fail to upload a model',
            //         duration: null,
            //         description: ''
            //     })
            //
            // }, 240000)
        }
    }



    render() {
        const props = {
            name: 'uploadlocation',
            accept: '.h5',
            action: `${API}/uploadmodelfile/`,
            headers: {
                authorization: 'authorization-text'
            },
            data: { UserID: localStorage.getItem("ID"), },
            onChange:this.handleModelUploadChange,
        }

        // const uploadButton = (
        //     <div>
        //         <Icon type={this.state.loading ? 'loading' : 'plus'} />
        //         <div className='ant-upload-text'>Upload</div>
        //     </div>
        // )
        // const { imageUrl, previewVisible, previewImage, fileList } = this.state
        return (
            <Layout>
                <div>
                    <CustomBreadcrumb arr={['Administration', '']}/>
                </div>

                <Row gutter={8}>
                    <Col span={12}>
                        <div className='base-style'>
                            <h3>USERS</h3>
                            {/*<Table1/>*/}
                            <Table columns={this.state.columns} dataSource={this.state.data} />
                        </div>
                        <div className='base-style'>
                            <Divider orientation='left'>MODEL TABLE</Divider>
                            <Table columns={this.state.modelColumns} dataSource={this.state.modelData}/>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className='base-style'>
                            <Divider orientation='left'>LAST MODEL</Divider>
                            <Button size={"default"} shape={"round"} disabled={!this.state.canRecover} onClick={this.handleRecover}>Recover</Button>
                        </div>
                        <div className='base-style'>
                            <Divider orientation='left'>MODEL CHANGE ( BIVULD OR SOURCE CODE )</Divider>
                            <Dragger {...props}>
                                <p className='ant-upload-drag-icon'>
                                    <Icon type='inbox' />
                                </p>
                                <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                                <p className='ant-upload-hint'>
                                    FILENAME FORMAT MUST BE SOURCEXXXXXX.H5, BINARYXXXXXX.H5, OR CANXXXXXXX.DATA-00000-OF-00001
                                </p>
                            </Dragger>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default UploadView
