// 2
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function PrecautionScreen() {
  const navigate = useNavigate();

  const goToNoticeScreen = () => {
    navigate('/category');
  };

  return (
    <div className="container">
      <div className="header-large">
        <div className="logo-with-text">
          <img src={logoImage} alt="SABER Logo" className="logo-image" />
          <div className="logo-text">SABER</div>
        </div>
        <div className="menu-icon">&#9776;</div>
      </div>
      <div className="notice-text">
        주의사항: 상호간 제품 보유 여부 및 하자를 확인하기 위한 서비스,
        {"\n"}
        제품의 정상적인 거래, 배송 보장을
        {"\n"}
        하지 않음
      </div>
      <button className="button-wide" onClick={goToNoticeScreen}>구매 인증 등록 시작</button>
    </div>
  );
}

export default PrecautionScreen;