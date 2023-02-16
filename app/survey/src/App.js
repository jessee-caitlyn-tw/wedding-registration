import React, { useState, useRef, useCallback, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import axios from 'axios';
import { Route, Routes } from "react-router-dom"
import {
    useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

import './App.css';

function Thanks() {
    return (
        <Form>
            <Form.Group id="formGroupDate" className="mb-3 infoGroup" controlId="date">
                <Form.Label className="header">Jessee & Caitlyn's Wedding Ceremony<br />信文 & 倢瑩婚禮出席統計</Form.Label>
                <Form.Text>
                    <p>謝謝您的填寫！</p>
                    <p>如果有任何狀況，請隨時和信文或倢瑩聯繫</p>
                    <p>期待您的出席哦！</p>
                    <p>
                    <a target="_blank" rel="noreferrer" href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Nmw1YXU1aGp0a2piNnBidW8wcWh1YmVnYWkgamVzc2VlLmNhaXRseW4udHdAbQ&tmsrc=jessee.caitlyn.tw%40gmail.com">加到Google行事曆</a>
                    </p>
                </Form.Text>
            </Form.Group>
        </Form>
    )
}

function SurveyForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            return;
        }
        const token = await executeRecaptcha();
        setState(prevState => ({
            ...prevState,
            "token": token
        }));
    }, [executeRecaptcha]);

    const [submitting, setSubmitting] = useState(false);

    const [state, setState] = useState({
        name: "",
        engName: "",
        relationship: "none",
        contactNum: "",
        isAttend: true,
        numAttendees: 1,
        numChildSeats: 0,
        numVegetarianSeats: 0,
        invitationType: "both",
        email: "",
        address: "",
        message: ""
    });
    const [errorMsg, setErrorMsg] = useState({
        name: "",
        engName: "",
        relationship: "",
        contactNum: "",
        isAttend: "",
        numAttendees: "",
        numChildSeats: "",
        numVegetarianSeats: "",
        invitationType: "",
        email: "",
        address: "",
        message: "",
        badRequest: ""
    })

    const refName = useRef();
    const refEngName = useRef();
    const refRelationship = useRef();
    const refContactNum = useRef();
    const refIsAttend = useRef();
    const refNumAttendees = useRef();
    const refNumChildSeats = useRef();
    const refNumVegetarianSeats = useRef();
    const refInvitationType = useRef();
    const refEmail = useRef();
    const refAddress = useRef();
    const refMessage = useRef();

    const addErrorMsg = (fieldName, msg) => {
        setErrorMsg(prevErrorMessage => ({
            ...prevErrorMessage,
            [fieldName]: msg
        }));
    }

    const removeErrorMsg = (fieldName) => {
        setErrorMsg(prevErrorMessage => ({
            ...prevErrorMessage,
            [fieldName]: ""
        }));
    }

    const handleInputChange = event => {
        const name = event.target.name;

        let value = null;
        switch(name) {
            case "isAttend":
                value = event.target.checked;
                if (!value) {
                    setState(prevState => ({
                        ...prevState,
                        "numAttendees": 0,
                        "numChildSeats": 0,
                        "numVegetarianSeats": 0
                    }));
                } else {
                    setState(prevState => ({
                        ...prevState,
                        "numAttendees": 1,
                        "numChildSeats": 0,
                        "numVegetarianSeats": 0
                    }));
                }
                break;
            case "numAttendees":
                value = parseInt(event.target.value);
                if (state.numChildSeats > value - 1) {
                    setState(prevState => ({
                        ...prevState,
                        "numChildSeats": value-1
                    }));
                }
                if (state.numVegetarianSeats > value) {
                    setState(prevState => ({
                        ...prevState,
                        "numVegetarianSeats": value
                    }));
                }
                break;
            case "numChildSeats":
            case "numVegetarianSeats":
                value = parseInt(event.target.value);
                break;
            case "invitationType":
                value = event.target.value;
                if (value === "email") {
                    setState(prevState => ({
                        ...prevState,
                        "address": ""
                    }));
                } else if (value === "physical") {
                    setState(prevState => ({
                        ...prevState,
                        "email": ""
                    }));
                }
                break;
            default:
                value = event.target.value;
        }
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateInput = () => {
        const fields = [
            {
                name: "name",
                ref: refName,
                validator: () => {
                    if (state.name.length === 0 || state.name.length > 64) {
                        addErrorMsg("name", "請填寫您的姓名");
                        return false;
                    }
                    return true;
                } 
            },
            {
                name: "engName",
                ref: refEngName,
                validator: () => {
                    if (state.engName.length > 0) {
                        if (state.engName.length > 64 || !String(state.engName).match(/^[a-zA-Z\-.\s()]+$/)) {
                            addErrorMsg("engName", "填寫英文姓名者請正確填寫");
                            return false;
                        }
                    }
                    return true;
                }
            },
            {
                name: "relationship",
                ref: refRelationship,
                validator: () => {
                    if (!["groom", "bride", "both"].includes(String(state.relationship))) {
                        addErrorMsg("relationship", "請選擇與新人關係");
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "contactNum",
                ref: refContactNum,
                validator: () => {
                    if (state.contactNum.length === 0 || !String(state.contactNum).match(/^(\d{2,4}-?|\(\d{2,4}\)\s?)\d{1,4}-?\d{4}|09\d{2}(\d{6}|-\d{6}|-\d{3}-\d{3})$/)) {
                        addErrorMsg("contactNum", "請正確填寫您的聯絡電話，方便新人與您聯繫哦！");
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "numChildSeats",
                ref: refNumChildSeats,
                validator: () => {
                    if (state.isAttend && state.numChildSeats > state.numAttendees - 1) {
                        addErrorMsg("numChildSeats", "請確認至少有一位大人陪同兒童出席哦！");
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "numVegetarianSeats",
                ref: refNumVegetarianSeats,
                validator: () => {
                    if (state.isAttend && state.numVegetarianSeats > state.numAttendees) {
                        addErrorMsg("numVegetarianSeats", "請確認素食人數需小於或等於出席人數");
                        return false;
                    }
                    return true;
                }
            },
            {
                name: "email",
                ref: refEmail,
                validator: () => {
                    if (state.invitationType === "email" || state.invitationType === "both") {
                        if (state.email.length === 0 || !String(state.email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                            addErrorMsg("email", "請填寫正確格式的Email，才可以收到電子喜帖哦！");
                            return false;
                        }
                    }
                    return true;
                }
            },
            {
                name: "address",
                ref: refAddress,
                validator: () => {
                    if (state.invitationType === "physical" || state.invitationType === "both") {
                        if (state.address.length === 0 || state.address.length > 128) {
                            addErrorMsg("address", "請確認地址不可為空，才可以收到紙本喜帖哦！");
                            return false;
                        }
                    }
                    return true;
                }
            },
            {
                name: "message",
                ref: refMessage,
                validator: () => {
                    if (state.message.length > 1000) {
                        addErrorMsg("message", "謝謝你文情並茂的祝賀文 ... 但請勿超過1000字哦！");
                        return false;
                    }
                    return true;
                }
            }
        ];
        let isValid = true;
        let firstFocusRef = null;
        fields.forEach(field => {
            if (field.ref.current) {
                removeErrorMsg(field.name);
                field.ref.current.classList.remove("invalid");
            }
            if (!field.validator()) {
                isValid = false;
                if (firstFocusRef == null) {
                    firstFocusRef = field.ref;
                }
                field.ref.current.classList.add("invalid");
            }
        })
        if (!isValid && firstFocusRef != null) {
            firstFocusRef.current.focus();
        }
        return isValid;
    };

    
    
    const handleOnSubmit = event => {
        event.preventDefault();
        const isValid = validateInput();
        if (isValid) {
            setSubmitting(true);
            axios.post(`https://asia-east1-jessee-caitlyn-tw.cloudfunctions.net/survey`, state)
                .then( (response) => {
                    window.location = "/wedding-survey/#/thanks";
                })
                .catch( (error) => {
                    addErrorMsg("badRequest", "發生錯誤，請稍後再試");
                    setSubmitting(false);
                    handleReCaptchaVerify();
                });
        }
    }

    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    return (
        <Form onSubmit={handleOnSubmit}>
            <Form.Group id="formGroupDate" className="mb-3 infoGroup" controlId="date">
                <Form.Label className="header">Jessee & Caitlyn's Wedding Ceremony<br />信文 & 倢瑩婚禮出席統計</Form.Label>
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

            <Form.Group id="formGroupBasicInfo" className="mb-3 separator" controlId="basicInfo">
                <Form.Label>🥳 聯絡資訊填寫 🥳</Form.Label>
            </Form.Group>

            <Form.Group id="formGroupName" className="mb-3 formGroup" controlId="name">
                <Form.Label>請問您的大名：</Form.Label>
                <Form.Control 
                    type="text"
                    name="name"
                    ref={refName}
                    state={state.name}
                    placeholder="您的姓名"
                    onChange={handleInputChange} />
                {errorMsg.name && <Form.Text className="error">{errorMsg.name}</Form.Text>}
            </Form.Group>

            <Form.Group id="formGroupEngName" className="mb-3 formGroup" controlId="engName">
                <Form.Label>英文名 (選填)：</Form.Label>
                <Form.Control
                    type="text"
                    name="engName"
                    ref={refEngName}
                    value={state.engName}
                    placeholder="趨勢、Netskope、Appier的朋友請填寫公司英文名"
                    onChange={handleInputChange} />
                {errorMsg.engName && <Form.Text className="error">{errorMsg.engName}</Form.Text>}
            </Form.Group>

            <Form.Group id="formGroupRelationship" className="mb-3 formGroup" controlId="relationship">
                <Form.Label>與新人的關係：</Form.Label>
                <Form.Select name="relationship" ref={refRelationship} onChange={handleInputChange}>
                    <option value="none">請選擇</option>
                    <option value="groom">男方親友</option>
                    <option value="bride">女方親友</option>
                    <option value="both">共同好友 (趨勢科技同事、中央大學同學 ... 等)</option>
                </Form.Select>
                {errorMsg.relationship && <Form.Text className="error">{errorMsg.relationship}</Form.Text>}
            </Form.Group>

            <Form.Group id="formGroupContactNum" className="mb-3 formGroup" controlId="contactNum">
                <Form.Label>您的聯絡電話：</Form.Label>
                <Form.Control
                    type="text"
                    name="contactNum"
                    ref={refContactNum}
                    value={state.contactNum}
                    placeholder="請輸入電話號碼"
                    onChange={handleInputChange} />
                {errorMsg.contactNum && <Form.Text className="error">{errorMsg.contactNum}</Form.Text>}
            </Form.Group>

            <Form.Group id="formGroupAttendeesInformation" className="mb-3 separator" controlId="attendeesInformation">
                <Form.Label>👪 參與人數與用餐習慣 😋</Form.Label>
            </Form.Group>

            <Form.Group id="formGroupIsAttend" className="mb-3 formGroup" controlId="isAttend">
                <Form.Label>是否會出席婚宴：{state.isAttend ? "是" : "否"}</Form.Label>
                <Form.Check
                    name="isAttend"
                    type="switch"
                    defaultChecked="true"
                    ref={refIsAttend}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {state.isAttend && <Form.Group id="formGroupNumAttendees" className="mb-3 formGroup" controlId="numAttendees">
                <Form.Label>共幾個人出席：{state.numAttendees}</Form.Label>
                <RangeSlider
                    name="numAttendees"
                    ref={refNumAttendees}
                    value={state.numAttendees}
                    onChange={handleInputChange}
                    tooltip={"off"}
                    min={1}
                    max={10}
                />
                <Form.Text id="formAttendeesHelp" muted>人數請包含自己唷，方便我們分配桌數</Form.Text>
            </Form.Group>}

            {(state.isAttend && state.numAttendees > 1) && <Form.Group id="formGroupNumChildSeats" className="mb-3 formGroup" controlId="numChildSeats">
                <Form.Label>需要幾張兒童座椅：{state.numChildSeats}</Form.Label>
                <RangeSlider
                    name="numChildSeats"
                    ref={refNumChildSeats}
                    value={state.numChildSeats}
                    onChange={handleInputChange}
                    tooltip={"off"}
                    min={0}
                    size={"lg"}
                    max={parseInt(state.numAttendees) - 1}
                />
                <Form.Text id="formNumChildSeatHelp" muted>如不需要，請填0</Form.Text>
                {errorMsg.numChildSeats && <Form.Text className="error">{errorMsg.numChildSeats}</Form.Text>}
            </Form.Group>}

            {state.isAttend && <Form.Group id="formGroupNumVegetarianSeats" className="mb-3 formGroup" controlId="numVegetarianSeats">
                <Form.Label>共幾位吃素：{state.numVegetarianSeats}</Form.Label>
                <RangeSlider
                    name="numVegetarianSeats"
                    ref={refNumVegetarianSeats}
                    value={state.numVegetarianSeats}
                    onChange={handleInputChange}
                    tooltip={"off"}
                    min={0}
                    max={parseInt(state.numAttendees)}
                />
                <Form.Text id="formVegHelp" muted>請填寫自己以及同行親友的吃素人數，如不需要，請填0</Form.Text>
                {errorMsg.numVegetarianSeats && <Form.Text className="error">{errorMsg.numVegetarianSeats}</Form.Text>}
            </Form.Group>}

            <Form.Group id="formGroupInvitationInfo" className="mb-3 separator" controlId="invitationInfo">
                <Form.Label>💌 喜帖寄送 💌</Form.Label>
            </Form.Group>

            <Form.Group id="formGroupInvitationType" className="mb-3 formGroup" controlId="invitationType">
                <Form.Label>喜帖寄送方式：</Form.Label>
                <Form.Select
                    name="invitationType"
                    ref={refInvitationType}
                    onChange={handleInputChange}>
                    <option value="both">紙本 + 電子喜帖</option>
                    <option value="email">電子喜帖</option>
                    <option value="physical">紙本喜帖</option>
                </Form.Select>
            </Form.Group>

            {(state.invitationType === "email" || state.invitationType === "both") && <Form.Group id="formGroupEmail" className="mb-3 formGroup" controlId="email">
                <Form.Label>電子喜帖寄送信箱：</Form.Label>
                <Form.Control
                    type="text"
                    name="email"
                    ref={refEmail}
                    value={state.email}
                    onChange={handleInputChange} 
                    placeholder="請填入接收電子喜帖的Email"/>
                {errorMsg.email && <Form.Text className="error">{errorMsg.email}</Form.Text>}
            </Form.Group>}

            {(state.invitationType === "physical" || state.invitationType === "both") && <Form.Group id="formGroupAddress" className="mb-3 formGroup" controlId="address">
                <Form.Label>紙本喜帖寄送地址：</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    ref={refAddress}
                    value={state.address}
                    onChange={handleInputChange}
                    placeholder="請填入接收紙本喜帖的地址" />
                {errorMsg.address && <Form.Text className="error">{errorMsg.address}</Form.Text>}
            </Form.Group>}

            <Form.Group id="formGroupMessage" className="mb-3 formGroup" controlId="message">
                <Form.Label>有什麼話想對我們說嗎？</Form.Label>
                <Form.Control
                    as="textarea"
                    name="message"
                    ref={refMessage}
                    rows={5}
                    value={state.message}
                    onChange={handleInputChange}
                    placeholder="想對信文和倢瑩說的話" />
            </Form.Group>

            <Form.Group id="formGroupSubmit" className="mb-3 infoGroup" controlId="submit">
                <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}>
                        {submitting && <i className="fa fa-spinner fa-spin"></i>} 送出
                </Button>
                {errorMsg.badRequest && <Form.Text className="error">{errorMsg.badRequest}</Form.Text>}
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
        <Route path="/thanks" element={
            <Container className="p-3">
                <div className="mb-4 mainForm">
                    <div className="epilogue"></div>
                    <Thanks></Thanks>
                </div>
            </Container>
        } />
        
    </Routes>
);

export default App;

