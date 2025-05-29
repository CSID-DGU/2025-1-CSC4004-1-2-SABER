import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import SellerVerificationStartScreen from './pages/SellerVerificationStartScreen';
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
import {TimerProvider} from "./src/contexts/TimerContext";

function App() {
  return (
      <TimerProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartScreen/>}/>
            <Route path="/precaution" element={<PrecautionScreen/>}/>
            <Route path="/category" element={<CategoryScreen/>}/>
            <Route path="/verification-setting" element={<VerificationSettingScreen/>}/>
            <Route path="/permission" element={<PermissionScreen/>}/>
            <Route path="/verification-link-generated" element={<VerificationLinkGeneratedScreen/>}/>
            <Route path="/waiting" element={<WaitingScreen/>}/>

            <Route path="/seller/start" element={<SellerStartScreen/>}/>
            <Route path="/seller/guide" element={<SellerUsageGuideScreen/>}/>
            <Route path="/seller/permission" element={<SellerPermissionScreen/>}/>
            <Route path="/seller/denied" element={<SellerPermissionDeniedScreen/>}/>
            <Route path="/seller/verification-start" element={<SellerVerificationStartScreen />} />
            <Route path="/seller/camera" element={<SellerCameraScreen/>}/>
            <Route path="/seller/verification-complete" element={<SellerVerificationCompleteScreen/>}/>
            <Route path="/seller/verification-failed" element={<SellerVerificationFailedScreen/>}/>
            <Route path="/seller/submit" element={<SellerVerificationSubmitScreen/>}/>
            <Route path="/seller/verification-additional-info" element={<SellerVerificationAdditionalInfoScreen/>}/>
            <Route path="/seller/verification-success" element={<SellerVerificationSuccessScreen/>}/>

            <Route path="/buyer/complete" element={<BuyerVerificationCompleteScreen/>}/>
            <Route path="/result" element={<ResultScreen/>}/>
            <Route path="/capture-warning" element={<CaptureWarningScreen/>}/>
            <Route path="/end" element={<EndScreen/>}/>
          </Routes>
        </div>
      </TimerProvider>
  );
}

export default App;