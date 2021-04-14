import React, { Component } from 'react'
import { Layout, Input, Icon, Form, Button, Divider, message, Row, Col, Descriptions, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
// import { API } from '@/api/config'
// import '@/style/view-style/login.scss'
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import red from "../../style/reportDescription.css"

// import BarEcharts from '../Index/bar'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
import {API} from "../../api/config";
import lineStyle from "echarts/src/model/mixin/lineStyle";
import {color} from "echarts/src/export";

// class Bar extends Component {
//     componentDidMount()
//     render() {
//         return <div id='bar' style={{ height: 400, background: '#fff' }}/>
//     }
// }

const { Search } = Input;
let picked_function = 0;

class ReportView extends Component {
    state = {
        time_taken: 0,
        fsize: 0,
        Functions: [],
        vul_Functions : [],
        highestVulnerability: '',
        topK: 20,
        showedFunctions: [],
        totalFunction: 0,
        totalIssue: 0,
        totalWarnings: 0,
        binaryCode: [],
        asmCode: [],
        recommendation: '',
        detailedFunctionIndex: 0,
        detailedFunctionVul: 0,
        probList: [],
        attentionWords: [],
        binaryCodeShowed: "",
        asmCodeShowed: '',
        function_number: ''
    }

    handleCodeToRed() {
        // 对binaryCode的每个str都查找是不是在 attentionWords里，在的话把底标用redCodeIndex记录
        let redCodeIndex = []
        for ( let i = 0; i < this.state.binaryCode.length; i++) {
            if ( this.state.attentionWords.includes(this.state.binaryCode[i]) ) {
                redCodeIndex.push(i)
                // console.log("i " + i)
            }
        }
        console.log('redCodeIndex  is ' + redCodeIndex)

        // 按照redCodeIndex记录的底标查找binaryCode数组中的字符串并替换成有标签的字符串
        let tem = []
        tem = this.state.binaryCode //获得字符串数组
        console.log('HexCode length ' + tem.length)
        let binaryResult = ""
        for ( let i = 0; i < tem.length; i++) {

            if ( redCodeIndex.includes(i)) {
                // console.log("i " + i)
                let str = tem[i] + " "
                let htmlStr= str.replace(tem[i], ('<span class="red">' + tem[i] + '</span > <br/>'))
                binaryResult += htmlStr
            }
            else {
                binaryResult += (tem[i] + "<br/>")
            }
        }
        // console.log("tem " + tem)
        // console.log("binaryResult " + binaryResult)
        this.setState({binaryCodeShowed: binaryResult})

        // 按照redCodeIndex记录的底标查找asmCode数组中的字符串并替换成有标签的字符串
        let temAsm = []
        temAsm = this.state.asmCode //获得字符串数组
        console.log('AsmCode length ' + temAsm.length)
        let asmResult = ""
        for ( let j = 0; j < temAsm.length; j++) {

            if ( redCodeIndex.includes(j)) {
                // console.log("j " + j)
                let str = temAsm[j] + " "
                let htmlStr= str.replace(temAsm[j], ('<span class="red">' + temAsm[j] + '</span > <br/>'))
                asmResult += htmlStr
            }
            else {
                asmResult += (temAsm[j] + "<br/>")
            }
        }
        // console.log("tem " + tem)
        // console.log("binaryResult " + binaryResult)
        this.setState({asmCodeShowed: asmResult})
    }

    generateYData(){
        let YData = []
        // console.log('gene topk:' + this.state.topK)
        // console.log('gene probList:' + this.state.probList)
        for(let i = 0; i < this.state.topK ;i++){
            YData.push(
                {
                    value: this.state.probList[i],
                    itemStyle: {
                        // color: this.state.probList[i]>53? '#a90000' : (this.state.probList[i]>40? 'orange':'green' ),
                        color: this.state.showedFunctions[i].class_vul === "Vulnerable"? '#a90000' : (this.state.showedFunctions[i].class_vul === "Warning"? 'orange':'green' ),
                        backgroundColor:'black'
                    }
                }
            )
        }
        // console.log(' generate YData:' + YData)
        return YData
    }

    initChart() {
        let myChart = echarts.init(document.getElementById('bar'))

        let i = 0
        let xData = []
        for (let i=0; i< this.state.topK; i++) {
            xData.push(i)
        }
        // console.log('init Xdata: ' + xData)
        let option = {
            xAxis: {
                type: 'category',
                //data这里可以存上对应的function的index, 点击后触发事件会把这个传过去
                data: xData,
                // data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
                splitLine:{show:false},
                axisLine: {show: false},
                axisTick: {show: false},
                axisLabel:{show:false},
            },
            yAxis: {
                type: 'value',
                max:100,
                min:0,
            },

            series: [{
                barWidth : 10,//设置柱体宽度，要多细就多细
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                },
                //设置每一个柱体的内容， value表示漏洞可能性，红色是有漏洞，橘黄色是警告，蓝色是安全
                data: this.generateYData(),
                type: 'bar'
            }],
            //datazoom设置滚动条的参数，范围是百分比
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 0,
                    end: 50
                },{
                    type: 'inside',
                    orient: 'vertical'
                },{
                    type: 'slider',
                    orient: 'vertical',
                    showDataShadow: true,
                    handleSize: '80%',
                    left: 10,
                }
            ]
        }

        myChart.setOption(option);

        // 处理点击事件并且弹出数据名称
        myChart.on('click',  (params) => {
            //在这里处理点击事件
            // alert(params.name);
            this.handleDetailChange(params.name)
        })
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    }

    handleDetailChange(functionIndex) {
        let vulProb = (this.state.Functions[functionIndex].Prob * 100).toFixed(2)
        let binaryCode = this.state.Functions[functionIndex].HexCode
        let asmCode = this.state.Functions[functionIndex].AsmCode
        let recommendation = this.state.Functions[functionIndex].Recommendation
        let attentionWords = this.state.Functions[functionIndex].AttentionWords
        let function_number = this.state.Functions[functionIndex].function_number
        this.setState({binaryCode: binaryCode,
            asmCode: asmCode,
            recommendation: recommendation,
            detailedFunctionIndex: functionIndex,
            detailedFunctionVul:vulProb,
            attentionWords:attentionWords,
            function_number:function_number}, ()=>{
            console.log("change asmcode: " + this.state.asmCode)
            console.log("change binarycode: " + this.state.binaryCode)
            this.handleCodeToRed()
        })
    }

    getResultData() {
        let resultID = localStorage.getItem('resultID')
        console.log('Page Report result id ' + resultID)
        axios
            .get(`${API}/ResultsDetail/?ID=${resultID}`, { })
            .then(res => {
                if (res.data.ID) {

                    console.log('result id ' + res.data.ID)

                    this.setState({time_taken: res.data.ResultObject.time_taken})
                    this.setState({fsize : res.data.ResultObject.fsize})
                    // console.log('REPORT res.time_taken ' + res.data.ResultObject.time_taken)
                    // console.log('REPORT res.fsize ' + res.data.ResultObject.fsize)

                    this.setState({Functions : res.data.ResultObject.Functions})
                    this.setState({vul_Functions : res.data.ResultObject.vul_Functions})
                    // console.log('REPORT res.data.ResultObject.Functions ' + res.data.ResultObject.Functions)
                    // console.log('REPORT res.data.ResultObject.vul_Functions ' + res.data.ResultObject.vul_Functions)

                    let highVul = (this.state.Functions[0].Prob * 100).toFixed(2)
                    this.setState({highestVulnerability: highVul})
                    // console.log(highVul)
                    this.setState({detailedFunctionVul: highVul})
                    // let length = Object.keys(this.state.showedFunctions).length
                    let length = this.state.Functions.length
                    this.setState({totalFunction : length})
                    console.log('Functions list length ' + length)
                    if (length >= 20) {
                        this.setState({topK : 20})
                    } else {
                        this.setState( {topK : length})
                    }

                    let topK = parseInt(this.state.topK)
                    let arr = this.state.Functions.slice(0, topK)
                    this.setState({showedFunctions: arr})
                    console.log('showed functions len : ' + this.state.showedFunctions.length)

                    this.setState({totalIssue: res.data.ResultObject.total_vul})
                    this.setState({totalWarnings: res.data.ResultObject.total_warning})

                    this.setState({function_number: this.state.Functions[0].function_number})
                    this.setState({binaryCode: this.state.Functions[0].HexCode})
                    this.setState({asmCode: this.state.Functions[0].AsmCode})
                    this.setState({recommendation: this.state.Functions[0].Recommendation})
                    this.setState({attentionWords: this.state.Functions[0].AttentionWords}, ()=> {
                        // console.log('attention words : ' + this.state.attentionWords)
                        this.handleCodeToRed()

                    })

                    let probs = []
                    for ( let i =0; i < length; i++) {
                        let prob = (this.state.Functions[i].Prob * 100).toFixed(2)
                        // prob = prob * 100
                        // console.log('for Prob: ' + i + " " + this.state.showedFunctions[i].Prob)
                        // console.log('for Hex Prob: ' + i + " " + prob)
                        probs.push(prob)
                    }
                    this.setState({probList: probs})
                    // console.log('problist:' + this.state.probList)

                    // console.log('state' + this.state)
                    this.initChart()
                } else {
                    // 这里处理一些错误信息
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.getResultData()
        // this.initChart()
    }


    render() {
        return (
            <Layout>
                <div>
                    <CustomBreadcrumb arr={['Reports List', 'Report']}/>
                </div>

                <Row gutter={8} className='base-style'>

                    <Col span={20}>
                        <Row>
                            <h3>SCAN RESULT</h3>
                        </Row>
                        <Row gutter={8}>
                            <Col span={6}>
                                <h4>TOP @K DISPLAY:</h4>
                            </Col>
                            <Col span={4}>
                                {/*<Input placeholder="10" size={"default"}/>*/}
                                <Search placeholder={this.state.topK}
                                        onSearch={value => {
                                            if(value > this.state.totalFunction) {
                                                let arr = this.state.Functions.slice(0)
                                                // console.log("search arr len "+ arr.length)
                                                this.setState({showedFunctions: arr,
                                                    topK: this.state.totalFunction}, ()=> {
                                                    notification.open({
                                                        message: 'The total number of functions is '+this.state.totalFunction,
                                                        duration: null,
                                                        description: ''
                                                    })
                                                    this.initChart()
                                                })
                                            }
                                            else {
                                                let arr = this.state.Functions.slice(0, parseInt(value))
                                                // console.log("search arr len "+ arr.length)
                                                this.setState({showedFunctions: arr,
                                                    topK: value}, () => {
                                                    this.initChart()
                                                })
                                            }
                                            // this.initChart()
                                            }

                                        }
                                        enterButton />
                            </Col>



                        </Row>

                        <Row>
                            <br/>
                            <h5>HIGHEST VULNERABILITY: {this.state.highestVulnerability}%</h5>
                        </Row>
                        <Row>
                        <div id='bar' style={{ height: 300, background: '#fff' }}>

                        </div>
                        </Row>

                    </Col>
                    <Col span={4}>
                        <Row>
                            <h3>SCAN SUMMARY</h3>
                        </Row>
                        <Row>
                            <h5>TOTAL FUNCTIONS</h5>
                        </Row>
                        <Row>
                            <h2>{this.state.totalFunction}</h2>
                        </Row>
                        <Row>
                            <h5>TOTAL ISSUES</h5>
                        </Row>
                        <Row>
                            <h2 style={{color:'#a90000'}}>  {this.state.totalIssue} </h2>
                        </Row>
                        <Row>
                            <h5>TOTAL WARNINGS: <span style={{color:'orange'}}>  {this.state.totalWarnings} </span> </h5>
                        </Row>
                        <Row>
                            <h5>TIME TAKEN: {this.state.time_taken} s</h5>
                        </Row>
                        <Row>
                            <p>FILE SIZE: {this.state.fsize} BYTES</p>
                        </Row>

                    </Col>

                </Row>

                <Row gutter={8} className='base-style'>
                    <Row gutter={8}>
                        <Col span={16}>
                            <h3>{this.state.function_number}</h3>
                        </Col>
                        <Col span={8} >
                            <h4>VULNERABILITY PROBABILITY: {this.state.detailedFunctionVul}%</h4>
                        </Col>
                    </Row>

                    <Row gutter={8}>
                        <Col span={8}>
                            <Descriptions layout='vertical' bordered>
                                <Descriptions.Item label='BINARY'>
                                    {/*{this.state.binaryCode}*/}
                                    <div dangerouslySetInnerHTML = {{ __html: this.state.binaryCodeShowed }} />
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={10}>
                            <Descriptions layout='vertical' bordered>
                                <Descriptions.Item label='ASSEMBLY'>
                                    <div dangerouslySetInnerHTML = {{ __html: this.state.asmCodeShowed }} />
                                </Descriptions.Item>
                            </Descriptions>

                        </Col>
                        <Col span={6}>
                            <Descriptions layout='vertical' bordered>
                                <Descriptions.Item label='RECOMMENDATION'>
                                    {this.state.recommendation}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Row>
            </Layout>
        );
    }

}

export default ReportView