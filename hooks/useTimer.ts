import { useEffect, useRef, useState } from "react";

const useTimer = (initialSeconds?: number) => {
  const [time, setTime] = useState(initialSeconds || 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { time };
};

export default useTimer;
