"use client";
import { useEffect, useState } from "react";

/**
 * Client-side classroom store for the recreation (research/04-member-area.md §4).
 * The original keeps classrooms server-side; here they live in localStorage so
 * the creation flow and classroom-scoped pages behave like the original without
 * a backend. Shape mirrors what the creation modal collects: subject + board(s)
 * + name + a generated id.
 */

export type Classroom = {
  id: string;
  name: string;
  subject: string;
  boards: string[];
  createdAt: number;
};

const KEY = "mg-classrooms";
const LISTENERS = new Set<() => void>();

function read(): Classroom[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list: Classroom[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  LISTENERS.forEach((fn) => fn());
}

export function listClassrooms(): Classroom[] {
  return read();
}

export function getClassroom(id: string): Classroom | undefined {
  return read().find((c) => c.id === id);
}

export function addClassroom(input: { name: string; subject: string; boards: string[] }): Classroom {
  const room: Classroom = {
    id: Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6),
    name: input.name.trim() || "New Maths classroom",
    subject: input.subject,
    boards: input.boards.length ? input.boards : ["Edexcel"],
    createdAt: Date.now(),
  };
  write([room, ...read()]);
  return room;
}

export function removeClassroom(id: string) {
  write(read().filter((c) => c.id !== id));
}

export function subscribeClassrooms(cb: () => void) {
  LISTENERS.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    LISTENERS.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good late night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const USER = { first: "nawaf al hussain", full: "nawaf al hussain khondokar" };

/* React hook: classrooms from localStorage, SSR-safe (defers the first read
   to rAF so no setState happens synchronously inside an effect). */
export function useClassrooms(): Classroom[] {
  const [rooms, setRooms] = useState<Classroom[]>([]);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRooms(listClassrooms()));
    const un = subscribeClassrooms(() => setRooms(listClassrooms()));
    return () => {
      cancelAnimationFrame(raf);
      un();
    };
  }, []);
  return rooms;
}
