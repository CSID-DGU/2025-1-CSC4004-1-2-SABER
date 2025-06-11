import React, { useEffect, useRef, useState, useCallback } from 'react'; // useCallback 추가
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';

function SellerCameraScreen() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [stream, setStream] = useState(null);
    // facingMode 상태 추가: 'user'는 전면, 'environment'는 후면
    const [facingMode, setFacingMode] = useState('user'); 
    const [cameraLoading, setCameraLoading] = useState(true); // 카메라 로딩 상태 추가

    // 카메라 스트림을 시작하는 함수 (재사용을 위해 useCallback으로 묶음)
    const startCamera = useCallback(async (mode) => {
        setCameraLoading(true); // 카메라 로딩 시작
        if (stream) { // 기존 스트림이 있다면 중지
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: mode } // 선택된 facingMode 적용
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => { // 비디오 메타데이터 로드 완료 후 재생
                    videoRef.current.play().catch(error => {
                        console.error("비디오 재생 오류:", error);
                        // 자동 재생이 안될 경우 사용자에게 재생 버튼을 제공하는 등의 처리가 필요할 수 있습니다.
                    });
                };
            }
            setStream(mediaStream);
            setCameraLoading(false); // 카메라 로딩 완료
        } catch (err) {
            console.error('카메라 접근 오류:', err);
            setStream(null);
            setCameraLoading(false); // 로딩 종료
            // 사용자에게 권한 거부 등의 상황을 알리는 UI 제공
            alert('카메라 접근이 거부되었거나 사용 가능한 카메라가 없습니다. 설정을 확인해주세요.');
            // navigate('/seller/denied'); // 권한 거부 시 특정 페이지로 이동 고려
        }
    }, [stream]); // stream이 변경될 때만 이 함수를 다시 생성

    // 1. 초기 카메라 접근 및 스트림 관리 useEffect
    useEffect(() => {
        startCamera(facingMode); // 초기 facingMode로 카메라 시작

        // 클린업 함수: 컴포넌트 언마운트 시 카메라 스트림 중지
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null); // 스트림 상태 초기화
            }
        };
    }, [facingMode]); // facingMode가 변경될 때마다 카메라 다시 시작

    // 2. 보안 위험 감지 useEffect
    useEffect(() => {
        const handleSecurityRisk = () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
            navigate('/capture-warning'); // 경고 페이지로 이동
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleSecurityRisk();
            }
        };

        const handleBlur = () => {
            handleSecurityRisk();
        };

        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [navigate, stream]);

    // 카메라 전환 핸들러
    const toggleCamera = () => {
        setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    };

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL('image/png');
            localStorage.setItem('capturedImage', image);

            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }

            navigate('/seller/verification-complete');
        }
    };

    return (
        <div className="captureContainer">
            {cameraLoading && (
                <div className="cameraLoading">
                    카메라 로딩 중...
                    <br />
                    {/* 사용자에게 어떤 카메라를 로드 중인지 알려줄 수 있습니다. */}
                    {facingMode === 'user' ? '전면 카메라' : '후면 카메라'}
                </div>
            )}
            <video ref={videoRef} autoPlay playsInline className="video" style={{ display: cameraLoading ? 'none' : 'block' }} /> {/* 로딩 중일 때는 비디오 숨김 */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {!cameraLoading && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && (
                <button onClick={toggleCamera} className="toggleCameraButton">
                    {facingMode === 'user' ? '후면 카메라로 전환' : '전면 카메라로 전환'}
                </button>
            )}

            {/* 캡처 버튼 (스트림 활성화 및 로딩 완료 시에만 활성화) */}
            <button 
                onClick={handleCapture} 
                className="captureButton" 
                disabled={!stream || cameraLoading} 
            />
            <div className="cameraLabel">사진 촬영</div>
        </div>
    );
}

export default SellerCameraScreen;