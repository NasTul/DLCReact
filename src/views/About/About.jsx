import React, {Component} from 'react'
import { Layout, Divider } from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import axios from "../../api";
import {API} from "../../api/config";

// const AboutView = () => (
//     <Layout>
//         <div>
//             <CustomBreadcrumb arr={['About']}/>
//         </div>
//         <div className='base-style'>
//             <h3>About</h3>
//             <Divider />
//             <p>blank……</p>
//         </div>
//     </Layout>
// )

class AboutView extends Component {

    render() {
        return(
            <Layout>
                <div>
                    <CustomBreadcrumb arr={['About']}/>
                </div>
                <div className='base-style'>
                    <h3>About</h3>
                    <Divider />
                    <h5>BiVulD system Introduction</h5>
                    <p>Cyber security is crucial given in the modern digital world. The severity of the threat caused by software vulnerabilities is increasing signiﬁcantly every year. Many techniques have been developed to analyze vulnerabilities in source code. However, source code is not always available (e.g., most industry software is closed source). Thus, binary code-based vulnerability analysis is necessary – and of course, more demanding. We developed a novel approach, coined BiVulD, to address this challenging real-world problem for binary-level vulnerability detection.</p>
                    <p>BiVulD consists of three phases: binary instruction generation, binary function extraction, and model building. First, we make use of objdump to obtain the binary instructions. Second, we clean the binary instructions by using security domain knowledge and produce the ground truth. Third, we employ the attention mechanism on top of a bidirectional LSTM for building the predictive model.</p>
                    <p>In a word, BiVulD is a deep learning-based vulnerability scanner. It can automatically detect the vulnerabilities in binary code and report the vulnerability’s type and location (address) and highlight the vulnerable assemble code. For the scanned file results, please navigate to “Reports” on the top left side and refer to “download” for the PDF file.</p>
                    <p>This project is funded by DSTG, led by Swinburne University of Technolgy and in collaboration with Monash University and Data61.</p>
                </div>
            </Layout>
        )
    }
}
export default AboutView