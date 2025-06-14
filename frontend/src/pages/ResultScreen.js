import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function ResultScreen() {
    const navigate = useNavigate();

    const [verificationIds, setVerificationIds] = useState([]);
    const [currentVerificationId, setCurrentVerificationId] = useState(null);  // 사진 보여줄 verification ID
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loadingPhoto, setLoadingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const verificationLinkId = localStorage.getItem("sessionId");

    useEffect(() => {
        if (!verificationLinkId) return;

        // 2. verificationLinkId로 verification ID 목록 받아오기
        const fetchVerificationIds = async () => {
            try {
                const res = await fetch(`${baseURL}/api/saber/link/${verificationLinkId}/verification-ids`);
                if (!res.ok) throw new Error('인증 ID 목록을 불러오지 못했습니다.');
                const ids = await res.json();
                setVerificationIds(ids);

                if (ids.length > 0) {
                    setCurrentVerificationId(ids[0]);  // 예: 첫 번째 ID로 사진 표시
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchVerificationIds();
    }, [verificationLinkId]);

    useEffect(() => {
        if (!currentVerificationId) {
            setPhotoUrl(null);
            return;
        }

        // 3. 현재 verificationId로 사진 URL 받아오기
        const fetchPhotoUrl = async () => {
            setLoadingPhoto(true);
            setPhotoError(null);
            try {
                const response = await fetch(`${baseURL}/api/verifications/${currentVerificationId}/photo`);
                if (!response.ok) throw new Error('사진을 불러오지 못했습니다.');
                const url = await response.text();
                setPhotoUrl(url);
            } catch (error) {
                setPhotoError(error.message);
            } finally {
                setLoadingPhoto(false);
            }
        };

        fetchPhotoUrl();
    }, [currentVerificationId]);

    const goToHome = () => {
        navigate('/');
    };

    const handleDone = () => {
        console.log('선택된 피드백:', selectedFeedback);
        navigate('/end');
    };

    function generateRandomCode(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }


    return (
        <div className="container">
            <div className="header-small">
                <div className="logo-with-text" onClick={goToHome}>
                    <img src={logoImage} alt="SABER Logo" className="logo-image" />
                    <div className="logo-text">SABER</div>
                </div>
                <div className="menu-icon-small">☰</div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar-100" />
            </div>

            <h2 className="title-small">인증 결과 확인</h2>

            {/* 인증 ID 목록 버튼 */}
            <div className="verification-id-list" style={{ marginBottom: '1rem' }}>
                {verificationIds.length === 0 && <p>인증 ID가 없습니다.</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {verificationIds.map(id => (
                        <button
                            key={id}
                            onClick={() => setCurrentVerificationId(id)}
                            className={`verification-id-button ${currentVerificationId === id ? 'selected' : ''}`}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                border: currentVerificationId === id ? '2px solid #007bff' : '1px solid #ccc',
                                backgroundColor: currentVerificationId === id ? '#cce5ff' : '#fff',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                        >
                            {id}
                        </button>
                    ))}
                </div>
            </div>

            <div className="media-box">
                {loadingPhoto && <p>사진 불러오는 중...</p>}
                {photoError && <p style={{color: 'red'}}>{photoError}</p>}
                {!loadingPhoto && !photoUrl && !photoError && <p>사진이 없습니다.</p>}

                {photoUrl && (
                    <div
                        className="photo-wrapper"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none'
                        }}
                    >
                        <img
                            src={photoUrl}
                            alt="Verification"
                            style={{
                                maxWidth: '100%',
                                maxHeight: 400,
                                pointerEvents: 'none'
                            }}
                            draggable={false}
                        />
                        <div
                            className="overlay-code"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: '',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                color: 'white',
                                opacity: 0.85,
                                textAlign: 'center'
                            }}
                        >
                            {generateRandomCode(6)}
                        </div>
                    </div>
                )}
            </div>

            <div className="slide-indicator"/>

            <div className="feedback-container">
                <div className="feedback-label">항목 인증 만족도</div>
                <div className="emoji-buttons">
                    <button
                        className={`emoji-button ${selectedFeedback === 'satisfied' ? 'selected' : ''}`}
                        onClick={() => setSelectedFeedback('satisfied')}
                    >
                        😊 만족
                    </button>
                    <button
                        className={`emoji-button ${selectedFeedback === 'unsatisfied' ? 'selected' : ''}`}
                        onClick={() => setSelectedFeedback('unsatisfied')}
                    >
                        😕 불만족
                    </button>
                </div>
            </div>

            <button className="button" onClick={handleDone}>완료</button>
        </div>
    );
}

export default ResultScreen;