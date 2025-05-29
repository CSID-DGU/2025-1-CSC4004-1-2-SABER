import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Buyers.css';
import logoImage from '../assets/logo.png';
import { fetchCategories, setCategory } from '../api';

function CategoryScreen({ onCategorySelected }) {
    const [selectedId, setSelectedId] = useState('');
    const [categories, setCategories] = useState([]);
    const [verificationLinkId, setVerificationId] = useState('');
    const navigate = useNavigate();

    const goToVerificationSettingScreen = (categoryId, verificationLinkId) => {
        navigate('/verification-setting', { state: { categoryId, verificationLinkId } });
    };

    useEffect(() => {
        fetchCategories().then(res => setCategories(res.data));
    }, []);

    const goToHome = () => {
        navigate('/');
    };

    // verificationId 상태에 저장하도록 수정
    const handleSelect = async () => {
        if (!selectedId) return;

        try {
            const res = await setCategory(selectedId);
            const verificationLinkId = res.data;
            setVerificationId(verificationLinkId);  // 상태 업데이트
            onCategorySelected(verificationLinkId);
            return verificationLinkId;
        } catch (error) {
            console.error('카테고리 설정 실패', error);
            return null;
        }
    };

    const handleNextClick = async () => {
        const verificationLinkId = await handleSelect();
        if (verificationLinkId) {
            goToVerificationSettingScreen(selectedId, verificationLinkId);
        }
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

            <div className="progress-bar-container"></div>

            <div className="buyer-info">
                <div className="profile-placeholder"></div>
                <div className="buyer-text">
                    <div className="buyer-title">구매자</div>
                    <div className="buyer-subtitle">구매자용 중고거래 실물인증 서비스</div>
                </div>
            </div>

            <div className="category-section">
                <label className="category-label" htmlFor="itemSelect">선택 품목</label>
                <select
                    className="category-select"
                    onChange={e => setSelectedId(e.target.value)}
                    value={selectedId || ''}>
                    <option value="" disabled>카테고리 선택</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <button
                className="next-button"
                onClick={handleNextClick}
                disabled={!selectedId}
            >
                다음
            </button>
        </div>
    );
}

export default CategoryScreen;