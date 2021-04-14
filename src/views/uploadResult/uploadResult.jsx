import React, {Component} from 'react'
import {Layout, Divider, notification, Result, Spin, Button} from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import axios from "../../api";
import {API} from "../../api/config";


class uploadResultView extends Component {

    constructor(props) {
        super(props);

        this.state = {loadingID: false}

        this.jumpToReport = this.jumpToReport.bind(this)
        this.jumpToHome = this.jumpToHome.bind(this)
        this.handleScan = this.handleScan.bind(this)
        // this.handleCancel = this.handleCancel.bind(this)
    }

    jumpToReport() {
        // localStorage.setItem('resultID', "146")
        let { history } = this.props
        if (this.state.loadingID) {
            history.push({pathname: '/report'})
        }

    }

    jumpToHome() {
        // localStorage.setItem('resultID', "146")
        this.setState({loadingID: false}, ()=>{
            let { history } = this.props
            history.push({pathname: '/index'})
        })

    }

    handleScan() {
        this.setState({loadingID: true}, ()=>{
            notification.open({
                type:'info',
                message: 'The model is scanning the file!',
                duration: 3,
                description: 'It might takes a few minutes. A report will be shown automatically when it is ready. You can click the Cancel button to abort it.'
            })

            let content = {userID:localStorage.getItem("ID"),
                fileID:localStorage.getItem("uploadID")}

            // request to scan
            fetch(`${API}/scanfile/`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content)
            })
                .then(r => r.json())
                .then(data => {
                    console.log("fetch data " + data)
                    console.log("fetch data ID " + data.ResultsID)
                    localStorage.setItem('resultID', data.ResultsID)

                    this.jumpToReport()
                })
        })

    }

    render() {
        return(
            <Layout>
                <div>
                    <CustomBreadcrumb arr={['Scan Result']}/>
                </div>
                <div className='base-style'>

                    <Result
                        status="success"
                        title="Successfully upload the file!"
                        subTitle="You can scan the file and view the report now. It might takes several minutes. Do you want to scan it? "
                        extra={[
                            <Button key="Cancel" onClick={this.jumpToHome}>
                                Cancel
                            </Button>,
                            <Button loading={this.state.loadingID} type="primary" key="Scan" onClick={this.handleScan}>
                                Scan
                            </Button>,
                        ]}
                    />
                </div>

            </Layout>
        )
    }
}
export default uploadResultView