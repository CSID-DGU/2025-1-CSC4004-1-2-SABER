import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerPermissionScreen() {
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState({ push: null, camera: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const goToStart = () => {
        navigate('/seller/start');
    };

    const handleSelect = (type, value) => {
        setPermissions((prev) => ({ ...prev, [type]: value }));
    };

    const allGranted = permissions.push === true && permissions.camera === true;

    const submitAgreement = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            setError('세션 정보가 없습니다. 다시 시작해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(`http://localhost:8080/api/saber/link/${sessionId}/agree`, null, {
                withCredentials: true,
            });
            navigate('/seller/verification-start');
        } catch (e) {
            setError('동의 제출에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const goToNext = () => {
        if (permissions.push === false || permissions.camera === false) {
            navigate('/seller/denied');
        } else if (allGranted) {
            submitAgreement();
        }
    };

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

            <h1 className="title">이용약관 동의</h1>

            <div className="permissionItem">
                <label className="label">푸시알림 권한</label>
                <div className="permissionButtonGroup">
                    <button
                        className={`permissionButton ${permissions.push === true ? 'permissionButtonSelected' : 'permissionButtonUnselected'}`}
                        onClick={() => handleSelect('push', true)}
                    >허용</button>
                    <button
                        className={`permissionButton ${permissions.push === false ? 'permissionButtonSelected' : 'permissionButtonUnselected'}`}
                        onClick={() => handleSelect('push', false)}
                    >거부</button>
                </div>
            </div>

            <div className="permissionItem">
                <label className="label">카메라 권한</label>
                <div className="permissionButtonGroup">
                    <button
                        className={`permissionButton ${permissions.camera === true ? 'permissionButtonSelected' : 'permissionButtonUnselected'}`}
                        onClick={() => handleSelect('camera', true)}
                    >허용</button>
                    <button
                        className={`permissionButton ${permissions.camera === false ? 'permissionButtonSelected' : 'permissionButtonUnselected'}`}
                        onClick={() => handleSelect('camera', false)}
                    >거부</button>
                </div>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button
                className="nextButton"
                onClick={goToNext}
                disabled={loading || permissions.push === null || permissions.camera === null}
            >
                {loading ? '처리 중...' : '다음'}
            </button>
        </div>
    );
}

export default SellerPermissionScreen;
