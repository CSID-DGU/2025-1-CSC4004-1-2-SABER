import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 자동 전송 설정 (토큰 인증 위해 필수)
});

// 프론트엔드 URL을 상수로 정의
const FRONTEND_URL = 'http://localhost:3000'; 

// 카테고리 목록 조회 (GET /api/categories)
export const fetchCategories = () => api.get('/categories');

// 전체 인증 옵션 조회 (GET /api/defaultVerifications)
export const fetchAllDefaultVerifications = () => api.get('/defaultVerifications');

// 추천 인증 옵션 조회 (GET /api/categories/{categoryId}/recommended-verifications)
export const fetchRecommendedVerifications = (categoryId) => api.get(`/categories/${categoryId}/recommended-verifications`);

// 카테고리 선택 (POST /api/settings/category)
export const setCategory = (categoryId) =>
    api.post('/settings/category', { categoryId });

// 상세 인증 옵션 설정 (POST /api/link/{verificationId}/settings)
export const setVerificationOptions = (verificationId, data) =>
    api.post(`/link/${verificationId}/settings`, data);

// 인증 링크 생성 (POST /api/link/{verificationId}/link)
export const createLink = async (verificationId) => {
    try {
        const response = await api.post(`/link/${verificationId}/link`);
        
        console.log("서버 응답 전체:", response.data); // 서버 응답 전체를 로그
        
        // 서버 응답에서 link와 status를 추출
        // response.data.link가 "http://localhost:8080/saber?token=..." 형태임을 전제로 합니다.
        const serverProvidedLink = response.data.link;
        const status = response.data.status; 

        console.log("서버가 제공한 링크:", serverProvidedLink); // 서버가 제공한 링크 로그

        // 서버가 제공한 링크에서 token만 파싱
        const url = new URL(serverProvidedLink);
        const token = url.searchParams.get('token'); // 'token' 쿼리 파라미터 값 추출

        console.log("추출된 토큰:", token); // 추출된 토큰 값 로그

        if (!token) {
            // 토큰이 undefined라면 에러를 발생시킵니다.
            console.error('서버 응답 링크에서 유효한 토큰을 찾을 수 없습니다. 원본 링크:', serverProvidedLink);
            throw new Error('인증 토큰을 찾을 수 없습니다.');
        }

        // 프론트엔드 URL을 사용하여 새로운 링크를 구성
        const fullLink = `${FRONTEND_URL}/seller/start?token=${token}`;
        
        console.log("최종 생성된 프론트엔드 링크:", fullLink); // 최종 링크 로그

        return {
            data: {
                link: fullLink, // 수정된 링크 반환
                status: status, // 서버로부터 받은 상태 반환
            }
        };
    } catch (error) {
        console.error('인증 링크 생성 실패:', error.response ? error.response.data : error.message);
        throw error; // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
};

// 인증 상태 조회 (GET /api/link/{verificationId})
export const getVerificationStatus = (verificationId) =>
    api.get(`/link/${verificationId}`);
