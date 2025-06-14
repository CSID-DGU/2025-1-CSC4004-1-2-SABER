import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Sellers.css';

export default function SellerVerificationList() {
    const navigate = useNavigate();

    const [pendingIds, setPendingIds] = useState([]);
    const [requirementText, setRequirementText] = useState("");
    const [verifications, setVerifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [expiresAt, setExpiresAt] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    // 시간 포맷팅 함수
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 남은 시간 계산 함수
    const calculateTimeLeft = (expiresAtTime) => {
        if (!expiresAtTime) return 0;

        const now = new Date().getTime();
        const expiryTime = new Date(expiresAtTime).getTime();
        const difference = expiryTime - now;

        return Math.max(0, Math.floor(difference / 1000));
    };

    // 세션 ID 설정 및 초기 로딩
    useEffect(() => {
        const storedSessionId = localStorage.getItem("sessionId");
        if (!storedSessionId) {
            navigate('/seller/verification-start');
            return;
        }
        setSessionId(storedSessionId);
    }, [navigate]);

    // 만료 시간에 따른 타이머 설정
    useEffect(() => {
        if (!expiresAt || isExpired) return;

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft(expiresAt);
            setTimeLeft(remaining);

            console.log('타이머 업데이트 - 남은 시간:', remaining, '초');

            if (remaining <= 0) {
                setIsExpired(true);
                clearInterval(timer);
                localStorage.removeItem("sessionId");
                alert('인증 시간이 만료되었습니다.');
                navigate('/seller/verification-failed');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt, isExpired, navigate]);

    // 인증 목록 불러오기
    const loadVerificationList = async (currentSessionId) => {
        if (!currentSessionId) return;

        setIsLoading(true);
        setError('');

        try {
            const [idsRes, infoRes] = await Promise.all([
                axios.get(`${baseURL}/api/saber/link/${currentSessionId}/pending-verification-ids`),
                axios.get(`${baseURL}/api/saber/link/${currentSessionId}/info`)
            ]);

            console.log('불러온 데이터:', {
                pendingIds: idsRes.data,
                info: infoRes.data
            });

            setPendingIds(idsRes.data || []);
            setRequirementText(infoRes.data?.requirementText || "");
            setVerifications(infoRes.data?.verifications || []);

            // expiresAt 설정 및 초기 시간 계산
            if (infoRes.data?.expiresAt) {
                setExpiresAt(infoRes.data.expiresAt);
                const remaining = calculateTimeLeft(infoRes.data.expiresAt);
                setTimeLeft(remaining);

                console.log('만료 시간:', infoRes.data.expiresAt, '남은 시간:', remaining, '초');

                // 이미 만료된 경우
                if (remaining <= 0) {
                    setIsExpired(true);
                    localStorage.removeItem("sessionId");
                    alert('인증 시간이 만료되었습니다.');
                    navigate('/seller/verification-failed');
                    return;
                }
            }

            // 세션 상태 체크
            if (infoRes.data?.status === 'TERMINATED' || infoRes.data?.status === 'EXPIRED') {
                localStorage.removeItem("sessionId");
                alert('인증 세션이 만료되었습니다.');
                navigate('/seller/verification-failed');
                return;
            }

            // 인증이 완료된 경우 성공 페이지로 이동
            if (infoRes.data?.status === 'COMPLETED') {
                navigate('/seller/submit');
                return;
            }

        } catch (err) {
            console.error("데이터 불러오기 실패", err);

            // 404나 세션 관련 오류인 경우 세션 정리
            if (err.response?.status === 404 || err.response?.status === 403) {
                localStorage.removeItem("sessionId");
                navigate('/seller/verification-start');
                return;
            }

            setError('인증 목록 불러오기 실패');
        } finally {
            setIsLoading(false);
        }
    };

    // sessionId가 설정되면 데이터 로딩
    useEffect(() => {
        if (sessionId) {
            loadVerificationList(sessionId);
        }
    }, [sessionId]);

    // 인증 개별 시작
    const startSingleVerification = async (id) => {
        if (!sessionId) {
            setError("세션이 유효하지 않습니다.");
            return;
        }

        // 타이머 체크
        if (timeLeft <= 0 || isExpired) {
            alert('인증 시간이 초과되었습니다.');
            navigate('/seller/verification-failed');
            return;
        }

        try {
            setError('');
            await axios.post(`${baseURL}/api/verification/${id}/start`);
            navigate(`/verifications/${id}/camera`);
        } catch (err) {
            console.error("인증 시작 실패", err);

            if (err.response?.status === 404) {
                setError("해당 인증을 찾을 수 없습니다.");
            } else if (err.response?.status === 403) {
                setError("인증 권한이 없습니다.");
            } else {
                setError("인증 시작 실패");
            }
        }
    };

    // 모든 인증 완료 후 제출 페이지 이동 대기
    useEffect(() => {
        if (!isLoading && pendingIds.length === 0 && sessionId && verifications.length > 0) {
            console.log('모든 인증 완료, 5초 후 제출 페이지로 이동');

            const timeoutId = setTimeout(() => {
                navigate('/seller/submit');
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [pendingIds, isLoading, navigate, sessionId, verifications]);

    // 새로고침 시 데이터 다시 불러오기
    const handleRefresh = () => {
        if (sessionId) {
            loadVerificationList(sessionId);
        }
    };

    return (
        <div className="container">
            <h1 className="sellerText">인증 요청 목록</h1>

            <p className="timerText">
                인증 제한시간: {formatTime(timeLeft)}
            </p>

            {(timeLeft <= 0 || isExpired) && (
                <p className="timeUpMessage" style={{ color: 'red', fontWeight: 'bold' }}>
                    시간이 초과되었습니다!
                </p>
            )}

            {isLoading && <p>인증 요청을 불러오는 중입니다...</p>}

            {!isLoading && pendingIds.length === 0 && verifications.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                        모든 인증이 완료되었습니다!
                    </p>
                    <p>5초 후 제출 페이지로 자동 이동합니다.</p>
                </div>
            )}

            {!isLoading && pendingIds.length === 0 && verifications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>인증 요청이 없습니다.</p>
                    <button onClick={handleRefresh} className="nextButton">
                        새로고침
                    </button>
                </div>
            )}

            {requirementText && (
                <div className="noticeContainer">
                    <div>
                        <p className="sectionTitle">추가 요청 사항</p>
                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                            {requirementText.split('\n').map((line, index) => (
                                <div key={index} style={{ marginBottom: '5px' }}>
                                    {line.trim() && `- ${line.trim()}`}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {pendingIds.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: '15px' }}>
                        남은 인증: {pendingIds.length}개
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {pendingIds.map((id) => {
                            const verif = verifications.find(v => v.id === id);
                            const label = verif ? verif.label : `인증 #${id}`;

                            return (
                                <li className="button-group" key={id} style={{ marginBottom: '10px' }}>
                                    <button
                                        className="doneButton"
                                        onClick={() => startSingleVerification(id)}
                                        disabled={timeLeft <= 0 || isExpired}
                                        style={{
                                            opacity: (timeLeft <= 0 || isExpired) ? 0.5 : 1,
                                            cursor: (timeLeft <= 0 || isExpired) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        인증 시작 ({label})
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {error && (
                <div style={{
                    color: 'red',
                    textAlign: 'center',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '5px',
                    margin: '10px 0'
                }}>
                    {error}
                    <button
                        onClick={handleRefresh}
                        style={{
                            marginLeft: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            )}
        </div>
    );
}