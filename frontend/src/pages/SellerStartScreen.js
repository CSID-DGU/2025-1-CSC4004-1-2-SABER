import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Sellers.css'; 
import { useTimer } from '../contexts/TimerContext';

export default function SellerStartScreen() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { timeLeft, isTimerRunning, resetTimer, formatTime } = useTimer();

    useEffect(() => {
        if (localStorage.getItem('sellerTimerLeft') === null || parseInt(localStorage.getItem('sellerTimerLeft')) <= 0) {
            resetTimer();
        }
    }, [resetTimer]);
    
    useEffect(() => {
        if (!isTimerRunning && timeLeft <= 0) {
          navigate('/seller/verification-failed');
        }
    }, [isTimerRunning, timeLeft, navigate]);

    function getVisitorKey() {
        let key = localStorage.getItem('visitorKey');
        if (!key) {
            key = crypto.randomUUID();
            localStorage.setItem('visitorKey', key);
        }
        return key;
    }

    const startVerification = async (tokenToUse) => {
        if (!tokenToUse) {
            setError('토큰이 없습니다');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const visitorKey = getVisitorKey();
            const res = await axios.get(`http://localhost:8080/api/saber`, {
                params: {
                    token: tokenToUse,
                    visitorKey: visitorKey,
                },
                withCredentials: true,
            });

            // 세션을 다음 페이지에서 사용할 수 있도록 저장
            localStorage.setItem('sessionId', res.data.id);

            // 자동 이동
            navigate('/seller/permission');
        } catch (e) {
            setError('인증 시작 실패');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const goToGuide = () => {
        navigate('/seller/guide');
    };

    return (
        <div className="seller-start-container">
            <h2 className="title">판매자 인증 시작</h2>
            <p className="timerText">인증 제한시간: {formatTime(timeLeft)}</p>
                {timeLeft <= 0 && <p className="timeUpMessage" style={{ color: 'red', fontWeight: 'bold' }}>시간이 초과되었습니다!</p>}   
            {/* 버튼들을 감싸는 Flexbox 컨테이너 */}
            <div className="button-group">
                <button 
                    className="seller-start-button" 
                    onClick={() => startVerification(token)} 
                    disabled={loading || !token}
                >
                    인증 시작
                </button>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button 
                    className="confirmButton" 
                    onClick={goToGuide}
                >
                    서비스 설명 및 사용법
                </button>
            </div>
        </div>
    );
}