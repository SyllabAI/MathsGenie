"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * FloatingWindow — recreation of the original's `mg-popup` window system:
 * a fixed-position panel with a draggable title bar, minimize / close
 * buttons and eight edge/corner resize handles (n s e w ne nw se sw).
 * Original signature: `mg-popup fixed flex flex-col overflow-hidden
 * rounded-2xl border-2 border-subtle bg-background shadow-xl` with inline
 * `top/left/width/height`, z-index 1010, `.mg-popup-top cursor-move`
 * header and `.resizer.resizer-{n,s,e,w,ne,nw,se,sw}` handles.
 */

export type WinState = {
  top: number;
  left: number;
  width: number;
  height: number;
  minimized: boolean;
  closed: boolean;
};

export function initWin(top: number, left: number, width: number, height: number): WinState {
  return { top, left, width, height, minimized: false, closed: false };
}

const MIN_W = 300;
const MIN_H = 180;

export default function FloatingWindow({
  title,
  state,
  onChange,
  onClose,
  children,
  maxW = 900,
  maxH = 700,
  ariaLabel,
}: {
  title: string;
  state: WinState;
  onChange: (next: WinState) => void;
  onClose: () => void;
  children: React.ReactNode;
  maxW?: number;
  maxH?: number;
  ariaLabel?: string;
}) {
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ dir: string; x0: number; y0: number; w0: number; h0: number; t0: number; l0: number } | null>(null);
  const [, force] = useState(0);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    const r = resizeRef.current;
    if (d) {
      const left = Math.min(Math.max(0, e.clientX - d.dx), window.innerWidth - 80);
      const top = Math.min(Math.max(0, e.clientY - d.dy), window.innerHeight - 44);
      onChange({ ...state, top, left });
    } else if (r) {
      let { w0, h0, t0, l0 } = r;
      const dx = e.clientX - r.x0;
      const dy = e.clientY - r.y0;
      let width = state.width;
      let height = state.height;
      let top = state.top;
      let left = state.left;
      if (r.dir.includes("e")) width = Math.min(Math.max(MIN_W, w0 + dx), maxW);
      if (r.dir.includes("s")) height = Math.min(Math.max(MIN_H, h0 + dy), maxH);
      if (r.dir.includes("w")) {
        width = Math.min(Math.max(MIN_W, w0 - dx), maxW);
        left = l0 + (w0 - width);
      }
      if (r.dir.includes("n")) {
        height = Math.min(Math.max(MIN_H, h0 - dy), maxH);
        top = t0 + (h0 - height);
      }
      onChange({ ...state, width, height, top, left });
    }
  }, [state, onChange, maxW, maxH]);

  useEffect(() => {
    const up = () => {
      dragRef.current = null;
      resizeRef.current = null;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", up);
    };
  }, [onPointerMove]);

  if (state.closed) return null;

  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { dx: e.clientX - state.left, dy: e.clientY - state.top };
    document.body.style.userSelect = "none";
    force((n) => n + 1);
  };

  /* single stable resize handler — reads the direction from data-resize,
     so no curried handlers are created during render */
  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dir = (e.currentTarget as HTMLElement).dataset.resize;
    if (!dir) return;
    resizeRef.current = { dir, x0: e.clientX, y0: e.clientY, w0: state.width, h0: state.height, t0: state.top, l0: state.left };
    document.body.style.userSelect = "none";
  };

  const h = state.minimized ? 46 : state.height;

  return (
    <div
      role="dialog"
      aria-label={ariaLabel ?? title}
      className="mg-popup fixed flex flex-col overflow-hidden rounded-2xl border-2 border-subtle bg-paper shadow-xl"
      style={{
        top: state.top,
        left: state.left,
        width: state.width,
        height: h,
        maxWidth: maxW,
        maxHeight: maxH,
        zIndex: 1010,
        minWidth: MIN_W,
        minHeight: state.minimized ? 46 : MIN_H,
      }}
    >
      {/* title bar — draggable */}
      <div
        className="mg-popup-top z-10 flex shrink-0 cursor-move select-none items-center gap-1 border-b-2 border-subtle py-2.5 pl-5 pr-2.5"
        onPointerDown={startDrag}
        onDoubleClick={() => onChange({ ...state, minimized: !state.minimized })}
        role="presentation"
      >
        <h5 className="min-w-0 truncate font-title text-lg font-medium tracking-tight text-ink">{title}</h5>
        <div className="grow" />
        <div className="inline-flex shrink-0 items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Minimize"
            onClick={() => onChange({ ...state, minimized: !state.minimized })}
            className="grid size-8 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-ink/10 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-ink/10 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* content */}
      {!state.minimized && <div className="mg-popup-content grow overflow-hidden bg-paper">{children}</div>}

      {/* resize handles */}
      {!state.minimized && (
        <>
          <div className="resizer resizer-n absolute inset-x-3 top-0 h-1.5 cursor-n-resize" data-resize="n" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-s absolute inset-x-3 bottom-0 h-1.5 cursor-s-resize" data-resize="s" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-e absolute inset-y-3 right-0 w-1.5 cursor-e-resize" data-resize="e" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-w absolute inset-y-3 left-0 w-1.5 cursor-w-resize" data-resize="w" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-ne absolute right-0 top-0 size-3 cursor-ne-resize" data-resize="ne" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-nw absolute left-0 top-0 size-3 cursor-nw-resize" data-resize="nw" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-se absolute bottom-0 right-0 size-3 cursor-se-resize" data-resize="se" onPointerDown={startResize} role="presentation" />
          <div className="resizer resizer-sw absolute bottom-0 left-0 size-3 cursor-sw-resize" data-resize="sw" onPointerDown={startResize} role="presentation" />
        </>
      )}
    </div>
  );
}
