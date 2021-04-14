import React, {Component} from 'react'
import {Layout, Divider, Form, Input, Icon, Button, message, notification} from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'

import { Row, Col } from 'antd';
import axios from "../../api";
import {API} from "../../api/config";
import moment from "moment";


const formItemLayout = {
    labelCol: {
        xs: { span: 16 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 10 }
    }
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 16,
            offset: 0
        },
        sm: {
            span: 10,
            offset: 6
        }
    }
}

class ProfileChangeView extends Component {
    state = {
        loading: false,
        countScan: 0
    }



    // countScan = 0

    componentDidMount() {
        let id = localStorage.getItem('ID')
        console.log(id)
        axios
            .get(`${API}/ResultsListByUserID/?UserID=${id}`, { })
            .then(res => {
                console.log(res.data)
                if (res.data.count) {
                    let count = res.data.count
                    console.log(res.data.count)
                    this.setState({countScan: count})
                } else {
                    // 这里处理一些错误信息
                }
            })
            .catch(err => {})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                let {username, email, password } = values

                axios
                    .patch(`${API}/Users/${localStorage.getItem('ID')}/`, {username, email, password })
                    .then(res => {
                        if (res.data.ID) {
                            // localStorage.setItem('user', JSON.stringify(res.data.data.user))
                            // localStorage.setItem('token', res.data.data.token)
                            console.log(res.data)
                            localStorage.setItem('userName', res.data.username)
                            localStorage.setItem('email', res.data.email)
                            this.props.history.push('/about')
                            message.success('Change profile successfully!')
                        } else {
                            // 这里处理一些错误信息
                        }
                    })
                    .catch(err => {})

                this.enterLoading()
                this.timer = setTimeout(() => {
                    // 单机登陆
                    // message.success('登录成功!')
                    // this.props.history.push('/')
                    // localStorage.setItem('userName', 'local name')

                    notification.open({
                        message: 'Fail to change',
                        duration: null,
                        description: ''
                    })

                    // message.success('Wrong user name or password!')
                    // this.setState({
                    //     loading: false
                    // })
                }, 2000)
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <Layout>
                <Row>
                    <CustomBreadcrumb arr={['Profile Change']}/>
                </Row>

                <div className='base-style'>
                    <Divider orientation='left'>Profile</Divider>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="Name">
                            {getFieldDecorator('username', {rules: [
                                { required: false, message: 'Please input your email'}]})
                            (
                                <Input placeholder= {localStorage.getItem('userName')} />
                            )}

                        </Form.Item>
                        <Form.Item label="Email">
                            {getFieldDecorator('email', {rules: [
                                    { required: false, message: 'Please input your email'}
                                ]})
                            (
                                <Input placeholder={localStorage.getItem('email')} />
                            )}

                        </Form.Item>

                        <Divider orientation='left'>Password Change</Divider>
                        <Form.Item label='Password' hasFeedback>
                            {getFieldDecorator('password', {rules: [
                                    {required: true, message: 'Please input your password'}
                                ]})
                            (
                                <Input.Password placeholder='Please input new password' />
                            )}

                        </Form.Item>
                        <Form.Item label='Confirm' hasFeedback>
                            {getFieldDecorator('confirm', {rules: [
                                    {required: true, message: 'Please confirm your password'}
                                ]})
                            (
                                <Input.Password placeholder='Please confirm password' />
                            )}

                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button
                                type='primary'
                                htmlType='submit'>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>

                </div>


                <div className='base-style'>
                    <Divider orientation='left'>STATS</Divider>
                    <p> Login time: {moment(localStorage.getItem('loginTime')).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p> Total Scan: {this.state.countScan}</p>

                </div>

            </Layout>
        );
    }
}


export default ProfileChangeView = Form.create({ name: 'ProfileChange' })(ProfileChangeView);