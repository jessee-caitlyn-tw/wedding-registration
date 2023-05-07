import React, {} from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Route, Routes } from "react-router-dom"

import './App.css';

function SurveyForm() {
    return (
        <Form>
            <Form.Group id="formGroupDate" className="mb-3 infoGroup" controlId="date">
                <Form.Label className="header">Jessee & Caitlyn's Wedding Ceremony<br />信文 & 倢瑩婚禮出席統計<br />(調查已截止)</Form.Label>
                <Form.Text>
                    <p>哈囉，各位信文和倢瑩的好朋友們~</p>
                    <p>我們即將於5/21 (日) 步入禮堂，成為彼此在人生的隊友<br />誠摯邀請曾經參與我們各個人生階段的你和妳<br />一起分享我們的喜悅🥳</p>
                    <p>Jessee & Caitlyn</p>
                </Form.Text>
            </Form.Group>

            <Form.Group id="formGroupInformation" className="mb-3 separator" controlId="information">
                <Form.Label>🎉 婚禮資訊 🎉</Form.Label>
            </Form.Group>

            <Form.Group id="formGroupDate" className="mb-3 infoGroup" controlId="date">
                <Form.Label>日期：</Form.Label>
                <Form.Text>2023/5/21 (日)</Form.Text>
            </Form.Group>
            <Form.Group id="formGroupTime" className="mb-3 infoGroup" controlId="time">
                <Form.Label>時間：</Form.Label>
                <Form.Text>證婚儀式：10:30 <br /> 婚宴入席：12:00</Form.Text>
            </Form.Group>
            <Form.Group id="formGroupTime" className="mb-3 infoGroup" controlId="location">
                <Form.Label>地點：</Form.Label>
                <Form.Text>南港六福萬怡酒店 7樓 超新星廳<br />115-61台北市南港區忠孝東路七段359號</Form.Text>
                <Form.Text>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.444936594595!2d121.60421971468874!3d25.052904383963455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ab5dead348a9%3A0xbbd29a7bc6eab599!2z5Y-w5YyX5YWt56aP6JCs5oCh6YWS5bqX!5e0!3m2!1szh-TW!2stw!4v1675874694168!5m2!1szh-TW!2stw"
                        title={"南港六福萬怡酒店 - Google Map"}
                        width={"100%"}
                        height={"400"}
                        id={"locationGmap"}
                        allowFullScreen={true}
                        loading={"lazy"}
                        referrerPolicy={"no-referrer-when-downgrade"}>
                    </iframe>
                </Form.Text>
            </Form.Group>

            <Form.Group id="formGroupInformation" className="mb-3 separator" controlId="information">
                <Form.Label>🎉 資訊填寫 🎉</Form.Label>
            </Form.Group>
            <Form.Group id="formGroupDate" className="mb-3 infoGroup" controlId="date">
                <Form.Text>
                    <p>出席調查已截止</p>
                    <p>如果有任何變動，請隨時和信文或倢瑩聯繫</p>
                    <p>期待您的出席哦！</p>
                    <p>
                    <a target="_blank" rel="noreferrer" href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Nmw1YXU1aGp0a2piNnBidW8wcWh1YmVnYWkgamVzc2VlLmNhaXRseW4udHdAbQ&tmsrc=jessee.caitlyn.tw%40gmail.com">加到Google行事曆</a>
                    </p>
                </Form.Text>
            </Form.Group>
        </Form>
    );
}

const App = () => (
    <Routes>
        <Route path="/" element={
            <Container className="p-3">
                <div className="mb-4 mainForm">
                    <div className="prologue"></div>
                    <SurveyForm></SurveyForm>
                </div>
            </Container>
        } />
        
    </Routes>
);

export default App;

