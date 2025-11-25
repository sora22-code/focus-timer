import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, Platform } from 'react-native';

export type TimerMode = 'FOCUS' | 'BREAK';

interface UseTimerProps {
    focusDuration?: number; // in minutes
    breakDuration?: number; // in minutes
    onTimerComplete?: (mode: TimerMode) => void;
}

export const useTimer = ({
    focusDuration = 25,
    breakDuration = 5,
    onTimerComplete,
}: UseTimerProps = {}) => {
    const [mode, setMode] = useState<TimerMode>('FOCUS');
    const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsActive(false);
        setTimeLeft(mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
    }, [mode, focusDuration, breakDuration]);

    const switchMode = useCallback(() => {
        const nextMode = mode === 'FOCUS' ? 'BREAK' : 'FOCUS';
        setMode(nextMode);
        setTimeLeft(nextMode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
        setIsActive(false);
    }, [mode, focusDuration, breakDuration]);

    const [isDead, setIsDead] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const appState = useRef(AppState.currentState);

    const toggleTimer = useCallback(() => {
        if (isDead) setIsDead(false); // Revive on start
        if (isSuccess) setIsSuccess(false); // Clear success on new start
        setIsActive((prev) => !prev);
    }, [isDead, isSuccess]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            setIsSuccess(true); // Mark as successful completion
            if (onTimerComplete) onTimerComplete(mode);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, onTimerComplete, mode]);

    // Update timeLeft if duration props change while not active
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
        }
    }, [focusDuration, breakDuration, mode]);

    useEffect(() => {
        // Mobile & Standard Web Visibility
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/active/) &&
                nextAppState.match(/inactive|background/) &&
                isActive &&
                mode === 'FOCUS'
            ) {
                console.log('App went to background. Killing character.');
                setIsDead(true);
                setIsSuccess(false); // Not a success if interrupted
                resetTimer(); // Reset timer immediately
            }
            appState.current = nextAppState;
        });

        // Web-specific: Trigger on window blur OR visibility change (tab switch)
        if (Platform.OS === 'web') {
            const onBlur = () => {
                if (isActive && mode === 'FOCUS') {
                    console.log('Window blurred. Killing character.');
                    setIsDead(true);
                    setIsSuccess(false); // Not a success if interrupted
                    resetTimer(); // Reset timer immediately
                }
            };

            const onVisibilityChange = () => {
                if (document.visibilityState === 'hidden' && isActive && mode === 'FOCUS') {
                    console.log('Tab hidden. Killing character.');
                    setIsDead(true);
                    setIsSuccess(false); // Not a success if interrupted
                    resetTimer(); // Reset timer immediately
                }
            };

            window.addEventListener('blur', onBlur);
            document.addEventListener('visibilitychange', onVisibilityChange);

            return () => {
                subscription.remove();
                window.removeEventListener('blur', onBlur);
                document.removeEventListener('visibilitychange', onVisibilityChange);
            };
        }

        return () => {
            subscription.remove();
        };
    }, [isActive, mode, resetTimer]);

    // Reset dead state when timer is started again (toggleTimer handles start)
    // actually we need to handle manual reset of death state.
    // Let's reset isDead when user toggles timer to start.

    const totalTime = mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60;
    const progress = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0;

    return {
        timeLeft,
        isActive,
        mode,
        progress,
        isDead,
        isSuccess,
        toggleTimer,
        resetTimer,
        switchMode,
        setMode,
        setIsDead,
    };
};
