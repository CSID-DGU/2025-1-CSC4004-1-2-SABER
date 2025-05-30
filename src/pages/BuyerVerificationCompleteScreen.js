// 8
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function BuyerVerificationCompleteScreen() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/result');
  };

  const goToHome = () => {
    navigate('/');
  };

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
        <div className="progress-bar-83"></div>
      </div>

      <div className="buyer-info">
        <div className="profile-placeholder"></div>
        <div className="buyer-text">
          <div className="buyer-title">구매자</div>
          <div className="buyer-subtitle">구매자용 중고거래 실물인증 서비스</div>
        </div>
      </div>

      <h2 className="message">
        판매자가 인증을 완료했습니다<br />
      </h2>

      <p className="description">
        <br />
        다음 화면으로 이동하여 결과를 확인하세요
      </p>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}

export default BuyerVerificationCompleteScreen;