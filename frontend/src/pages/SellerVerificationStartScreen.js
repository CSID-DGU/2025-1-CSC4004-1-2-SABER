import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerVerificationStartScreen() {
    const navigate = useNavigate();
    const { verificationLinkId } = useParams();
    const [verificationData, setVerificationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

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
    const calculateTimeLeft = (expiresAt) => {
        const now = new Date().getTime();
        const expiryTime = new Date(expiresAt).getTime();
        const difference = expiryTime - now;

        return Math.max(0, Math.floor(difference / 1000));
    };

    // 인증 링크 정보 가져오기
    useEffect(() => {
        const fetchVerificationInfo = async () => {
            try {
                const response = await fetch(`/api/link/${verificationLinkId}/info`);
                const data = await response.json();

                console.log('받아온 데이터:', data); // 디버깅용

                setVerificationData(data);

                // status 체크를 먼저 수행
                if (data.status === 'TERMINATED') {
                    setIsExpired(true);
                    alert('시간이 만료되었습니다.');
                    navigate('/seller/verification-failed');
                    return;
                }

                if (data.status === 'COMPLETED') {
                    navigate('/seller/verification-success');
                    return;
                }

                // expiresAt이 있는 경우 만료 시간 체크
                if (data.expiresAt) {
                    const remaining = calculateTimeLeft(data.expiresAt);
                    setTimeLeft(remaining);

                    console.log('남은 시간:', remaining, '초'); // 디버깅용

                    if (remaining <= 0) {
                        setIsExpired(true);
                        alert('시간이 만료되었습니다.');
                        navigate('/seller/verification-failed');
                        return;
                    }
                }

            } catch (error) {
                console.error('인증 정보를 가져오는데 실패했습니다:', error);
                alert('인증 정보를 불러올 수 없습니다.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (verificationLinkId) {
            fetchVerificationInfo();
        }
    }, [verificationLinkId, navigate]);

    // 타이머 효과 - verificationData가 로드된 후에만 실행
    useEffect(() => {
        if (!verificationData?.expiresAt || isExpired) return;

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft(verificationData.expiresAt);
            setTimeLeft(remaining);

            console.log('타이머 업데이트 - 남은 시간:', remaining, '초'); // 디버깅용

            if (remaining <= 0) {
                setIsExpired(true);
                clearInterval(timer);
                alert('시간이 만료되었습니다.');
                navigate('/seller/verification-failed');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [verificationData, isExpired, navigate]);

    const handleStart = () => {
        // 현재 상태 재확인
        if (verificationData?.status === 'TERMINATED' || isExpired) {
            alert('시간이 만료되었습니다.');
            navigate('/seller/verification-failed');
            return;
        }

        if (timeLeft > 0) {
            navigate('/seller/camera');
        } else {
            alert('인증 시간이 초과되었습니다.');
            navigate('/seller/verification-failed');
        }
    };

    const goToStart = () => {
        navigate('/');
    };

    // 로딩 중일 때 표시할 화면
    if (loading) {
        return (
            <div className="container">
                <div className="header">
                    <div className="logo-with-text" onClick={goToStart}>
                        <img src={logoImage} alt="SABER Logo" className="logo-image" />
                        <div className="logo-text">SABER</div>
                    </div>
                    <div className="menuIcon">☰</div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    인증 정보를 불러오는 중...
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <div className="logo-with-text" onClick={goToStart}>
                    <img src={logoImage} alt="SABER Logo" className="logo-image" />
                    <div className="logo-text">SABER</div>
                </div>
                <div className="menuIcon">☰</div>
            </div>

            <div className="sellerInfo">
                <div className="profilePlaceholder" />
                <div className="sellerText">
                    <div className="sellerTitle">판매자</div>
                    <div className="sellerSubtitle">판매자용 중고거래 실물인증 서비스</div>
                </div>
            </div>

            <p className="timerText">인증 제한시간: {formatTime(timeLeft)}</p>
            {(timeLeft <= 0 || verificationData?.status === 'TERMINATED' || isExpired) &&
                <p className="timeUpMessage" style={{ color: 'red', fontWeight: 'bold' }}>
                    시간이 초과되었습니다!
                </p>
            }

            <div className="photoVideoNotice">
                3종류의 사진촬영 및 2종류의 영상인증이 필요합니다.
            </div>

            {/* 서버에서 받은 요구사항 텍스트가 있다면 표시 */}
            {verificationData?.requirementText && (
                <div className="requirementContainer">
                    <h4>인증 요구사항</h4>
                    <p style={{ whiteSpace: 'pre-line' }}>{verificationData.requirementText}</p>
                </div>
            )}

            <div className="noticeContainer">
                <h4 className="noticeTitle">유의사항</h4>
                <p className="noticeText">
                    인증 시작 후 중단시 인증이 무효화됩니다.
                    <br />
                    백그라운드로 이동 시 인증이 중단됩니다.
                    <br />
                    촬영은 1회만 가능합니다.
                    <br />
                    제한시간 내에 인증이 완료되어야 합니다.
                </p>
            </div>

            <button
                className="nextButton"
                onClick={handleStart}
                disabled={timeLeft <= 0 || verificationData?.status === 'TERMINATED' || isExpired}
            >
                인증 시작
            </button>
        </div>
    );
}

export default SellerVerificationStartScreen;