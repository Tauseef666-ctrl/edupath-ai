"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Assessment,
  JourneyState,
  LearnerProfile,
  PlanDecision,
  TaskStatus,
} from "@/lib/types";
import { DEMO_PROFILE } from "@/lib/data/demo";
import {
  adjustWeeklyHours,
  applyAnalysis,
  applyAssessment,
  applyDecision,
  applyTaskStatus,
  initialState,
} from "@/lib/store-core";

const STORAGE_KEY = "edupath:state:v2";

interface JourneyApi {
  state: JourneyState;
  loadDemo: () => void;
  runAnalysis: (profile: LearnerProfile) => void;
  submitAssessment: (
    assessment: Assessment,
    answers: Record<string, number | string>
  ) => void;
  decide: (decision: PlanDecision) => void;
  setTaskStatus: (taskId: string, status: TaskStatus) => void;
  setWeeklyHours: (hours: number) => void;
  reset: () => void;
}

const JourneyContext = createContext<JourneyApi | null>(null);

function loadPersisted(): JourneyState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as JourneyState;
    return { ...initialState(), ...parsed };
  } catch {
    return initialState();
  }
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(() => initialState());
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    setState(loadPersisted());
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — state stays in memory
    }
  }, [state]);

  const loadDemo = useCallback(() => {
    setState((s) => ({
      ...applyAnalysis(s, DEMO_PROFILE),
      demoMode: true,
    }));
  }, []);

  const runAnalysis = useCallback((profile: LearnerProfile) => {
    setState((s) => applyAnalysis(s, profile));
  }, []);

  const submitAssessment = useCallback(
    (assessment: Assessment, answers: Record<string, number | string>) => {
      setState((s) => applyAssessment(s, assessment, answers));
    },
    []
  );

  const decide = useCallback((decision: PlanDecision) => {
    setState((s) => applyDecision(s, decision));
  }, []);

  const setTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setState((s) => applyTaskStatus(s, taskId, status));
  }, []);

  const setWeeklyHours = useCallback((hours: number) => {
    setState((s) => adjustWeeklyHours(s, hours));
  }, []);

  const reset = useCallback(() => {
    setState(initialState());
  }, []);

  const api = useMemo<JourneyApi>(
    () => ({
      state,
      loadDemo,
      runAnalysis,
      submitAssessment,
      decide,
      setTaskStatus,
      setWeeklyHours,
      reset,
    }),
    [state, loadDemo, runAnalysis, submitAssessment, decide, setTaskStatus, setWeeklyHours, reset]
  );

  return <JourneyContext.Provider value={api}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyApi {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}