import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Sellers.css';
import { useTimer } from '../contexts/TimerContext';

function SellerVerificationStart() {
    const [pendingIds, setPendingIds] = useState([]);
    const [requirementText, setRequirementText] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [verifications, setVerifications] = useState([]);
    const { timeLeft, isTimerRunning, resetTimer, formatTime } = useTimer();

    useEffect(() => {
        if (localStorage.getItem('sellerTimerLeft') === null || parseInt(localStorage.getItem('sellerTimerLeft')) <= 0) {
            resetTimer();
        }
    }, [resetTimer]);

    useEffect(() => {
        if (!isTimerRunning && timeLeft <= 0) {
          navigate('/seller/verification-failed');
        }
    }, [isTimerRunning, timeLeft, navigate]);

    useEffect(() => {
        const verificationLinkId = localStorage.getItem("sessionId");

        if (!verificationLinkId) {
            console.error("로컬스토리지에 verificationLinkId가 없습니다.");
            return;
        }

        const fetchData = async () => {
            try {
                const [idsRes, infoRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/saber/link/${verificationLinkId}/pending-verification-ids`),
                    axios.get(`http://localhost:8080/api/saber/link/${verificationLinkId}/info`)
                ]);

                setPendingIds(idsRes.data);
                setRequirementText(infoRes.data.requirementText);
                setVerifications(infoRes.data.verifications);
            } catch (err) {
                console.error("데이터 불러오기 실패", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        if (!isLoading && pendingIds.length === 0) {
            const timeoutId = setTimeout(() => {
                navigate('/seller/submit');
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [pendingIds, isLoading, navigate]);

    const startVerification = (id) => {
        axios
            .post(`http://localhost:8080/api/verification/${id}/start`)
            .then(() => {
                navigate(`/verifications/${id}/camera`);
            })
            .catch((err) => {
                console.error("인증 시작 실패", err);
            });
    };

    return (
        <div className="container">
            <h1 className="sellerText">인증 요청 목록</h1>
            <p className="timerText">인증 제한시간: {formatTime(timeLeft)}</p>
            {timeLeft <= 0 && <p className="timeUpMessage" style={{ color: 'red', fontWeight: 'bold' }}>시간이 초과되었습니다!</p>}   
            {isLoading && <p>인증 요청을 불러오는 중입니다...</p>}

            {!isLoading && pendingIds.length === 0 && (
                <p>모든 인증이 완료되었습니다. 5초 후 제출 페이지로 이동합니다.</p>
            )}

            <div className="noticeContainer">
                {requirementText && (
                    <div>
                        <p className="sectionTitle">추가 요청 사항</p>
                        <p>
                            {requirementText.split('\n').map((line, index) => (
                                <React.Fragment key={index} className="subTitle">
                                    - {line}
                                    <br/>
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                )}
            </div>

            <ul>
                {pendingIds.map((id) => {
                    const verif = verifications.find(v => v.id === id);
                    const label = verif ? verif.label : "알 수 없는 이름";

                    return (
                        <li className="button-group" key={id}>
                            <button
                                className="doneButton"
                                onClick={() => startVerification(id)}
                            >
                                인증 시작 ({label})
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default SellerVerificationStart;