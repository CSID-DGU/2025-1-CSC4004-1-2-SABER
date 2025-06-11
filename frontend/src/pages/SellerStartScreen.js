import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Sellers.css';
import { v4 as uuidv4 } from 'uuid';

export default function SellerStartScreen() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BASE_URL;


    function getVisitorKey() {
        let key = localStorage.getItem('visitorKey');
        if (!key) {
            key = uuidv4();  // uuid 라이브러리로 UUID 생성
            localStorage.setItem('visitorKey', key);
        }
        return key;
    }

    const startVerification = async (token) => {
        console.log("BASE_URL:", process.env.REACT_APP_BASE_URL);
        setError('');
        setLoading(true);
        try {
            const visitorKey = getVisitorKey();
            const res = await axios.get(`${baseURL}/api/saber`, {
                params: {
                    token: token,           // token 추가 필수
                    visitorKey: visitorKey,
                },
                withCredentials: true,
            });

            localStorage.setItem('sessionId', res.data.id);
            navigate('/seller/permission');
        } catch (e) {
            console.error(e);
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