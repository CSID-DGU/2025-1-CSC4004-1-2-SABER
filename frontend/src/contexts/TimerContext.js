import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react'; // useCallback 임포트 추가

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const initialTime = 600; // 10분 = 600초
  const timerIdRef = useRef(null); // setInterval ID를 저장할 useRef

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('sellerTimerLeft');
    if (savedTime !== null && parseInt(savedTime) > 0) {
      return parseInt(savedTime);
    }
    return initialTime;
  });

  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    const savedTime = localStorage.getItem('sellerTimerLeft');
    return savedTime !== null && parseInt(savedTime) > 0;
  });

  // 타이머 시작/정지 로직을 관리하는 useEffect
  useEffect(() => {
    // isTimerRunning이 true이고, 남은 시간이 0보다 많을 때만 타이머를 시작
    if (isTimerRunning && timeLeft > 0) {
      // 기존 타이머가 있다면 정리
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }

      // 새로운 타이머 시작
      timerIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('sellerTimerLeft', newTime.toString());

          // 시간이 0 이하가 되면 타이머 중지
          if (newTime <= 0) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
            setIsTimerRunning(false);
            localStorage.removeItem('sellerTimerLeft');
            console.log('타이머 자동 종료: 시간이 0이 됨');
          }
          return newTime;
        });
      }, 1000);
      console.log('타이머 시작 (useEffect):', timeLeft);
    } else if (!isTimerRunning && timerIdRef.current) { // isTimerRunning이 false이고 타이머가 실행 중이었다면
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
      console.log('타이머 수동 정지 (useEffect):', timeLeft);
    } else if (timeLeft <= 0 && isTimerRunning) { // 시간이 0이 되어 자동 종료될 경우
      setIsTimerRunning(false);
      localStorage.removeItem('sellerTimerLeft');
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      console.log('타이머 자동 종료 (useEffect): 시간이 0이 됨');
    }


    // 클린업 함수: 컴포넌트 언마운트 또는 useEffect 재실행 전 호출
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        console.log('useEffect 클린업: 타이머 cleared');
      }
      // isTimerRunning이 false인 경우 (수동으로 멈췄을 때) 현재 시간 저장
      // (timeLeft가 0보다 클 때만)
      if (!isTimerRunning && timeLeft > 0) {
         localStorage.setItem('sellerTimerLeft', timeLeft.toString());
      }
    };
  }, [isTimerRunning, timeLeft]); // 💡 의존성 배열에서 timeLeft를 제거하거나, isTimerRunning만 의존하도록 변경

  // resetTimer 함수 (useCallback으로 메모이제이션)
  const resetTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setTimeLeft(initialTime);
    setIsTimerRunning(true);
    localStorage.setItem('sellerTimerLeft', initialTime.toString());
    console.log('resetTimer 호출됨: 타이머 초기화 및 재시작');
  }, [initialTime]); // initialTime이 변경될 일이 없으므로 안정적

  // stopTimer 함수 (useCallback으로 메모이제이션)
  const stopTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setIsTimerRunning(false); // 타이머를 멈춤 상태로 설정
    localStorage.setItem('sellerTimerLeft', timeLeft.toString()); // 현재 시간 저장
    console.log('stopTimer 호출됨! isTimerRunning:', false, '남은 시간:', timeLeft);
  }, [timeLeft]); // timeLeft가 변경될 때마다 함수가 재생성될 수 있음 (useCallback 필요성 논의)


  // 시간을 MM:SS 형식으로 포맷팅하는 유틸리티 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <TimerContext.Provider value={{ timeLeft, isTimerRunning, resetTimer, stopTimer, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};