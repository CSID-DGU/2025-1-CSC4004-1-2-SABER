import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';
import {fetchRecommendedVerifications, fetchAllDefaultVerifications, setVerificationOptions} from "../api";

const TIME_OPTIONS = [3, 5, 7, 10, 30];

export default function VerificationSettingScreen() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [initialRequirement, setInitialRequirement] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [recommendedOptions, setRecommendedOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const navigate = useNavigate();
  const isNextDisabled = selectedOptions.length === 0;
  const location = useLocation();
  const categoryId = location.state.categoryId;
 
  useEffect(() => {

    const fetchVerifications = async () => {
      try {
        const [defaultRes, recommendedRes] = await Promise.all([
          fetchAllDefaultVerifications(),
          fetchRecommendedVerifications(categoryId)
        ]);
        setDefaultOptions(defaultRes.data);
        setRecommendedOptions(recommendedRes.data);
      } catch (err) {
        console.error("인증 방식 조회 실패", err);
      }
    };
    fetchVerifications();
  }, [categoryId]);

  const handleRequirementChange = (id, value) => {
    setRequirements(reqs => reqs.map(r => (r.id === id ? { ...r, value } : r)));
  };

  const handleSubmit = async () => {
    if (!selectedTime) return alert('인증 제한 시간을 선택해주세요.');
    const verificationId = location.state.verificationLinkId;

    const customRequests = [
      initialRequirement,
      ...requirements.map(r => r.value)
    ].filter(Boolean).join('\n');

    const payload = {
      limitedMinutes: selectedTime,
      customRequests,
      verificationMethods: selectedOptions,
    };

    try {
      await setVerificationOptions(verificationId, payload);
      alert('설정 완료');
      navigate('/permission');
    } catch (err) {
      console.error('설정 전송 실패', err);
      alert('설정 전송 중 오류가 발생했습니다.');
    }
  };

  const toggleOption = (id) => {
    setSelectedOptions(opts =>
        opts.includes(id) ? opts.filter(opt => opt !== id) : [...opts, id]
    );
  };

  return (
      <div className="container">
        <header className="header-small">
          <div className="logo-with-text" onClick={() => navigate('/')}>
            <img src={logoImage} alt="logo" className="logo-image" />
            <div className="logo-text">SABER</div>
          </div>
          <div className="menu-icon-small">☰</div>
        </header>

        <div className="progress-bar-container"><div className="progress-bar-17"></div></div>

        <section className="buyer-info">
          <div className="profile-placeholder"></div>
          <div className="buyer-text">
            <div className="buyer-title">구매자</div>
            <div className="buyer-subtitle">구매자용 중고거래 실물인증 서비스</div>
          </div>
        </section>

        <section className="verification-method-section">
          <label className="verification-method-label">인증 제한 시간 설정</label>
          <div className="verification-button-container">
            {TIME_OPTIONS.map(time => (
                <button key={time} className={`time-button ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(selectedTime === time ? null : time)}>{time}분</button>
            ))}
          </div>
        </section>

        <section className="additional-requirement-section">
          <label className="additional-requirement-label">개별 인증 요구사항 추가</label>
          <input
              className="additional-requirement-input"
              type="text"
              placeholder="예: 포스트잇에 닉네임 적어서 같이 촬영해주세요."
              value={initialRequirement}
              onChange={(e) => setInitialRequirement(e.target.value)}
          />
          {requirements.map((req, index) => (
              <div key={req.id} className="dynamic-requirement-input-wrapper">
                <input
                    className="additional-requirement-input"
                    type="text"
                    placeholder={`추가 요구사항 ${index + 1}`}
                    value={req.value}
                    onChange={(e) => handleRequirementChange(req.id, e.target.value)}
                />
                <button className="remove-requirement-button" onClick={() => setRequirements(reqs => reqs.filter(r => r.id !== req.id))}>X</button>
              </div>
          ))}
          <button className="add-button" onClick={() => setRequirements(reqs => [...reqs, { id: Date.now(), value: '' }])}>+ 추가</button>
        </section>

        <section className="verification-method-section">
          <label className="verification-method-label">기본 인증 방식 선택</label>

          <div className="recommend-container">
            <span>✅ 이런 인증 방법을 추천해요!</span>
            {recommendedOptions.map((recommends, idx) => (
                <p key={idx}>- {recommends.verificationContent}</p>
            ))}
          </div>

          <div className="verification-option-container">
            {defaultOptions.map(opt => (
                <button
                    key={opt.id}
                    className={`verification-option-button ${selectedOptions.includes(opt.id) ? 'selected' : ''}`}
                    onClick={() => toggleOption(opt.id)}
                >
                  {opt.verificationContent}
                </button>
            ))}
          </div>

          {selectedOptions.length > 0 && (
              <ul className="selected-method-display">
                {defaultOptions.filter(opt => selectedOptions.includes(opt.id)).map(opt => (
                    <li key={opt.id}>{opt.verificationContent}</li>
                ))}
              </ul>
          )}
        </section>

        <button className="next-button" disabled={isNextDisabled} onClick={handleSubmit}>다음</button>
      </div>
  );
}