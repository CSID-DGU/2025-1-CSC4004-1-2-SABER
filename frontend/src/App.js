import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle'; // GlobalStyle 임포트
import { TimerProvider } from './contexts/TimerContext'; // TimerProvider 임포트

import StartScreen from './pages/StartScreen';
import PrecautionScreen from './pages/PrecautionScreen';
import CategoryScreen from './pages/CategoryScreen';
import VerificationSettingScreen from './pages/VerificationSettingScreen';
import PermissionScreen from './pages/PermissionScreen';
import VerificationLinkGeneratedScreen from './pages/VerificationLinkGeneratedScreen';
import WaitingScreen from './pages/WaitingScreen';

//판매자 UI
import SellerStartScreen from './pages/SellerStartScreen';
import SellerUsageGuideScreen from './pages/SellerUsageGuideScreen';
import SellerPermissionScreen from './pages/SellerPermissionScreen';
import SellerPermissionDeniedScreen from './pages/SellerPermissionDeniedScreen';
import SellerCameraScreen from './pages/SellerCameraScreen';
import SellerVerificationCompleteScreen from './pages/SellerVerificationCompleteScreen';
import SellerVerificationFailedScreen from './pages/SellerVerificationFailedScreen'; // 인증 실패 화면 추가
import SellerVerificationSubmitScreen from './pages/SellerVerificationSubmitScreen'; // 인증 제출 화면
import SellerVerificationAdditionalInfoScreen from './pages/SellerVerificationAdditionalInfoScreen'; 
import SellerVerificationSuccessScreen from './pages/SellerVerificationSuccessScreen';

//구매자
import BuyerVerificationCompleteScreen from './pages/BuyerVerificationCompleteScreen';
import ResultScreen from './pages/ResultScreen'
import CaptureWarningScreen from './pages/CaptureWarningScreen';
import EndScreen from './pages/EndScreen';
import S3Uploader from "./pages/S3Uploader";
import VerificationCamera from "./pages/VerificationCamera";
import SellerVerificationStart from "./pages/SellerVerificationStart";
import SellerVerificationList from "./pages/SellerVerificationStart";

function App() {
  const [verificationId, setVerificationId] = useState(null);
  const location = useLocation();

  useEffect(() => {
      fetch('http://192.168.45.85:8080/api/test')
          .then(response => response.text())
          .catch(error => console.error("Error fetching data: ", error));
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    if (location.pathname.startsWith('/seller')) {
      document.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <GlobalStyle />
      <TimerProvider>
        <Routes>
          <Route path="/" element={<StartScreen/>} />
          <Route path="/precaution" element={<PrecautionScreen/>} />
          <Route path="/category" element={<CategoryScreen onCategorySelected={setVerificationId} />} />
          <Route path="/verification-setting" element={<VerificationSettingScreen/>} />
          <Route path="/permission" element={<PermissionScreen />} />
          <Route path="/verification-link-generated" element={<VerificationLinkGeneratedScreen verificationId={verificationId} />} />
          <Route path="/waiting" element={<WaitingScreen />} />

          <Route path="/seller/start" element={<SellerStartScreen />} />
          <Route path="/seller/guide" element={<SellerUsageGuideScreen />} />
          <Route path="/seller/permission" element={<SellerPermissionScreen />} />
          <Route path="/seller/denied" element={<SellerPermissionDeniedScreen />} />
          <Route path="/seller/camera" element={<SellerCameraScreen />} />
          <Route path="/seller/verification-list" element={<SellerVerificationList />} />
          <Route path="/seller/verification-complete" element={<SellerVerificationCompleteScreen />} />
          <Route path="/seller/verification-failed" element={<SellerVerificationFailedScreen />} />
          <Route path="/seller/submit" element={<SellerVerificationSubmitScreen />} />
          <Route path="/seller/verification-additional-info" element={<SellerVerificationAdditionalInfoScreen />} />
          <Route path="/seller/verification-success" element={<SellerVerificationSuccessScreen />} />

          <Route path="/buyer/complete" element={<BuyerVerificationCompleteScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/capture-warning" element={<CaptureWarningScreen />} />
          <Route path="/end" element={<EndScreen />} />

          <Route path="/upload" element={<S3Uploader  />} />
          <Route path="/seller/verification-start" element={<SellerVerificationStart />} />
          <Route path="/verifications/:id/camera" element={<VerificationCamera />} />
          <Route path="*" element={<div>Not Found</div>} />

        </Routes>
      </TimerProvider>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default App;