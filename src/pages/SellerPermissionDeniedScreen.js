import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerPermissionDeniedScreen() {
  const navigate = useNavigate();

  const goToStart = () => {
    navigate('/seller/start');
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
      <p className="description">약관 및 외부 권한 허용이 필요합니다</p>
      <button className="mainButton" onClick={() => navigate('/seller/start')}>메인 화면</button>
      <button className="backButton" onClick={() => navigate('/seller/permission')}>이전</button>
    </div>
  );
}

export default SellerPermissionDeniedScreen;