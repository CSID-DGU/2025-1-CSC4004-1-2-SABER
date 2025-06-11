import React, { useState } from "react";

function S3Uploader() {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const baseURL = process.env.REACT_APP_BASE_URL;

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 업로드 핸들러
    const handleUpload = async () => {
        if (!file) {
            alert("파일을 선택해주세요!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${baseURL}/api/files/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("업로드 실패");
            }

            // 서버가 String 형태로 URL 반환한다고 가정
            const url = await response.text();
            setImageUrl(url);
            alert("업로드 성공!");
        } catch (error) {
            alert("업로드 중 오류 발생: " + error.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>S3 파일 업로드</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ marginLeft: 10 }}>
                업로드
            </button>

            {imageUrl && (
                <div style={{ marginTop: 20 }}>
                    <h3>업로드된 이미지</h3>
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{ maxWidth: 300, maxHeight: 300 }}
                    />
                </div>
            )}
        </div>
    );
}

export default S3Uploader;
