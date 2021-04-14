import React, { Component } from 'react'
import { Layout, Input, Icon, Form, Button, Divider, message, notification } from 'antd'
import { withRouter } from 'react-router-dom'
// import axios from '@/api'
// import { API } from '@/api/config'
import '@/style/view-style/login.scss'
import axios from "../../api";
import {API} from "../../api/config";

class Register extends Component {
    state = {
        loading: false
    }

    enterLoading = () => {
        this.setState({
            loading: true
        })
    }

    handleSubmit  = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let { username, password, email } = values
                axios
                    .post(`${API}/UserRegister/`, { username, password, email })
                    .then(res => {
                        if (res.data.ID) {
                            // localStorage.setItem('user', JSON.stringify(res.data.data.user))
                            // localStorage.setItem('token', res.data.data.token)
                            console.log(res.data)
                            // localStorage.setItem('ID', res.data.ID)
                            // localStorage.setItem('userName', res.data.username)
                            // localStorage.setItem('userType', res.data.usertype)
                            // localStorage.setItem('loginTime', res.data.logintime)
                            // localStorage.setItem('email', res.data.email)
                            message.success('Register successfully!')
                            this.timer = setTimeout(() => {
                                this.props.history.push('/login')
                            }, 1000)


                        } else {
                            // 这里处理一些错误信息
                            notification.open({
                                message: 'Fail to register',
                                duration: null,
                                description: ''
                            })
                        }
                    })
                    .catch(err => {})

                // 这里可以做权限校验 模拟接口返回用户权限标识
                // switch (values.username) {
                //     case 'admin':
                //         values.auth = 0
                //         break
                //     default:
                //         values.auth = 1
                // }

                // localStorage.setItem('user', JSON.stringify(values))
                // this.enterLoading()
                // this.timer = setTimeout(() => {
                //     // 单机登陆
                //     // message.success('登录成功!')
                //     // this.props.history.push('/')
                //     // localStorage.setItem('userName', 'local name')
                //
                //     notification.open({
                //         message: 'Fail to register',
                //         duration: null,
                //         description: ''
                //     })
                //
                //     // message.success('Wrong user name or password!')
                //     // this.setState({
                //     //     loading: false
                //     // })
                // }, 3000)
            }
        })
    }

    // componentDidMount() {
    //     notification.open({
    //         message: '欢迎使用后台管理平台',
    //         duration: null,
    //         description: '账号 admin(管理员) 其他(游客) 密码随意'
    //     })
    // }

    componentWillUnmount() {
        notification.destroy()
        this.timer && clearTimeout(this.timer)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Layout className='login animated fadeIn'>
                <div className='model'>
                    <div className='login-form'>
                        <h3>BIVULD SCANNER</h3>
                        <Divider />
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please input your username' }]
                                })(
                                    <Input
                                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder='username'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your password' }]
                                })(
                                    <Input
                                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type='password'
                                        placeholder='Please input your password'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Please input your email' }]
                                })(
                                    <Input
                                        prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}

                                        placeholder='Please input your email'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={this.state.loading}>
                                    Register
                                </Button>
                                <p className="Login text-right">
                                    <a href="#">Log in</a>
                                </p>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Form.create()(Register))
