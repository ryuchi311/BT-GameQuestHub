import { useState, useEffect } from 'react';

export const useCountdown = (initialValue: number) => {
    const [count, setCount] = useState(initialValue);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isActive && count > 0) {
            const timer = setInterval(() => {
                setCount(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (count === 0) {
            setIsActive(false);
        }
    }, [isActive, count]);

    const start = () => setIsActive(true);
    const stop = () => setIsActive(false);
    const reset = () => {
        setCount(initialValue);
        setIsActive(false);
    };

    return { count, isActive, start, stop, reset };
};
