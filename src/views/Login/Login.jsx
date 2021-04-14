import React, { Component } from 'react'
import { Layout, Input, Icon, Form, Button, Divider, message, notification } from 'antd'
import { withRouter } from 'react-router-dom'

import { API } from '../../api/config'
import '@/style/view-style/login.scss'
import axios from "../../api";

class Login extends Component {
    state = {
        loading: false
    }

    enterLoading = () => {
        this.setState({
            loading: true
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values of LOGIN form: ', values);
                let { username, password } = values

                axios
                    .post(`${API}/UserLogin/`, { username, password })
                    .then(res => {
                        let parseData = JSON.stringify(res.data)
                        console.log("login parseData  " + parseData)

                        if (res.data.ID) {

                            localStorage.setItem('ID', res.data.ID)
                            // console.log("login res ID " + res.data.ID)
                            localStorage.setItem('userName', res.data.username)

                            localStorage.setItem('userType', res.data.userType)
                            // console.log("login res type " + res.data.userType)
                            localStorage.setItem('loginTime', res.data.logintime)
                            // console.log("login res loginTime " + res.data.logintime)

                            localStorage.setItem('email', res.data.email)
                            // console.log("login res email " + res.data.email)

                            this.props.history.push('/')
                            message.success('Log in successfully!')
                        } else {
                            // 这里处理一些错误信息
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

                localStorage.setItem('user', JSON.stringify(values))
                this.enterLoading()
                this.timer = setTimeout(() => {
                    notification.open({
                        message: 'Wrong user name or password',
                        duration: 3,
                        description: ''
                    })
                    this.setState({
                        loading: false
                    })

                    // message.success('Wrong user name or password!')
                    // this.setState({
                    //     loading: false
                    // })
                }, 3000)
            }
        })
    }

    componentDidMount() {
        notification.open({
            message: 'Welcome to BIVULD SCANNER',
            duration: 3,
            description: ''
        })
    }

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
                                    rules: [{ required: true, message: 'Please input your email' }]
                                })(
                                    <Input
                                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder='email'
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
                                        placeholder='password'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={this.state.loading}>
                                    Log in
                                </Button>
                                <p className="Register">
                                    Or <a href="#/register">Register now!</a>
                                </p>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Form.create()(Login))
