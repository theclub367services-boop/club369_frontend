import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * useIdleTimeout hook
 * Detects user inactivity and logs them out automatically to protect their session.
 * 
 * @param timeoutMs Idle time before logout (default: 30 minutes)
 */
export const useIdleTimeout = (timeoutMs = 30 * 60 * 1000) => {
    const { isAuthenticated, logout } = useAuth();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        if (!isAuthenticated) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            console.warn("User has been idle for too long. Logging out for security.");
            logout();
        }, timeoutMs);
    }, [isAuthenticated, logout, timeoutMs]);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Reset timer on mount
        resetTimer();

        // Browser events indicating user activity
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

        const handleInteraction = () => resetTimer();

        // Bind events
        events.forEach((e) => window.addEventListener(e, handleInteraction, { passive: true }));

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach((e) => window.removeEventListener(e, handleInteraction));
        };
    }, [isAuthenticated, resetTimer]);
};
