import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function CaptureWarningScreen() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/seller/verification-start');
  };

  const goToStart = () => {
    navigate('/seller/start');
  };

  return (
    <div className="warningContainer">
      <div className="header">
        <div className="logo-with-text">
          <img src={logoImage} alt="SABER Logo" className="logo-image" />
          <div className="logo-text">SABER</div>
        </div>

        <div className="menuIcon">☰</div>
      </div>

      <div className="warningIcon">⚠️</div>
      <h2 className="title">
        촬영 시 유의사항을
        <br />
        확인해 주세요.
      </h2>
      <p className="description">
        본인확인 및 중고거래 사기 방지를 위해 촬영 시 유의사항을 반드시 지켜주세요.
      </p>

      <button className="confirmButton" onClick={handleConfirm}>확인</button>
    </div>
  );
}

export default CaptureWarningScreen;