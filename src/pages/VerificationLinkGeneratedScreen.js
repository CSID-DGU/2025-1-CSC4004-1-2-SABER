import React, { useEffect, useState } from 'react';
import { createLink, getVerificationStatus } from '../api';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

export default function VerificationLinkGeneratedScreen({ verificationId }) {
    const isDisabled = verificationId === null;
    const [link, setLink] = useState(null);
    const [status, setStatus] = useState(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('verificationId:', verificationId);
        handleCreateLink();
    }, []);

    const handleCreateLink = async () => {
        if (isDisabled) return;
        try {
            const res = await createLink(verificationId);
            setLink(res.data.link);
            setStatus(res.data.status);

            console.log('응답:', res);
            console.log('링크:', res.data.link);
            console.log('상태:', res.data.status);
        } catch (error) {
            console.error('링크 생성 실패', error);
            alert('인증 링크 생성에 실패했습니다.');
        }
    };

    const handleCheckStatus = async () => {
        if (isDisabled) return;
        try {
            const res = await getVerificationStatus(verificationId);
            setStatus(res.data.status);
            alert(`현재 상태: ${res.data.status}`);
        } catch (error) {
            console.error('상태 조회 실패', error);
            alert('인증 상태 조회에 실패했습니다.');
        }
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(link);
        alert('링크가 복사되었습니다.');
        setCopied(true);
        setTimeout(() => {
            navigate('/waiting');
        }, 5000);
    };

    const goToHome = () => {
        navigate('/');
    };

    const Next = () => {
        navigate('/waiting');
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
                <div className="progress-bar-50"></div>
            </div>

            <div className="buyer-info">
                <div className="profile-placeholder"></div>
                <div className="buyer-text">
                    <div className="buyer-title">구매자</div>
                    <div className="buyer-subtitle">구매자용 중고거래 실물인증 서비스</div>
                </div>
            </div>

            <h2 className="title-medium">일회용 인증 링크 생성 완료</h2>
            <p className="subtitle-small">판매자에게 링크를 공유하세요</p>

            <div className="link-container">
                {link && (
                    <div> 
                        <p><a href={link} target="_blank" rel="noreferrer">{link}</a></p>
                        <p>상태: {status}</p>
                        {copied && <p className="info-text">5초 후 다음 화면으로 이동합니다...</p>}
                    </div>
                )}
                <div className="copy-icon" onClick={handleCopyClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8v-2h11v2zm0-4H8v-2h11v2zm0-4H8V7h11v2z"/>
                    </svg>
                </div>
            </div>

            <div className="waiting-button" disabled={isDisabled} onClick={Next}>
                판매자의 접속을 기다리고 있습니다
            </div>
        </div>
    );
}