import { useState, useCallback, useRef } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number;
  windowStart: number;
  isBlocked: boolean;
  blockUntil?: number;
}

export const useRateLimit = (key: string, options: RateLimitOptions) => {
  const { maxAttempts, windowMs, blockDurationMs = windowMs } = options;
  const stateRef = useRef<RateLimitState>({
    attempts: 0,
    windowStart: Date.now(),
    isBlocked: false
  });

  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const state = stateRef.current;

    // Check if still blocked
    if (state.isBlocked && state.blockUntil && now < state.blockUntil) {
      setIsBlocked(true);
      return false;
    }

    // Reset block if expired
    if (state.isBlocked && state.blockUntil && now >= state.blockUntil) {
      state.isBlocked = false;
      state.blockUntil = undefined;
      state.attempts = 0;
      state.windowStart = now;
      setIsBlocked(false);
    }

    // Reset window if expired
    if (now - state.windowStart > windowMs) {
      state.attempts = 0;
      state.windowStart = now;
    }

    // Increment attempts
    state.attempts++;

    // Check if limit exceeded
    if (state.attempts > maxAttempts) {
      state.isBlocked = true;
      state.blockUntil = now + blockDurationMs;
      setIsBlocked(true);
      return false;
    }

    return true;
  }, [maxAttempts, windowMs, blockDurationMs]);

  const getRemainingTime = useCallback((): number => {
    const state = stateRef.current;
    if (!state.isBlocked || !state.blockUntil) return 0;
    return Math.max(0, state.blockUntil - Date.now());
  }, []);

  const reset = useCallback(() => {
    stateRef.current = {
      attempts: 0,
      windowStart: Date.now(),
      isBlocked: false
    };
    setIsBlocked(false);
  }, []);

  return {
    checkRateLimit,
    isBlocked,
    getRemainingTime,
    reset,
    attemptsRemaining: Math.max(0, maxAttempts - stateRef.current.attempts)
  };
};