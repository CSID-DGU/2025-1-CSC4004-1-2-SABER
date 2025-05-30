// 5
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function PermissionScreen() {
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState({
    push: false,
    camera: false,
  });

  const allGranted = Object.values(permissions).every(Boolean);

  const handleGrant = (type) => {
    setPermissions((prev) => ({ ...prev, [type]: true }));
  };

  const goToVerificationLinkGeneratedScreen = () => {
    if (allGranted) navigate('/verification-link-generated');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-with-text" onClick={() => navigate('/')}>
          <img src={logoImage} alt="SABER Logo" className="logo-image" />
          <div className="logo-text">SABER</div>
        </div>
        <div className="menu-icon-small">☰</div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-33"></div>
      </div>

      <div className="buyer-info">
        <div className="profile-placeholder"></div>
        <div className="buyer-text">
          <div className="buyer-title">구매자</div>
          <div className="buyer-subtitle">구매자용 중고거래 실물인증 서비스</div>
        </div>
      </div>

      <h2 className="section-title">이용약관 동의</h2>

      <div className="permission-item">
        <div className="permission-label">
          <h3 className="permission-text">푸시 알림 권한</h3>
          <div className="permission-buttons">
            <button
              className={`permission-button ${permissions.push ? 'granted' : ''}`}
              onClick={() => handleGrant('push')}
            >
              허용
            </button>
          </div>
        </div>
        <p className="permission-description">거래 정보 및 업데이트를 받기 위해 필요합니다.</p>
      </div>

      <div className="permission-item">
        <div className="permission-label">
          <h3 className="permission-text">카메라 권한</h3>
          <div className="permission-buttons">
            <button
              className={`permission-button ${permissions.camera ? 'granted' : ''}`}
              onClick={() => handleGrant('camera')}
            >
              허용
            </button>
          </div>
        </div>
        <p className="permission-description">판매 물품 사진 촬영을 위해 필요합니다.</p>
      </div>

      <button 
        className="next-button" 
        onClick={goToVerificationLinkGeneratedScreen} 
        disabled={!allGranted}
      >
        다음
      </button>
    </div>
  );
}

export default PermissionScreen;