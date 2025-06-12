import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Sellers.css';
import { useTimer } from '../contexts/TimerContext';

export default function SellerVerificationList() {
    const navigate = useNavigate();
    const { timeLeft, isTimerRunning, formatTime } = useTimer();

    const [pendingIds, setPendingIds] = useState([]);
    const [requirementText, setRequirementText] = useState("");
    const [verifications, setVerifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    // 타이머 종료 시 실패 페이지 이동
    useEffect(() => {
        if (!isTimerRunning && timeLeft <= 0) {
            navigate('/seller/verification-failed');
        }
    }, [isTimerRunning, timeLeft, navigate]);

    // 인증 목록 불러오기
    const loadVerificationList = async (sessionId) => {
        setIsLoading(true);
        try {
            const [idsRes, infoRes] = await Promise.all([
                axios.get(`${baseURL}/api/saber/link/${sessionId}/pending-verification-ids`),
                axios.get(`${baseURL}/api/saber/link/${sessionId}/info`)
            ]);

            setPendingIds(idsRes.data);
            setRequirementText(infoRes.data.requirementText);
            setVerifications(infoRes.data.verifications);
        } catch (err) {
            console.error("데이터 불러오기 실패", err);
            setError('인증 목록 불러오기 실패');
        } finally {
            setIsLoading(false);
        }
    };

    // 최초 마운트 시 세션 체크 후 인증 목록 로딩
    useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            navigate('/seller/verification-start');
            return;
        }
        loadVerificationList(sessionId);
    }, [navigate]);

    // 인증 개별 시작
    const startSingleVerification = (id) => {
        axios
            .post(`${baseURL}/api/verification/${id}/start`)
            .then(() => {
                navigate(`/verifications/${id}/camera`);
            })
            .catch((err) => {
                console.error("인증 시작 실패", err);
                setError("인증 시작 실패");
            });
    };

    // 모든 인증 완료 후 제출 페이지 이동 대기
    useEffect(() => {
        if (!isLoading && pendingIds.length === 0 && localStorage.getItem("sessionId")) {
            const timeoutId = setTimeout(() => {
                navigate('/seller/submit');
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [pendingIds, isLoading, navigate]);

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
                                    <br />
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
                                onClick={() => startSingleVerification(id)}
                            >
                                인증 시작 ({label})
                            </button>
                        </li>
                    );
                })}
            </ul>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </div>
    );
}
