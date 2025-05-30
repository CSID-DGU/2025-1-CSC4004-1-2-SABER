import React, { createContext, useState, useEffect, useContext } from 'react';

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  // 초기 시간: 10분 = 600초
  const initialTime = 600;
  const [timeLeft, setTimeLeft] = useState(() => {
    return initialTime;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(true); // 타이머 시작 상태

  useEffect(() => {
    let timerId;

    if (isTimerRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('sellerTimerLeft', newTime.toString()); // 로컬 스토리지에 시간 저장
          return newTime;
        });
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsTimerRunning(false); // 시간이 0이 되면 타이머 중지
      localStorage.removeItem('sellerTimerLeft'); // 타이머 종료 시 로컬 스토리지에서 삭제
    }

    // 컴포넌트 언마운트 또는 isTimerRunning, timeLeft 변경 시 타이머 정리
    return () => clearInterval(timerId);
  }, [timeLeft, isTimerRunning]);

  // 타이머를 재설정하는 함수
  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsTimerRunning(true);
    localStorage.setItem('sellerTimerLeft', initialTime.toString());
  };

  // 타이머를 중지하는 함수
  const stopTimer = () => {
    setIsTimerRunning(false);
  };

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

// Context를 편리하게 사용할 수 있도록 훅 생성
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};