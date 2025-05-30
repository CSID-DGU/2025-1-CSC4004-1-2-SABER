import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';
import { useTimer } from '../contexts/TimerContext';

function SellerVerificationCompleteScreen() {
  const navigate = useNavigate();
  const { timeLeft, isTimerRunning, formatTime } = useTimer(); // Context에서 값과 함수 가져오기

  // 시간이 0이 되면 자동으로 실패 화면으로 이동
  useEffect(() => {
    if (!isTimerRunning && timeLeft <= 0) {
      navigate('/seller/verification-failed');
    }
  }, [isTimerRunning, timeLeft, navigate]);

  const goToStart = () => {
    navigate('/seller/start');
  };

  const handleStartCapture = () => {
    if (timeLeft > 0) {
      navigate('/seller/camera');
    } else {
      alert('인증 시간이 초과되어 촬영을 시작할 수 없습니다.');
      navigate('/seller/verification-failed');
    }
  };

  const handleComplete = () => {
    if (timeLeft > 0) {
      navigate('/seller/submit');
    } else {
      alert('인증 시간이 초과되어 완료할 수 없습니다.');
      navigate('/seller/verification-failed');
    }
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

      <div className="progressBarContainer">
        <div className="progressBar" />
      </div>

      <div className="sellerInfo">
        <div className="profilePlaceholder" />
        <div className="sellerText">
          <div className="sellerTitle">판매자</div>
          <div className="sellerSubtitle">판매자를 돕는 실물인증 서비스</div>
        </div>
      </div>

      <div className="sectionTitle">남은시간</div>
      <div className="timerBox">{formatTime(timeLeft)}</div>
      {timeLeft <= 0 && <p className="timeUpMessage" style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>시간이 초과되었습니다!</p>}

      <div className="sectionTitle">진행 현황</div>
      <div className="statusBox">
        <div className="statusRow">
          <span className="emoji">😊</span> 인증 완료 - 5개 항목 중 2개
        </div>
        <div className="statusRow">
          <span className="emoji">⏱️</span> 인증 대기 - 5개 항목 중 3개
        </div>
      </div>

      <div className="sectionTitle">다음 인증</div>
      <div className="certificationBox">전원을 킨 후 디스플레이에 사진</div>

      <button className="captureScreenButton" onClick={handleStartCapture} disabled={timeLeft <= 0}>
        촬영 시작
      </button>
      <div className="bottom-button-complete">
        <button className="doneButton" onClick={handleComplete} disabled={timeLeft <= 0}>
          완료
        </button>
      </div>
    </div>
  );
}

export default SellerVerificationCompleteScreen;