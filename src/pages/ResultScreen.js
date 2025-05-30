// 9
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';

function ResultScreen() {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const goToHome = () => {
    navigate('/');
  };

  const handleDone = () => {
    console.log('선택된 피드백:', selectedFeedback);
    navigate('/end');
  };

  return (
    <div className="container">
      <div className="header-small">
        <div className="logo-with-text" onClick={goToHome}>
          <img src={logoImage} alt="SABER Logo" className="logo-image" />
          <div className="logo-text">SABER</div>
        </div>
        <div className="menu-icon-small">☰</div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-100" />
      </div>

      <h2 className="title-small">인증 결과 확인</h2>

      <div className="media-box">사진/동영상</div>
      <div className="slide-indicator" />

      <button className="requirement-button">인증 요구사항</button>

      <div className="feedback-container">
        <div className="feedback-label">항목 인증 만족도</div>
        <div className="emoji-buttons">
          <button
            className={`emoji-button ${selectedFeedback === 'satisfied' ? 'selected' : ''}`}
            onClick={() => setSelectedFeedback('satisfied')}
          >
            😊 만족
          </button>
          <button
            className={`emoji-button ${selectedFeedback === 'unsatisfied' ? 'selected' : ''}`}
            onClick={() => setSelectedFeedback('unsatisfied')}
          >
            😕 불만족
          </button>
        </div>
      </div>

      <button className="button" onClick={handleDone}>완료</button>
    </div>
  );
}

export default ResultScreen;