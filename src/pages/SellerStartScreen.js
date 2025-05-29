import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SellerStartScreen() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <h2>판매자 인증 시작</h2>
            <button onClick={() => startVerification(token)} disabled={loading || !token}>
                인증 시작
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}