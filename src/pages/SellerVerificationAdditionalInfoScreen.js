import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerVerificationAdditionalInfoScreen() {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/seller/verification-success');
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

      <h3 className="sectionTitle">인증 관련 추가 내용</h3>
      <p className="subTitle">구매자에게 도움이 되거나 참고할 만한 정보를 기입해 주세요.</p>

      <textarea
        className="input"
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        placeholder="예: 빛 반사로 인한 색감의 차이가 있을 수 있음."
      />

      <button className="nextButtonOutline" onClick={handleNext}>다음</button>
    </div>
  );
}

export default SellerVerificationAdditionalInfoScreen;