// 10
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function EndScreen() {
  const navigate = useNavigate();

  const handleRetry = () => {
    alert('재인증 기능은 현재 구현 중입니다.');
    navigate('/');
  };

  const handleAdditional = () => {
    alert('추가인증 기능은 현재 구현 중입니다.');
    navigate('/');
  };

  const handleClose = () => {
    window.close();
  };

  const goToMain = () => {
    navigate('/'); // 메인 화면
  };

  return (
    <div className="container">
      <div style={{ width: '100%' }}>
        <div className="header-small">
          <div className="logo-with-text" onClick={goToMain}>
          <img src={logoImage} alt="SABER Logo" className="logo-image" />
          <div className="logo-text">SABER</div>
        </div>
          <div className="menu-icon-small">☰</div>
        </div>

        <div className="buyer-info">
          <div className="profile-placeholder" />
          <div className="buyer-text">
            <div className="buyer-title">구매자</div>
            <div className="buyer-subtitle">구매자를 돕기 위한 실물인증 서비스</div>
          </div>
        </div>

        <div className="end-message">인증이 완료되었습니다</div>

        <button className="end-button" onClick={handleRetry}>
          재인증: 미흡한 부분에 대한 재인증
        </button>
        <button className="end-button" onClick={handleAdditional}>
          추가인증: 추가로 궁금한 점에 대한 추가인증
        </button>
        <button className="end-button-black" onClick={goToMain}>
          메인 화면으로
        </button>
      </div>
    </div>
  );
}

export default EndScreen;