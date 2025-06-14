// WaitingScreen.jsx
import React, { useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function WaitingScreen() {
    const navigate = useNavigate();
    const verificationLinkId = localStorage.getItem("sessionId");
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/link/${verificationLinkId}`);
                const status = response.data.status;

                if (status === 'COMPLETED') {
                    navigate('/result', { state: { verificationLinkId } });
                }
                if (status === 'FAILED' || status === 'TERMINATED' || status === 'EXPIRED') {
                    navigate('/seller/verification-failed');
                }
            } catch (error) {
                console.error('상태 조회 실패:', error);
            }
        };

        // 컴포넌트가 마운트되면 즉시 호출
        checkStatus();

        // 10초마다 상태 체크
        const intervalId = setInterval(checkStatus, 10000);

        // 컴포넌트 언마운트 시 interval 정리
        return () => clearInterval(intervalId);
    }, [verificationLinkId, navigate]);

    const verificationLink = `${window.location.origin}/seller/start`;

    const handleCopyClick = () => {
        navigator.clipboard.writeText(verificationLink);
        alert('링크가 복사되었습니다.');
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <div className="header-medium">
                <div className="logo-with-text" onClick={goToHome}>
                    <img src={logoImage} alt="SABER Logo" className="logo-image" />
                    <div className="logo-text">SABER</div>
                </div>
                <div className="menu-icon-small">☰</div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar-67"></div>
            </div>

            <div className="buyer-info">
                <div className="profile-placeholder"></div>
                <div className="buyer-text">
                    <div className="buyer-title">구매자</div>
                    <div className="buyer-subtitle">구매자용 중고거래 실물인증 서비스</div>
                </div>
            </div>

            <h2 className="title-medium">판매자 인증 진행중</h2>
            <p className="subtitle-small">잠시만 기다려주세요</p>

            <div className="waiting-button">판매자가 인증을 진행하고 있습니다</div>
        </div>
    );
}

export default WaitingScreen;