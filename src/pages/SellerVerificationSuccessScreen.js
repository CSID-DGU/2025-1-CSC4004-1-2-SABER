import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerVerificationSuccessScreen() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/seller/start');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-with-text">
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

      <h2 className="message">인증에 성공하였습니다!</h2>

      <button className="mainButton" onClick={handleGoHome}>메인 화면</button>
    </div>
  );
}

export default SellerVerificationSuccessScreen;