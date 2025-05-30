import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';

function SellerUsageGuideScreen() {
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

      <h1 className="title">사용 방법 소개</h1>

      <ol className="stepList">
        <li>구매자가 보낸 인증 링크 접속</li>
        <li>카메라 접근 권한 허용</li>
        <li>지정된 항목에 맞춰 실물 촬영</li>
        <li>촬영 완료 후 인증 제출</li>
        <li>인증 결과 구매자에게 자동 전송</li>
      </ol>

      <p className="description">서비스 상세정보, 설명, 개발 목적 등</p>

      <button className="confirmButton" onClick={goToStart}>확인</button>
    </div>
  );
}

export default SellerUsageGuideScreen;