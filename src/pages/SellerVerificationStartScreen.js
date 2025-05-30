import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';
import logoImage from '../assets/logo.png';
import { useTimer } from '../contexts/TimerContext'; // useTimer 훅 임포트

function SellerVerificationStartScreen() {
  const navigate = useNavigate();
  const { timeLeft, isTimerRunning, resetTimer, formatTime } = useTimer(); // Context에서 값과 함수 가져오기

  useEffect(() => {
    if (localStorage.getItem('sellerTimerLeft') === null || parseInt(localStorage.getItem('sellerTimerLeft')) <= 0) {
        resetTimer();
    }
  }, [resetTimer]);


  // 시간이 0이 되면 자동으로 실패 화면으로 이동
  useEffect(() => {
    if (!isTimerRunning && timeLeft <= 0) {
      navigate('/seller/verification-failed');
    }
  }, [isTimerRunning, timeLeft, navigate]);

  const handleStart = () => {
    if (timeLeft > 0) { // 시간이 남아 있을 때만 페이지 이동
      navigate('/seller/camera'); // 다음 페이지로 이동
    } else {
      alert('인증 시간이 초과되었습니다.'); // 시간이 초과되었을 때 알림
      navigate('/seller/verification-failed'); // 시간이 초과되었으면 실패 화면으로 이동
    }
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

      <p className="timerText">인증 제한시간: {formatTime(timeLeft)}</p>
      {timeLeft <= 0 && <p className="timeUpMessage" style={{ color: 'red', fontWeight: 'bold' }}>시간이 초과되었습니다!</p>}

      <div className="photoVideoNotice">
        3종류의 사진촬영 및 2종류의 영상인증이 필요합니다.
      </div>

      <div className="noticeContainer">
        <h4 className="noticeTitle">유의사항</h4>
        <p className="noticeText">
          인증 시작 후 중단시 인증이 무효화됩니다.
          <br />
          백그라운드로 이동 시 인증이 중단됩니다.
          <br />
          촬영은 1회만 가능합니다.
          <br />
          제한시간 내에 인증이 완료되어야 합니다.
        </p>
      </div>

      <button className="nextButton" onClick={handleStart} disabled={timeLeft <= 0}>
        인증 시작
      </button>
    </div>
  );
}

export default SellerVerificationStartScreen;