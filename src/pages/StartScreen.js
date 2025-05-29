// 1
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

export default function StartScreen() {
  const navigate = useNavigate();
  const [loadingToken, setLoadingToken] = useState(true);

  // 1. 페이지 접속 시 buyerToken 발급
  useEffect(() => {
    async function issueBuyerToken() {
          try {
            await axios.post('http://localhost:8080/api/token', null, { withCredentials: true });
            setLoadingToken(false);
          } catch (error) {
              console.error('토큰 발급 실패', error);
              setLoadingToken(false);
          }
      } 
      issueBuyerToken();
  }, []);
  
  const goToNoticeScreen = () => {
    navigate('/precaution');
  };

  if (loadingToken) {
        return <div>로딩 중...</div>;
  }

  return (
    <div className="start-container">
      <div className="header">
        <div className="logo-with-text">
          <img src={logoImage} alt="SABER Logo" className="logo-image" />
          <div className="logo-text">SABER</div>
        </div>
        <div className="menu-icon">&#9776;</div>
      </div>
      <h1 className="title">실시간 거래 인증 서비스 SABER</h1>
      <p className="subtitle">서비스 설명, 소개</p>
      <p className="subtitle">실시간으로 거래 물품을</p>
      <p className="subtitle">인증할 수 있는 서비스</p>
      <button className="button" onClick={ goToNoticeScreen() }>안전하게 인증 후 구매하기</button>
      <div className="image-placeholder">이미지 자리</div>
    </div>
  );
}