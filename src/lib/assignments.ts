"use client";
import { useEffect, useState } from "react";

/**
 * Client-side homework & test store for the recreation (research/04-member-area.md
 * §4: "Make a test — pick the questions and set it for your class" and
 * "Set homework — choose the tasks and send them to your class").
 * The original keeps these server-side per classroom; here they live in
 * localStorage so the full flows — set homework, make a test, sit the test,
 * save the score — behave like the original without a backend.
 */

export type Task = { topic: string; count: number };

export type Homework = {
  id: string;
  classroomId: string;
  title: string;
  tasks: Task[];
  due: string; // ISO date (yyyy-mm-dd)
  createdAt: number;
  completed: boolean;
};

export type TestPaper = {
  id: string;
  classroomId: string;
  title: string;
  tasks: Task[];
  minutes: number;
  createdAt: number;
};

export type Result = {
  id: string;
  kind: "homework" | "test";
  refId: string;
  score: number; // marks earned
  total: number; // marks available
  at: number;
};

const KEYS = {
  homework: "mg-homework",
  tests: "mg-tests",
  results: "mg-results",
} as const;

const LISTENERS = new Set<() => void>();

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(key: string, list: unknown[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
  LISTENERS.forEach((fn) => fn());
}

function emit() {
  LISTENERS.forEach((fn) => fn());
}

export function listHomework(): Homework[] {
  return read<Homework>(KEYS.homework);
}

export function listTests(): TestPaper[] {
  return read<TestPaper>(KEYS.tests);
}

export function listResults(): Result[] {
  return read<Result>(KEYS.results);
}

export function getTest(id: string): TestPaper | undefined {
  return listTests().find((t) => t.id === id);
}

export function getHomework(id: string): Homework | undefined {
  return listHomework().find((h) => h.id === id);
}

export function addHomework(input: {
  classroomId: string;
  title: string;
  tasks: Task[];
  due: string;
}): Homework {
  const hw: Homework = {
    id: Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6),
    ...input,
    title: input.title.trim() || "Homework",
    createdAt: Date.now(),
    completed: false,
  };
  write(KEYS.homework, [hw, ...listHomework()]);
  return hw;
}

export function toggleHomework(id: string) {
  write(
    KEYS.homework,
    listHomework().map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
  );
}

export function removeHomework(id: string) {
  write(KEYS.homework, listHomework().filter((h) => h.id !== id));
  emit();
}

export function addTest(input: {
  classroomId: string;
  title: string;
  tasks: Task[];
  minutes: number;
}): TestPaper {
  const t: TestPaper = {
    id: Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6),
    ...input,
    title: input.title.trim() || "Test",
    createdAt: Date.now(),
  };
  write(KEYS.tests, [t, ...listTests()]);
  return t;
}

export function removeTest(id: string) {
  write(KEYS.tests, listTests().filter((t) => t.id !== id));
  emit();
}

export function addResult(input: { kind: "homework" | "test"; refId: string; score: number; total: number }) {
  const r: Result = {
    id: Math.random().toString(36).slice(2, 10),
    ...input,
    at: Date.now(),
  };
  write(KEYS.results, [r, ...listResults()].slice(0, 100));
  return r;
}

export function bestResult(kind: "homework" | "test", refId: string): Result | undefined {
  return listResults()
    .filter((r) => r.kind === kind && r.refId === refId)
    .sort((a, b) => b.score / Math.max(b.total, 1) - a.score / Math.max(a.total, 1))[0];
}

export function dueLabel(due: string): { text: string; tone: "late" | "soon" | "ok" } {
  const d = new Date(`${due}T23:59:59`);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { text: `Overdue by ${-days} day${-days === 1 ? "" : "s"}`, tone: "late" };
  if (days === 0) return { text: "Due today", tone: "soon" };
  if (days === 1) return { text: "Due tomorrow", tone: "soon" };
  return { text: `Due in ${days} days`, tone: "ok" };
}

/* React hooks: lists from localStorage, SSR-safe (first read deferred to rAF). */
function useStored<T>(key: string): T[] {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setItems(read<T>(key)));
    const un = subscribe(() => setItems(read<T>(key)));
    return () => {
      cancelAnimationFrame(raf);
      un();
    };
  }, [key]);
  return items;
}

export function useHomework(): Homework[] {
  return useStored<Homework>(KEYS.homework);
}

export function useTests(): TestPaper[] {
  return useStored<TestPaper>(KEYS.tests);
}

export function useResults(): Result[] {
  return useStored<Result>(KEYS.results);
}

export function subscribeClassrooms(cb: () => void) {
  LISTENERS.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    LISTENERS.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// alias kept for symmetry with lib/classrooms
export const subscribe = subscribeClassrooms;
