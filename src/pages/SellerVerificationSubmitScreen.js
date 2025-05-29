import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerVerificationSubmitScreen() {
  const navigate = useNavigate();

  const goToNext = () => {
    navigate('/seller/verification-additional-info');
  };

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

      <h2 className="message">인증이 완료되었습니다!</h2>
      <p className="description">인증 내용을 구매자에게 전송할 수 있습니다.</p>

      <button className="nextButtonOutline" onClick={goToNext}>다음</button>
    </div>
  );
}

export default SellerVerificationSubmitScreen;