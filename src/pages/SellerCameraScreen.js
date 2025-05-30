import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sellers.css';

function SellerCameraScreen() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);

  // 1. 카메라 접근 및 스트림 관리 useEffect
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) { // videoRef.current가 null이 아닐 때만 srcObject 설정
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error('카메라 접근 오류:', err);
        // 사용자에게 카메라 접근이 거부되었음을 알리거나, 대체 UI를 제공할 수 있습니다.
        // 예: alert('카메라 접근이 거부되었습니다. 설정을 확인해주세요.');
        // navigate('/permission-denied'); // 권한 거부 시 특정 페이지로 이동
      }
    };

    startCamera();

    // 클린업 함수: 컴포넌트 언마운트 시 카메라 스트림 중지
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]); // stream이 변경될 때만 다시 실행

  // 2. 보안 위험 감지 useEffect (추가된 부분)
  useEffect(() => {
    const handleSecurityRisk = () => {
      // 카메라 스트림이 활성화되어 있다면 중지
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null); // 스트림 상태 초기화
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
  }, [navigate, stream]); // navigate와 stream을 의존성 배열에 추가

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

      // 캡처 후 스트림 중지 (선택 사항)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null); // 스트림 상태 초기화
      }

      navigate('/seller/verification-complete');
    }
  };

  return (
    <div className="captureContainer">
      {/* 카메라 스트림이 없을 때 로딩 메시지 또는 에러 메시지 표시 가능 */}
      {!stream && <div className="cameraLoading">카메라 로딩 중... 또는 카메라 접근을 허용해주세요.</div>}
      <video ref={videoRef} autoPlay playsInline className="video" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* 스트림이 활성화되었을 때만 캡처 버튼 활성화 */}
      <button onClick={handleCapture} className="captureButton" disabled={!stream} />
      <div className="cameraLabel">사진 촬영</div>
    </div>
  );
}

export default SellerCameraScreen;