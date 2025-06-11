import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VerificationCamera() {
    const { id: verificationId } = useParams();
    const navigate = useNavigate();

    const [photoUrl, setPhotoUrl] = useState("");
    const [comment, setComment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState('user');

    // 1. 카메라 시작 및 전환 로직
    useEffect(() => {
        startCamera();

        // 클린업 함수: 컴포넌트 언마운트 시 카메라 스트림 정리
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [cameraFacingMode]); // cameraFacingMode가 변경될 때마다 이 useEffect를 재실행

    // 2. 보안 위험 감지 useEffect
    useEffect(() => {
        const handleSecurityRisk = () => {
            // videoRef.current.srcObject를 통해 현재 스트림에 접근
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null; // 스트림을 명시적으로 null로 설정
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
    }, [navigate]); // videoRef.current.srcObject는 직접적인 의존성 배열에 넣기 어려워 navigate만 포함

    // 랜덤 코드 생성 함수
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    // 워터마크를 캔버스에 그리는 함수
    const drawWatermark = (ctx, canvasWidth, canvasHeight, watermarkText) => {
        // 워터마크 스타일 설정
        ctx.save();
        ctx.globalAlpha = 0.7; // 투명도 설정
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // 배경색 (반투명 흰색)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; // 테두리색
        ctx.lineWidth = 2;

        // 폰트 크기 동적 조정 (캔버스 크기에 따라)
        const fontSize = Math.max(16, Math.min(canvasWidth, canvasHeight) * 0.04);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 텍스트 크기 측정
        const textMetrics = ctx.measureText(watermarkText);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;

        // 워터마크 위치 (우하단)
        const padding = 20;
        const x = canvasWidth - textWidth / 2 - padding;
        const y = canvasHeight - textHeight / 2 - padding;

        // 배경 박스 그리기
        const boxPadding = 10;
        ctx.fillRect(
            x - textWidth / 2 - boxPadding,
            y - textHeight / 2 - boxPadding,
            textWidth + boxPadding * 2,
            textHeight + boxPadding * 2
        );

        // 텍스트 테두리 그리기
        ctx.strokeText(watermarkText, x, y);

        // 텍스트 그리기
        ctx.fillStyle = 'black';
        ctx.fillText(watermarkText, x, y);

        ctx.restore();
    };

    const toggleCameraFacingMode = () => {
        setCameraFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    };

    const startCamera = async () => {
        // 기존 스트림이 있다면 중지합니다.
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: cameraFacingMode // 현재 카메라 방향 상태 사용
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("카메라 접근 오류:", err);
            alert("카메라 권한이 필요하거나 해당 카메라를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.");
            // 권한 거부 시 적절한 페이지로 이동
            // navigate('/permission-denied'); // 예시: 권한 거부 페이지
        }
    };

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext("2d");

        // 비디오 이미지를 캔버스에 그리기
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 랜덤 코드 생성 및 워터마크 추가
        const randomCode = generateRandomCode();
        const now = new Date();
        const date = now.toLocaleDateString('ko-KR');
        const time = now.toLocaleTimeString('ko-KR', { hour12: false });
        const watermarkText = `${randomCode} | ${date} ${time}`;

        drawWatermark(ctx, canvas.width, canvas.height, watermarkText);

        // 캔버스에서 사진 미리보기용 URL 생성
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9); // 품질 0.9로 설정
        setPhotoUrl(dataUrl);
        setShowModal(true); // 모달 표시
    };

    const retakePhoto = () => {
        setShowModal(false);
        setPhotoUrl("");
        // 카메라는 계속 실행 중이므로 다시 촬영 가능
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
                // 1) S3 업로드 API 호출
                const uploadResponse = await fetch("http://localhost:8080/api/files/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) throw new Error("업로드 실패");

                const s3Url = await uploadResponse.text();

                // 2) 인증 제출 API 호출 (comment 포함)
                const submitResponse = await fetch(`http://localhost:8080/api/verifications/${verificationId}/submit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileUrl: s3Url,
                        comment: comment,
                    }),
                });

                if (!submitResponse.ok) throw new Error("제출 실패");

                alert("사진 제출 성공!");
                setShowModal(false);
                navigate("/seller/verification-start");
            } catch (error) {
                alert(error.message);
            } finally {
                setUploading(false);
            }
        }, "image/jpeg", 0.9); // 품질 0.9로 설정
    };

    return (
        <div className="seller-camera-container">
            <h2 className="title">인증 사진 제출</h2>
            <button className="cameraButton" onClick={startCamera}>
                카메라 시작
            </button>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: 300, marginTop: 10, borderRadius: 8, backgroundColor: "#000" }}
            />

            <br />
            <button className="cameraButton" onClick={toggleCameraFacingMode}>
                카메라 전환
            </button>
            <button onClick={takePhoto} className="cameraButton">
                사진 촬영
            </button>

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

                        <textarea
                            placeholder="인증에 대한 코멘트를 입력하세요"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="textBox"
                        />

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