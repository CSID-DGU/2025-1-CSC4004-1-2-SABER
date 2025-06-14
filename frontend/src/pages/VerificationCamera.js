import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VerificationCamera() {
    const { id: verificationId } = useParams();
    const navigate = useNavigate();

    const [photoUrl, setPhotoUrl] = useState("");
    const [comment, setComment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');

    // 권한 관련 상태 추가
    const [permissionStatus, setPermissionStatus] = useState('checking'); // 'checking', 'granted', 'denied', 'prompt'
    const [cameraReady, setCameraReady] = useState(false);

    const [isCameraAllowed, setIsCameraAllowed] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    // 1. 컴포넌트 마운트 시 권한 확인
    useEffect(() => {
        checkCameraPermission();

        // 클린업 함수: 컴포넌트 언마운트 시 카메라 스트림 정리
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // 2. 권한이 허용되면 카메라 시작
    useEffect(() => {
        if (permissionStatus === 'granted' && !cameraReady) {
            startCamera();
        }
    }, [permissionStatus, cameraFacingMode]);

    // 3. 보안 위험 감지 useEffect
    useEffect(() => {
        const handleSecurityRisk = () => {
            if (isCameraAllowed) {
                return;
            }
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
            navigate('/capture-warning');
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleSecurityRisk();
            }
        };

        const handleBlur = () => {
            handleSecurityRisk();
        };

        // 카메라가 준비된 상태에서만 보안 이벤트 리스너 등록
        if (cameraReady) {
            window.addEventListener('blur', handleBlur);
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }

        return () => {
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [navigate, cameraReady]);

    // 카메라 권한 확인 함수
    const checkCameraPermission = async () => {
        try {
            // navigator.permissions API를 사용하여 권한 상태 확인
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'camera' });
                setPermissionStatus(permission.state);

                // 권한 상태 변경 리스너 등록
                permission.onchange = () => {
                    setPermissionStatus(permission.state);
                };
            } else {
                // permissions API를 지원하지 않는 브라우저의 경우 직접 권한 요청
                setPermissionStatus('prompt');
            }
        } catch (error) {
            console.error("권한 확인 오류:", error);
            setPermissionStatus('prompt');
        }
    };

    // 카메라 권한 요청 함수
    const requestCameraPermission = async () => {
        try {
            setPermissionStatus('checking');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: cameraFacingMode }
            });

            // 권한이 허용되면 스트림을 즉시 중지하고 상태 업데이트
            stream.getTracks().forEach(track => track.stop());
            setPermissionStatus('granted');
        } catch (error) {
            console.error("카메라 권한 요청 실패:", error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setPermissionStatus('denied');
            } else {
                setPermissionStatus('denied');
                alert("카메라에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.");
            }
        }
    };

    const toggleCameraFacingMode = () => {
        setCameraFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    };

    const startCamera = async () => {
        setIsCameraAllowed(true);
        // 기존 스트림이 있다면 중지합니다.
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: cameraFacingMode
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraReady(true);
            }
        } catch (err) {
            console.error("카메라 시작 오류:", err);
            setPermissionStatus('denied');
            setCameraReady(false);
        }
    };

    // 워터마크를 캔버스에 그리는 함수
    const drawWatermark = (ctx, canvasWidth, canvasHeight, watermarkText) => {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;

        const fontSize = Math.max(16, Math.min(canvasWidth, canvasHeight) * 0.04);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textMetrics = ctx.measureText(watermarkText);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;

        const padding = 20;
        const x = canvasWidth - textWidth / 2 - padding;
        const y = canvasHeight - textHeight / 2 - padding;

        const boxPadding = 10;
        ctx.fillRect(
            x - textWidth / 2 - boxPadding,
            y - textHeight / 2 - boxPadding,
            textWidth + boxPadding * 2,
            textHeight + boxPadding * 2
        );

        ctx.strokeText(watermarkText, x, y);
        ctx.fillStyle = 'black';
        ctx.fillText(watermarkText, x, y);
        ctx.restore();
    };

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const now = new Date();
        const date = now.toLocaleDateString('ko-KR');
        const time = now.toLocaleTimeString('ko-KR', { hour12: false });
        const watermarkText = `${date} ${time}에 촬영됨`;

        drawWatermark(ctx, canvas.width, canvas.height, watermarkText);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPhotoUrl(dataUrl);
        setShowModal(true);
    };

    const retakePhoto = () => {
        setShowModal(false);
        setPhotoUrl("");
    };

    const uploadPhoto = async () => {
        if (!canvasRef.current) return;
        setUploading(true);

        canvasRef.current.toBlob(async (blob) => {
            if (!blob) {
                alert("사진 변환 실패");
                setUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", new File([blob], "photo.jpg", { type: "image/jpeg" }));

            try {
                const uploadResponse = await fetch(`${baseURL}/api/files/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) throw new Error("업로드 실패");

                const s3Url = await uploadResponse.text();

                const submitResponse = await fetch(`${baseURL}/api/verifications/${verificationId}/submit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileUrl: s3Url
                    }),
                });

                if (!submitResponse.ok) throw new Error("제출 실패");

                alert("사진 제출 성공!");
                setShowModal(false);
                setIsCameraAllowed(false);
                navigate("/seller/verification-start");
            } catch (error) {
                alert(error.message);
            } finally {
                setUploading(false);
            }
        }, "image/jpeg", 0.9);
    };

    // 권한 상태에 따른 UI 렌더링
    if (permissionStatus === 'checking') {
        return (
            <div className="seller-camera-container">
                <h2 className="title">카메라 권한 확인 중...</h2>
                <p>잠시만 기다려주세요.</p>
            </div>
        );
    }

    if (permissionStatus === 'denied') {
        return (
            <div className="seller-camera-container">
                <h2 className="title">카메라 권한이 필요합니다</h2>
                <p>인증 사진을 촬영하기 위해 카메라 권한이 필요합니다.</p>
                <p>브라우저 설정에서 카메라 권한을 허용해주세요.</p>
                <button className="cameraButton" onClick={requestCameraPermission}>
                    카메라 권한 다시 요청
                </button>
                <button className="cameraButton" onClick={() => navigate(-1)}>
                    이전 페이지로 돌아가기
                </button>
            </div>
        );
    }

    if (permissionStatus === 'prompt') {
        return (
            <div className="seller-camera-container">
                <h2 className="title">카메라 권한 요청</h2>
                <p>인증 사진을 촬영하기 위해 카메라 권한이 필요합니다.</p>
                <button className="cameraButton" onClick={requestCameraPermission}>
                    카메라 권한 허용
                </button>
                <button className="cameraButton" onClick={() => navigate(-1)}>
                    취소
                </button>
            </div>
        );
    }

    // 권한이 허용된 경우 기존 UI 표시
    return (
        <div className="seller-camera-container">
            <h2 className="title">인증 사진 제출</h2>

            {!cameraReady && (
                <button className="cameraButton" onClick={startCamera}>
                    카메라 시작
                </button>
            )}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: 300, marginTop: 10, borderRadius: 8, backgroundColor: "#000" }}
            />

            {cameraReady && (
                <>
                    <br />
                    <button className="cameraButton" onClick={toggleCameraFacingMode}>
                        카메라 전환
                    </button>
                    <button onClick={takePhoto} className="cameraButton">
                        사진 촬영
                    </button>
                </>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* 사진 미리보기 모달 */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 style={{ marginBottom: '15px' }}>촬영된 사진</h3>

                        {photoUrl && (
                            <img
                                src={photoUrl}
                                alt="Captured"
                                className="modal-image"
                            />
                        )}

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                                onClick={retakePhoto}
                                className="cameraButton"
                            >
                                다시 촬영
                            </button>

                            <button
                                onClick={uploadPhoto}
                                disabled={uploading}
                                className="captureButton"
                            >
                                {uploading ? "업로드 중..." : "업로드 및 제출"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerificationCamera;