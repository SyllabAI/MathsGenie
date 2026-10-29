"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FORMULA_SHEET_URL,
  paperBySlug,
  paperDocLabel,
  paperDocUrl,
  type PaneDoc,
  type PastPaper,
  loadMarks,
  saveMark,
  type PaperMark,
} from "@/lib/papers";

/**
 * FullscreenPaperViewer recreation (original route /paper/{board}/{subject}/{slug}):
 * a split-pane, canvas-rendered PDF workspace with an annotation toolbar
 * (pen, highlighter, line, text + math text boxes, eraser, ruler, protractor,
 * compasses), per-pane zoom, a mark logger and an embedded fx-83GT-style
 * calculator. Question papers / mark schemes stream from the original asset
 * host — nothing is re-hosted.
 */

type Tool =
  | "select"
  | "text"
  | "math"
  | "pen"
  | "highlight"
  | "eraser"
  | "line"
  | "compasses";

type Op = { page: number } & (
  | {
      kind: "stroke";
      tool: "pen" | "highlight";
      color: string;
      width: number;
      pts: [number, number][]; // normalized 0..1 against page box
    }
  | { kind: "line"; color: string; width: number; a: [number, number]; b: [number, number] }
  | { kind: "arc"; color: string; width: number; c: [number, number]; rx: number; ry: number; a0: number; a1: number }
  | { kind: "text"; x: number; y: number; text: string; math?: boolean }
);

type Widget = "ruler" | "protractor" | null;

const COLORS = ["#111827", "#2563eb", "#dc2626", "#16a34a"] as const;
const THICKNESS = [
  { label: "Fine", pen: 1.6, hl: 10 },
  { label: "Medium", pen: 2.6, hl: 16 },
  { label: "Bold", pen: 4.2, hl: 24 },
] as const;

const ANN_KEY = (slug: string) => `mg-paper-annotations-v1:${slug}`;

type AnnStore = Record<string, Record<number, Op[]>>; // doc -> page -> ops

function loadAnnotations(slug: string): AnnStore {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(ANN_KEY(slug)) ?? "{}");
  } catch {
    return {};
  }
}

function persistAnnotations(slug: string, store: AnnStore) {
  try {
    window.localStorage.setItem(ANN_KEY(slug), JSON.stringify(store));
  } catch {
    /* quota — ignore */
  }
}

/* ---------------------------------- icons --------------------------------- */

const I = {
  back: "M19 12H5m0 0 6 6m-6-6 6-6",
  chevDown: "m6 9 6 6 6-6",
  close: "M6 6l12 12M18 6 6 18",
  zoomIn: "M12 5v14M5 12h14",
  zoomOut: "M5 12h14",
  undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  redo: "m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12h3",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  cursor: "M5 3l14 7-6 2-2 6z",
  type: "M5 6V4h14v2M12 4v16m-3 0h6",
  sqrt: "M3 12h3l3 8 5-16h7",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  marker: "M9 11l6-6 4 4-6 6H9v-4zM4 20h9",
  eraser: "m7 21-4-4 11-11 4 4-7 7m-4 4h14",
  line: "M5 19 19 5",
  ruler: "M3 17 17 3l4 4L7 21zM8 16l2 2M11 13l2 2M14 10l2 2",
  protractor: "M12 4a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 13l4-5",
  compass: "M12 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 4 5 12M12 7 7 19m5-12v3",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M4 21h16",
  print: "M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  calc: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 7h8M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01",
  flag: "M5 21V4m0 1h12l-2 4 2 4H5",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.8.7-1 1.5-1 2.5h-6c0-1-.2-1.8-1-2.5A6 6 0 0 1 12 3z",
};

function Icon({ d, className = "size-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}

/* ------------------------------- calculator ------------------------------- */

function Calculator({ onClose }: { onClose: () => void }) {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("0");
  const [model, setModel] = useState("fx-83GT CW");
  const [min, setMin] = useState(false);
  const exprRef = useRef("");

  const push = (s: string) => {
    exprRef.current += s;
    setExpr(exprRef.current);
  };
  const evaluate = () => {
    try {
      const js = exprRef.current
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/π/g, "(3.14159265358979)")
        .replace(/\^/g, "**");
      const fn = new Function(
        "S","C","T","L","N","R",
        `"use strict";return (${js || "0"})`
      );
      const r = fn(
        (x: number) => Math.sin((x * Math.PI) / 180),
        (x: number) => Math.cos((x * Math.PI) / 180),
        (x: number) => Math.tan((x * Math.PI) / 180),
        (x: number) => Math.log10(x),
        (x: number) => Math.log(x),
        (x: number) => Math.sqrt(x),
      );
      const clean = Number.isFinite(r) ? String(Math.round(r * 1e10) / 1e10) : "Math ERROR";
      setOut(clean);
      exprRef.current = clean === "Math ERROR" ? "" : clean;
      setExpr(exprRef.current);
    } catch {
      setOut("Syntax ERROR");
    }
  };
  const btn =
    "rounded-full h-9 text-[13px] font-medium text-zinc-100 bg-zinc-700 active:bg-zinc-600 hover:bg-zinc-500 border-b-2 border-black/40 leading-none";
  const btnD = "rounded-full h-9 text-[13px] font-medium bg-zinc-900 text-zinc-300 active:bg-zinc-800 border-b-2 border-black/60 leading-none";

  return (
    <div className="fixed bottom-24 left-1/2 z-50 w-[330px] -translate-x-1/2 sm:left-24 sm:translate-x-0" role="dialog" aria-label="Calculator">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <span className="text-sm font-bold">Calcula…</span>
          <select
            aria-label="Calculator model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-full border border-line bg-paper-2 px-2 py-1 text-xs"
          >
            <option>fx-83GT CW</option>
            <option>fx-991 CW</option>
          </select>
          <button aria-label="Minimise calculator" onClick={() => setMin((m) => !m)} className="ml-auto rounded-full p-1.5 hover:bg-paper-2">
            <svg viewBox="0 0 24 24" className="size-4" stroke="currentColor" strokeWidth="2" fill="none"><path d="m6 15 6-6 6 6" /></svg>
          </button>
          <button aria-label="Close calculator" onClick={onClose} className="rounded-full p-1.5 hover:bg-paper-2"><Icon d={I.close} className="size-4" /></button>
        </div>
        {!min && (
          <div className="bg-[#1c1e26] p-3">
            <p className="mb-1.5 text-[10px] font-medium text-zinc-400">{model} layout</p>
            <div className="rounded-md bg-[#c8cfad] px-3 py-2 text-right shadow-inner">
              <p className="h-4 truncate text-[11px] text-zinc-700">{expr || "\u00a0"}</p>
              <p className="truncate font-mono text-xl font-semibold text-zinc-900">{out}</p>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              <button className={btnD} aria-label="Power">ON</button>
              <button className={btnD} aria-label="Home">HOME</button>
              <button className={`${btnD} col-span-2`} aria-label="Settings">SETTINGS</button>
              <button className={btnD} aria-label="Shift">SHIFT</button>
              <button className={btnD} onClick={() => push("(")} aria-label="Left bracket">(</button>
              <button className={btnD} onClick={() => push(")")} aria-label="Right bracket">)</button>
              <button className={btnD} onClick={() => push("π")} aria-label="Pi">π</button>
              <button className={btnD} aria-label="Format">FORMAT</button>
              <button className={btn} onClick={() => { exprRef.current = exprRef.current.slice(0, -1); setExpr(exprRef.current); }} aria-label="Delete">DEL</button>
              <button className={btn} onClick={() => { exprRef.current = ""; setExpr(""); setOut("0"); }} aria-label="All clear">AC</button>
              <button className={btn} onClick={() => push("S(")} aria-label="Sine">sin</button>
              <button className={btn} onClick={() => push("C(")} aria-label="Cosine">cos</button>
              <button className={btn} onClick={() => push("T(")} aria-label="Tangent">tan</button>
              <button className={btn} onClick={() => push("^")} aria-label="Power">x■</button>
              <button className={btn} onClick={() => push("L(")} aria-label="Logarithm">log</button>
              <button className={btn} onClick={() => push("7")} aria-label="7">7</button>
              <button className={btn} onClick={() => push("8")} aria-label="8">8</button>
              <button className={btn} onClick={() => push("9")} aria-label="9">9</button>
              <button className={btn} onClick={() => push("N(")} aria-label="Natural log">ln</button>
              <button className={btn} aria-label="Answer">Ans</button>
              <button className={btn} onClick={() => push("4")} aria-label="4">4</button>
              <button className={btn} onClick={() => push("5")} aria-label="5">5</button>
              <button className={btn} onClick={() => push("6")} aria-label="6">6</button>
              <button className={btn} onClick={() => push("R(")} aria-label="Square root">√■</button>
              <button className={btn} onClick={() => push("+")} aria-label="Plus">+</button>
              <button className={btn} onClick={() => push("1")} aria-label="1">1</button>
              <button className={btn} onClick={() => push("2")} aria-label="2">2</button>
              <button className={btn} onClick={() => push("3")} aria-label="3">3</button>
              <button className={btn} onClick={() => push("×")} aria-label="Multiply">×</button>
              <button className={btn} onClick={() => push("−")} aria-label="Minus">−</button>
              <button className={btn} onClick={() => push("0")} aria-label="0">0</button>
              <button className={btn} onClick={() => push(".")} aria-label="Decimal point">.</button>
              <button className={btn} aria-label="Times ten to the">×10■</button>
              <button className={btn} onClick={() => push("÷")} aria-label="Divide">÷</button>
              <button className="h-9 rounded-full bg-emerald-600 text-[13px] font-semibold text-white hover:bg-emerald-500" onClick={evaluate} aria-label="Execute">EXE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- pdf pane -------------------------------- */

type PdfState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; numPages: number };

function usePdfDoc(url: string | null) {
  const [state, setState] = useState<PdfState>(() =>
    url ? { status: "loading" } : { status: "error", message: "No document available for this slot." },
  );
  const docRef = useRef<{ destroy: () => void } | null>(null);
  useEffect(() => {
    if (!url) return;
    let dead = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url, withCredentials: false }).promise;
        if (dead) {
          doc.destroy();
          return;
        }
        docRef.current = doc as unknown as { destroy: () => void };
        setState({ status: "ready", numPages: doc.numPages });
      } catch (e) {
        if (!dead)
          setState({
            status: "error",
            message:
              e instanceof Error && /password/i.test(e.message)
                ? "This document is password protected."
                : "Couldn't load this document. Check your connection and retry.",
          });
      }
    })();
    return () => {
      dead = true;
      docRef.current?.destroy();
      docRef.current = null;
    };
  }, [url]);
  return state;
}

/** Render one pdf page + annotation overlay into `host`. */
function usePageRender(
  host: HTMLDivElement | null,
  url: string | null,
  pageNo: number,
  zoom: number,
  ops: Op[],
  redrawTick: number,
) {
  useEffect(() => {
    if (!host || !url) return;
    let dead = false;
    const canvases = host.querySelectorAll<HTMLCanvasElement>("canvas");
    const base = canvases[0];
    const overlay = canvases[1];
    let task: { cancel: () => void; promise: Promise<void> } | null = null;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url }).promise;
        if (dead) return;
        const page = await doc.getPage(pageNo + 1);
        if (dead) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: zoom * dpr });
        const cssViewport = page.getViewport({ scale: zoom });
        base.width = viewport.width;
        base.height = viewport.height;
        base.style.width = `${cssViewport.width}px`;
        base.style.height = `${cssViewport.height}px`;
        overlay.width = viewport.width;
        overlay.height = viewport.height;
        overlay.style.width = `${cssViewport.width}px`;
        overlay.style.height = `${cssViewport.height}px`;
        const ctx = base.getContext("2d");
        if (!ctx) return;
        const t = page.render({ canvasContext: ctx, viewport }) as unknown as { cancel: () => void; promise: Promise<void> };
        task = t;
        await t.promise;
      } catch {
        /* cancelled or failed — pane shows its own error state */
      }
    })();

    return () => {
      dead = true;
      try {
        task?.cancel();
      } catch {
        /* noop */
      }
    };
  }, [host, url, pageNo, zoom, redrawTick]);

  // draw annotations whenever ops change
  useEffect(() => {
    if (!host) return;
    const overlay = host.querySelectorAll<HTMLCanvasElement>("canvas")[1];
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    const { width: W, height: H } = overlay;
    ctx.clearRect(0, 0, W, H);
    for (const op of ops) {
      ctx.lineWidth = op.kind === "text" ? 0 : op.width * (zoom * 2);
      ctx.strokeStyle = op.kind === "text" ? "transparent" : op.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (op.kind === "stroke") {
        ctx.globalAlpha = op.tool === "highlight" ? 0.32 : 1;
        ctx.beginPath();
        op.pts.forEach(([x, y], i) => {
          const px = x * W;
          const py = y * H;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (op.kind === "line") {
        ctx.beginPath();
        ctx.moveTo(op.a[0] * W, op.a[1] * H);
        ctx.lineTo(op.b[0] * W, op.b[1] * H);
        ctx.stroke();
      } else if (op.kind === "arc") {
        ctx.beginPath();
        ctx.ellipse(op.c[0] * W, op.c[1] * H, op.rx * W, op.ry * H, 0, op.a0, op.a1);
        ctx.stroke();
      }
    }
  }, [host, ops, zoom, redrawTick]);
}


/** One rendered pdf page: base canvas + annotation overlay canvas. */
function PageView({ url, pageNo, zoom }: { url: string; pageNo: number; zoom: number }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useEffect(() => setHost(hostRef.current), []);
  usePageRender(host, url, pageNo, zoom, [], pageNo);
  return (
    <div ref={hostRef} className="relative">
      <canvas className="block rounded-sm" />
      <canvas className="absolute inset-0" />
    </div>
  );
}

/* -------------------------------- doc pane --------------------------------- */

type PaneProps = {
  paper: PastPaper;
  doc: PaneDoc;
  zoom: number;
  tool: Tool;
  color: string;
  thick: number;
  widget: Widget;
  ops: Op[];
  onOps: (next: Op[]) => void;
  onDoc: (d: PaneDoc) => void;
  onClose: () => void;
  onZoom: (z: number) => void;
  label: string;
};

const DOC_ORDER: PaneDoc[] = ["question", "markscheme", "formula"];

function DocPane({
  paper,
  doc,
  zoom,
  tool,
  color,
  thick,
  widget,
  ops,
  onOps,
  onDoc,
  onClose,
  onZoom,
  label,
}: PaneProps) {
  const url = paperDocUrl(paper, doc);
  const state = usePdfDoc(url);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pageCount = state.status === "ready" ? state.numPages : 0;
  const [pageBoxes, setPageBoxes] = useState<{ w: number; h: number }[]>([]);
  const [editing, setEditing] = useState<{ page: number; x: number; y: number } | null>(null);
  const [draft, setDraft] = useState("");
  const [compass, setCompass] = useState<{ page: number; c: [number, number]; r: [number, number] } | null>(null);
  const [menu, setMenu] = useState(false);

  const drawOp = useCallback(
    (ctx: CanvasRenderingContext2D, op: Op, W: number, H: number) => {
      ctx.strokeStyle = op.kind === "text" ? "transparent" : op.color;
      ctx.lineWidth = op.kind === "text" ? 0 : op.width * (zoom * 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (op.kind === "stroke") {
        ctx.globalAlpha = op.tool === "highlight" ? 0.32 : 1;
        ctx.beginPath();
        op.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H)));
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (op.kind === "line") {
        ctx.beginPath();
        ctx.moveTo(op.a[0] * W, op.a[1] * H);
        ctx.lineTo(op.b[0] * W, op.b[1] * H);
        ctx.stroke();
      } else if (op.kind === "arc") {
        ctx.beginPath();
        ctx.ellipse(op.c[0] * W, op.c[1] * H, op.rx * W, op.ry * H, 0, op.a0, op.a1);
        ctx.stroke();
      }
    },
    [zoom],
  );

  // redraw committed annotation ops onto every page overlay
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const overlays = Array.from(root.querySelectorAll<HTMLCanvasElement>("canvas")).filter((_, i) => i % 2 === 1);
    overlays.forEach((c, page) => {
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const W = c.width;
      const H = c.height;
      ctx.clearRect(0, 0, W, H);
      for (const op of ops) if (op.page === page) drawOp(ctx, op, W, H);
    });
  }, [ops, zoom, pageCount, drawOp]);

  const norm = (e: { clientX: number; clientY: number }, el: HTMLElement): [number, number] => {
    const r = el.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  /* ---- pointer drawing on the overlay of a page ---- */
  const drag = useRef<null | { mode: "draw" | "line" | "erase"; pts: [number, number][]; start: [number, number]; page: number }>(null);

  const onPagePointerDown = (page: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (tool === "select" || editing) return;
    const overlay = e.currentTarget;
    try {
      overlay.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events may not support capture */
    }
    const p = norm(e, overlay);
    if (tool === "text" || tool === "math") {
      setEditing({ page, x: p[0], y: p[1] });
      setDraft("");
      return;
    }
    if (tool === "compasses") {
      setCompass({ page, c: p, r: p });
      return;
    }
    drag.current = {
      mode: tool === "line" ? "line" : tool === "eraser" ? "erase" : "draw",
      pts: [p],
      start: p,
      page,
    };
  };

  const onPagePointerMove = (page: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d && d.page === page) {
      const overlay = e.currentTarget;
      const p = norm(e, overlay);
      d.pts.push(p);
      if (d.mode === "draw" || d.mode === "line") {
        // live preview by temporarily drawing on overlay
        const c = overlay.querySelectorAll("canvas")[1];
        const ctx = c?.getContext("2d");
        if (ctx) {
          const W = c.width;
          const H = c.height;
          ctx.clearRect(0, 0, W, H);
          // draw committed ops underneath (cheap redraw, this page only)
          for (const op of ops) if (op.page === page) drawOp(ctx, op, W, H);
          ctx.strokeStyle = color;
          ctx.lineCap = "round";
          ctx.lineWidth =
            tool === "highlight" ? THICKNESS[thick].hl * (zoom * 2) : tool === "line" ? THICKNESS[thick].pen * (zoom * 2) : THICKNESS[thick].pen * (zoom * 2);
          ctx.globalAlpha = tool === "highlight" ? 0.32 : 1;
          ctx.beginPath();
          if (d.mode === "line") {
            ctx.moveTo(d.start[0] * W, d.start[1] * H);
            ctx.lineTo(p[0] * W, p[1] * H);
          } else {
            d.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H)));
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      } else if (d.mode === "erase" && d.pts.length > 2) {
        const tail = d.pts.slice(-2);
        const near = (op: Op): boolean => {
          if (op.kind === "text") return false;
          if (op.kind === "arc") {
            const r = Math.hypot(op.rx, op.ry) / 2;
            return Math.hypot(op.c[0] - tail[1][0], op.c[1] - tail[1][1]) < r + 0.012;
          }
          const pts = op.kind === "stroke" ? op.pts : [op.a, op.b];
          return pts.some(([x, y]) => tail.some(([tx, ty]) => Math.hypot(x - tx, y - ty) < 0.012));
        };
        onOps(ops.filter((op) => !near(op)));
      }
    }
    if (compass && compass.page === page) {
      const overlay = e.currentTarget;
      setCompass({ ...compass, r: norm(e, overlay) });
    }
  };

  const onPagePointerUp = (page: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d && d.page === page) {
      drag.current = null;
      if (d.mode === "draw" && d.pts.length > 1) {
        onOps([
          ...ops,
          {
            page,
            kind: "stroke",
            tool: tool === "highlight" ? "highlight" : "pen",
            color,
            width: tool === "highlight" ? THICKNESS[thick].hl : THICKNESS[thick].pen,
            pts: d.pts,
          },
        ]);
      } else if (d.mode === "line" && Math.hypot(d.pts[d.pts.length - 1][0] - d.start[0], d.pts[d.pts.length - 1][1] - d.start[1]) > 0.005) {
        onOps([...ops, { page, kind: "line", color, width: THICKNESS[thick].pen, a: d.start, b: d.pts[d.pts.length - 1] }]);
      }
    }
    if (compass && compass.page === page) {
      const dx = compass.r[0] - compass.c[0];
      const dy = compass.r[1] - compass.c[1];
      if (Math.hypot(dx, dy) > 0.01) {
        onOps([
          ...ops,
          {
            page,
            kind: "arc",
            color,
            width: THICKNESS[thick].pen,
            c: compass.c,
            rx: Math.abs(dx) || 0.02,
            ry: Math.abs(dx) * (pageBoxes[page]?.h && pageBoxes[page]?.w ? pageBoxes[page].h / pageBoxes[page].w : 1.414) || 0.02,
            a0: 0,
            a1: Math.PI * 2,
          },
        ]);
      }
      setCompass(null);
    }
  };

  const commitText = () => {
    if (editing && draft.trim()) {
      onOps([...ops, { page: editing.page, kind: "text", x: editing.x, y: editing.y, text: draft.trim(), math: tool === "math" }]);
    }
    setEditing(null);
    setDraft("");
  };

  const showGuides = widget !== null;
  const cursorClass =
    tool === "select" ? "cursor-default" : tool === "eraser" ? "cursor-cell" : tool === "text" || tool === "math" ? "cursor-text" : "cursor-crosshair";

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-zinc-100/80" aria-label={`${label}: ${paperDocLabel(doc)}`}>
      {/* pane header */}
      <div className="relative flex items-center gap-2 border-b border-line bg-panel px-3 py-1.5">
        <button
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-haspopup="listbox"
          className="flex min-w-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-medium hover:bg-paper-2"
        >
          <span className="truncate">{paperDocLabel(doc)}</span>
          <Icon d={I.chevDown} className="size-4 shrink-0 text-muted" />
        </button>
        {menu && (
          <ul role="listbox" aria-label="Pane document" className="absolute left-3 top-11 z-40 w-48 overflow-hidden rounded-xl border border-line bg-panel py-1 shadow-xl">
            {DOC_ORDER.map((d) => (
              <li key={d}>
                <button
                  role="option"
                  aria-selected={d === doc}
                  onClick={() => {
                    onDoc(d);
                    setMenu(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-paper-2 ${d === doc ? "font-semibold text-accent" : ""}`}
                >
                  {paperDocLabel(d)}
                  {d === doc && <span aria-hidden>✓</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
        <span className="ml-auto flex items-center gap-1">
          <button onClick={onClose} aria-label={`Close ${label} pane`} className="rounded-full p-1.5 text-muted hover:bg-paper-2 hover:text-ink">
            <Icon d={I.close} className="size-4" />
          </button>
        </span>
      </div>

      {/* pages */}
      <div ref={scrollRef} className="relative flex-1 overflow-auto px-4 py-4">
        {state.status === "loading" && (
          <div className="grid h-full place-items-center">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="size-4 animate-spin rounded-full border-2 border-line border-t-accent" /> Loading document…
            </div>
          </div>
        )}
        {state.status === "error" && (
          <div className="grid h-full place-items-center px-6 text-center">
            <div>
              <p className="font-semibold">{state.message}</p>
              <p className="mt-1 text-sm text-muted">
                The original PDF is hosted at <a className="text-accent underline" href={url ?? "#"} target="_blank" rel="noopener noreferrer">mathsgenie.co.uk</a>.
              </p>
            </div>
          </div>
        )}
        {state.status === "ready" &&
          Array.from({ length: pageCount }, (_, page) => (
            <div
              key={page}
              className={`relative mx-auto mb-5 w-fit rounded-sm bg-white shadow-[0_2px_14px_rgba(0,0,0,0.14)] ${cursorClass}`}
              onPointerDown={onPagePointerDown(page)}
              onPointerMove={onPagePointerMove(page)}
              onPointerUp={onPagePointerUp(page)}
            >
              <PageView url={url!} pageNo={page} zoom={zoom} />

              {/* text boxes */}
              {ops.map((op, i) =>
                op.kind === "text" ? (
                  <div
                    key={i}
                    className={`pointer-events-none absolute max-w-[60%] rounded-lg border-2 px-2 py-1 text-[13px] leading-snug ${
                      op.math ? "border-dashed border-accent/60 bg-sky-50/95 font-serif italic" : "border-accent/50 bg-amber-50/95"
                    }`}
                    style={{ left: `${op.x * 100}%`, top: `${op.y * 100}%`, transform: "translate(-4px, -4px)" }}
                  >
                    {op.text}
                  </div>
                ) : null,
              )}
              {editing && editing.page === page && (
                <div className="absolute z-30 w-56" style={{ left: `${editing.x * 100}%`, top: `${editing.y * 100}%` }}>
                  <div className="overflow-hidden rounded-xl border-2 border-accent bg-white shadow-xl">
                    <p className="border-b border-line px-2 pt-1.5 text-[11px] font-semibold text-ink">
                      Put your answer down
                      <span className="block font-normal text-muted">Click anywhere in the box and type your working. It saves as you go.</span>
                    </p>
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commitText}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitText();
                        if (e.key === "Escape") {
                          setEditing(null);
                          setDraft("");
                        }
                      }}
                      placeholder="Add text"
                      className="w-full bg-transparent px-2.5 py-2 text-[13px] outline-none"
                    />
                  </div>
                </div>
              )}
              {compass && compass.page === page && (
                <svg className="pointer-events-none absolute inset-0" width="100%" height="100%">
                  <circle
                    cx={`${compass.c[0] * 100}%`}
                    cy={`${compass.c[1] * 100}%`}
                    r={Math.hypot((compass.r[0] - compass.c[0]) * 100, (compass.r[1] - compass.c[1]) * 100)}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    opacity="0.8"
                  />
                </svg>
              )}
              {/* ruler / protractor guides */}
              {showGuides && widget === "ruler" && page === 0 && <Ruler />}
              {showGuides && widget === "protractor" && page === 0 && <Protractor />}
            </div>
          ))}
      </div>

      {/* zoom rail */}
      <div className="pointer-events-none absolute right-1 top-16 flex flex-col gap-1" aria-hidden />
      <div className="flex items-center justify-end gap-1 border-t border-line bg-panel/80 px-2 py-1">
        <button onClick={() => onZoom(Math.max(0.5, +(zoom - 0.15).toFixed(2)))} aria-label="Zoom out" className="rounded-full p-1.5 hover:bg-paper-2">
          <Icon d={I.zoomOut} className="size-4" />
        </button>
        <span className="w-10 text-center font-mono text-[11px] text-muted">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoom(Math.min(3, +(zoom + 0.15).toFixed(2)))} aria-label="Zoom in" className="rounded-full p-1.5 hover:bg-paper-2">
          <Icon d={I.zoomIn} className="size-4" />
        </button>
      </div>
    </section>
  );
}

function Ruler() {
  const [y, setY] = useState(180);
  return (
    <div
      className="absolute left-0 right-0 z-20 h-9 cursor-ns-resize border-y-2 border-amber-500/80 bg-gradient-to-b from-amber-100/95 to-amber-200/90 shadow-lg"
      style={{ top: y }}
      onPointerDown={(e) => {
        const el = e.currentTarget.parentElement!;
        const move = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          setY(Math.max(0, Math.min(ev.clientY - r.top - 18, r.height - 36)));
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <svg className="h-full w-full" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1={`${i * 1.666}%`} x2={`${i * 1.666}%`} y1={i % 10 === 0 ? 4 : i % 5 === 0 ? 8 : 12} y2="34" stroke="#b45309" strokeWidth={i % 5 === 0 ? 1.4 : 0.8} opacity="0.8" />
        ))}
      </svg>
      <span className="absolute right-2 top-0.5 rounded bg-amber-500/90 px-1 text-[9px] font-bold text-white">cm</span>
    </div>
  );
}

function Protractor() {
  const [pos, setPos] = useState({ x: 240, y: 160 });
  return (
    <div
      className="absolute z-20 cursor-move"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={(e) => {
        const el = e.currentTarget.parentElement!;
        const start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        const move = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          setPos({ x: Math.max(-160, Math.min(ev.clientX - start.x, r.width - 40)), y: Math.max(-120, Math.min(ev.clientY - start.y, r.height - 40)) });
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <svg width="320" height="170" viewBox="0 0 320 170" aria-hidden>
        <path d="M10 160 A150 150 0 0 1 310 160 Z" fill="rgba(59,130,246,0.14)" stroke="#2563eb" strokeWidth="2" />
        <path d="M160 160 L160 10" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
        {Array.from({ length: 19 }, (_, i) => {
          const a = (Math.PI * i) / 18;
          const x1 = 160 - Math.cos(a) * 132;
          const y1 = 160 - Math.sin(a) * 132;
          const x2 = 160 - Math.cos(a) * 150;
          const y2 = 160 - Math.sin(a) * 150;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1d4ed8" strokeWidth="1.2" />;
        })}
        {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((deg) => {
          const a = (Math.PI * deg) / 180;
          const x = 160 - Math.cos(a) * 112;
          const y = 160 - Math.sin(a) * 112;
          return (
            <text key={deg} x={x} y={y} fontSize="11" textAnchor="middle" fill="#1e3a8a" transform={`rotate(${deg === 0 ? 0 : 0} ${x} ${y})`}>
              {deg}
            </text>
          );
        })}
        <circle cx="160" cy="160" r="5" fill="#2563eb" />
      </svg>
    </div>
  );
}

/* -------------------------------- workspace -------------------------------- */

export default function PaperWorkspace({ slug }: { slug: string }) {
  const paper = useMemo(() => paperBySlug(slug), [slug]);
  const [leftDoc, setLeftDoc] = useState<PaneDoc>("question");
  const [zooms, setZooms] = useState<Record<string, number>>({ question: 1, markscheme: 1, formula: 1 });
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState<string>(COLORS[0]);
  const [thick, setThick] = useState(1);
  const [widget, setWidget] = useState<Widget>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [more, setMore] = useState(false);
  const [calc, setCalc] = useState(false);
  const [marks, setMarks] = useState<Record<string, PaperMark>>({});
  const [markDlg, setMarkDlg] = useState(false);
  const search = useSearchParams();
  const [ann, setAnn] = useState<AnnStore>({});
  const [depths, setDepths] = useState<Record<string, { u: number; r: number }>>({});

  const undoStacks = useRef<Record<string, Op[][]>>({});
  const redoStacks = useRef<Record<string, Op[][]>>({});

  // deep link ?doc=markscheme opens the split view straight away
  const [rightDoc, setRightDoc] = useState<PaneDoc | null>(() =>
    search.get("doc") === "formula" ? "formula" : search.get("doc") === "markscheme" ? "markscheme" : null,
  );

  // bootstrap local state (deferred: localStorage is client-only)
  useEffect(() => {
    const t = setTimeout(() => {
      setMarks(loadMarks());
      setAnn(loadAnnotations(slug));
    }, 0);
    return () => clearTimeout(t);
  }, [slug]);

  // persist annotations debounced
  useEffect(() => {
    if (!Object.keys(ann).length) return;
    const t = setTimeout(() => persistAnnotations(slug, ann), 400);
    return () => clearTimeout(t);
  }, [ann, slug]);

  const setOps = useCallback((doc: PaneDoc, next: Op[]) => {
    setAnn((s) => ({ ...s, [doc]: { ...(s[doc] ?? {}), 0: next } }));
  }, []);

  const opsFor = useCallback((doc: PaneDoc): Op[] => ann[doc]?.[0] ?? [], [ann]);

  const commitOps = useCallback(
    (doc: PaneDoc, next: Op[]) => {
      const prev = ann[doc]?.[0] ?? [];
      undoStacks.current[doc] = [...(undoStacks.current[doc] ?? []).slice(-40), prev];
      redoStacks.current[doc] = [];
      setOps(doc, next);
      setDepths((s) => ({ ...s, [doc]: { u: (undoStacks.current[doc]?.length ?? 0), r: 0 } }));
    },
    [ann, setOps],
  );

  const undoDoc = useCallback(
    (doc: PaneDoc) => {
      const stack = undoStacks.current[doc] ?? [];
      if (!stack.length) return;
      const prev = stack[stack.length - 1];
      undoStacks.current[doc] = stack.slice(0, -1);
      redoStacks.current[doc] = [...(redoStacks.current[doc] ?? []), ann[doc]?.[0] ?? []];
      setOps(doc, prev);
      setDepths((s) => ({ ...s, [doc]: { u: (undoStacks.current[doc]?.length ?? 0), r: (redoStacks.current[doc]?.length ?? 0) } }));
    },
    [ann, setOps],
  );

  const redoDoc = useCallback(
    (doc: PaneDoc) => {
      const stack = redoStacks.current[doc] ?? [];
      if (!stack.length) return;
      const nxt = stack[stack.length - 1];
      redoStacks.current[doc] = stack.slice(0, -1);
      undoStacks.current[doc] = [...(undoStacks.current[doc] ?? []), ann[doc]?.[0] ?? []];
      setOps(doc, nxt);
      setDepths((s) => ({ ...s, [doc]: { u: (undoStacks.current[doc]?.length ?? 0), r: (redoStacks.current[doc]?.length ?? 0) } }));
    },
    [ann, setOps],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMore(false);
        setMarkDlg(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoDoc(leftDoc);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leftDoc, undoDoc]);

  if (!paper) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
        <div>
          <h1 className="font-hand text-3xl font-bold">Paper not found</h1>
          <p className="mt-2 text-muted">This paper isn&apos;t in the recreated catalog.</p>
          <Link href="/gcse/maths/edexcel/papers" className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper">
            Back to past papers
          </Link>
        </div>
      </div>
    );
  }

  const backHref = "/gcse/maths/edexcel/papers";
  const saved = marks[slug];

  const downloadUrl = paper.paperUrl ?? undefined;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100/80">
      {/* top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-line bg-panel px-3 sm:px-4">
        <Link href={backHref} aria-label="Back to past papers" className="rounded-full p-2 hover:bg-paper-2">
          <Icon d={I.back} />
        </Link>
        <p className="ml-1 hidden max-w-[36ch] truncate text-sm font-semibold sm:block">{paper.title}</p>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setRightDoc((d) => (d ? null : "markscheme"))}
            className="flex items-center gap-2 rounded-full bg-teal-700 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-teal-600"
            aria-pressed={!!rightDoc}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16M4 10h16M4 15h10M4 20h10" /></svg>
            {rightDoc ? "Hide mark scheme" : "View mark scheme"}
          </button>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" aria-label="Download question paper" className="rounded-full p-2 hover:bg-paper-2">
            <Icon d={I.download} />
          </a>
          <button onClick={() => window.print()} aria-label="Print" className="rounded-full p-2 hover:bg-paper-2">
            <Icon d={I.print} />
          </button>
          <div className="relative">
            <button onClick={() => setMore((m) => !m)} aria-expanded={more} aria-haspopup="menu" aria-label="More controls" className="rounded-full p-2 hover:bg-paper-2">
              <Icon d={I.more} />
            </button>
            {more && (
              <ul role="menu" aria-label="More controls" className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-line bg-panel py-1 shadow-xl">
                <li role="none">
                  <button role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-paper-2" onClick={() => { setRightDoc((d) => (d === "formula" ? null : "formula")); setMore(false); }}>
                    <Icon d={I.bulb} className="size-4 text-muted" /> Formula sheet
                  </button>
                </li>
                <li role="none">
                  <button role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-paper-2" onClick={() => { setCalc((c) => !c); setMore(false); }}>
                    <Icon d={I.calc} className="size-4 text-muted" /> Calculator
                  </button>
                </li>
                <li role="none">
                  <Link role="menuitem" href="/feature-requests" className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-paper-2">
                    <Icon d={I.flag} className="size-4 text-muted" /> Report an issue
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <button
            onClick={() => setMarkDlg(true)}
            className="ml-1 hidden rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold hover:bg-paper-2 sm:block"
          >
            {saved ? `Your mark: ${saved.doneOnly ? "done" : `${saved.mark}/${saved.outOf}`}` : "Log your mark"}
          </button>
        </div>
      </header>

      {/* panes */}
      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <DocPane
          key={`left-${leftDoc}`}
          paper={paper}
          doc={leftDoc}
          zoom={zooms[leftDoc] ?? 1}
          tool={tool}
          color={color}
          thick={thick}
          widget={widget}
          ops={opsFor(leftDoc)}
          onOps={(next) => commitOps(leftDoc, next)}
          onDoc={setLeftDoc}
          onClose={() => {
            if (rightDoc) setLeftDoc(rightDoc);
            setRightDoc(null);
          }}
          onZoom={(z) => setZooms((s) => ({ ...s, [leftDoc]: z }))}
          label="Left pane"
        />
        {rightDoc && (
          <>
            <div className="hidden w-px shrink-0 bg-line lg:block" aria-hidden />
            <DocPane
              key={`right-${rightDoc}`}
              paper={paper}
              doc={rightDoc}
              zoom={zooms[rightDoc] ?? 1}
              tool={tool}
              color={color}
              thick={thick}
              widget={widget}
              ops={opsFor(rightDoc)}
              onOps={(next) => commitOps(rightDoc, next)}
              onDoc={setRightDoc}
              onClose={() => setRightDoc(null)}
              onZoom={(z) => setZooms((s) => ({ ...s, [rightDoc]: z }))}
              label="Right pane"
            />
          </>
        )}
      </div>

      {/* annotation toolbar */}
      {!collapsed && (
        <div className="sticky bottom-3 z-40 mx-auto mb-3 flex max-w-[94vw] items-center gap-0.5 overflow-x-auto rounded-2xl border border-line bg-panel px-2 py-1.5 shadow-2xl" role="toolbar" aria-label="Annotation tools">
          <TBtn label="Undo" onClick={() => undoDoc(leftDoc)} icon={I.undo} disabled={!(depths[leftDoc]?.u ?? 0)} />
          <TBtn label="Redo" onClick={() => redoDoc(leftDoc)} icon={I.redo} disabled={!(depths[leftDoc]?.r ?? 0)} />
          <TBtn label="Clear all annotations" icon={I.trash} danger disabled={!opsFor(leftDoc).length} onClick={() => commitOps(leftDoc, [])} />
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <TBtn label="Browse" icon={I.cursor} active={tool === "select"} onClick={() => { setTool("select"); setWidget(null); }} />
          <TBtn label="Text box" icon={I.type} active={tool === "text"} onClick={() => setTool("text")} />
          <TBtn label="Math text box" icon={I.sqrt} active={tool === "math"} onClick={() => setTool("math")} />
          <TBtn label="Pen" icon={I.pen} active={tool === "pen"} onClick={() => setTool("pen")} />
          <TBtn label="Highlighter" icon={I.marker} active={tool === "highlight"} onClick={() => setTool("highlight")} />
          <TBtn label="Eraser" icon={I.eraser} active={tool === "eraser"} onClick={() => setTool("eraser")} />
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <span className="flex items-center gap-1 px-1" role="radiogroup" aria-label="Pen colour">
            {COLORS.map((c) => (
              <button
                key={c}
                role="radio"
                aria-checked={color === c}
                aria-label={c === COLORS[0] ? "Black" : c === COLORS[1] ? "Blue" : c === COLORS[2] ? "Red" : "Green"}
                onClick={() => { setColor(c); if (tool === "select") setTool("pen"); }}
                className={`size-5 rounded-full border-2 ${color === c ? "border-accent ring-2 ring-accent/30" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))}
          </span>
          <span className="flex items-center gap-1 px-1" role="radiogroup" aria-label="Pen thickness">
            {THICKNESS.map((t, i) => (
              <button
                key={t.label}
                role="radio"
                aria-checked={thick === i}
                aria-label={`Pen thickness: ${t.label}`}
                onClick={() => { setThick(i); if (tool === "select") setTool("pen"); }}
                className={`grid size-6 place-items-center rounded-full ${thick === i ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
              >
                <span className="rounded-full bg-current" style={{ width: 3 + i * 3, height: 3 + i * 3 }} />
              </button>
            ))}
          </span>
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <TBtn label="Line" icon={I.line} active={tool === "line"} onClick={() => setTool("line")} />
          <TBtn
            label={widget === "ruler" ? "Hide ruler" : "Ruler"}
            icon={I.ruler}
            active={widget === "ruler"}
            onClick={() => { setWidget((w) => (w === "ruler" ? null : "ruler")); setTool("select"); }}
          />
          <TBtn
            label={widget === "protractor" ? "Hide protractor" : "Protractor"}
            icon={I.protractor}
            active={widget === "protractor"}
            onClick={() => { setWidget((w) => (w === "protractor" ? null : "protractor")); setTool("select"); }}
          />
          <TBtn label="Compasses" icon={I.compass} active={tool === "compasses"} onClick={() => setTool("compasses")} />
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <button onClick={() => setCollapsed(true)} aria-label="Collapse toolbar" className="rounded-full p-2 text-muted hover:bg-paper-2 hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-5" stroke="currentColor" strokeWidth="2" fill="none"><path d="m18 15-6-6-6 6" /></svg>
          </button>
        </div>
      )}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper shadow-xl"
        >
          Show annotation tools
        </button>
      )}

      {/* ask genie float */}
      <Link
        href="/ask-genie"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-teal-600"
      >
        <span className="grid size-5 place-items-center rounded-full bg-teal-400/40 text-[11px]" aria-hidden>✦</span>
        Open Ask Genie
      </Link>

      {calc && <Calculator onClose={() => setCalc(false)} />}

      {markDlg && <MarkDialog paper={paper} saved={saved ?? null} onDone={(m) => { if (m) saveMark(slug, m); else saveMark(slug, null); setMarks(loadMarks()); setMarkDlg(false); }} />}
    </div>
  );
}

function TBtn({
  label,
  icon,
  active,
  danger,
  disabled,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
        disabled ? "text-muted/40" : danger ? "text-red-600 hover:bg-red-50" : active ? "bg-ink text-paper" : "hover:bg-paper-2"
      }`}
    >
      <Icon d={icon} />
    </button>
  );
}

function MarkDialog({
  paper,
  saved,
  onDone,
}: {
  paper: PastPaper;
  saved: PaperMark | null;
  onDone: (m: PaperMark | null) => void;
}) {
  const [mark, setMark] = useState(saved?.mark ?? 0);
  const [outOf, setOutOf] = useState(saved?.outOf ?? 80);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Log your mark">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-hand text-2xl font-bold">Log your mark</h2>
            <p className="mt-0.5 text-xs text-muted">{paper.title}</p>
          </div>
          <button onClick={() => onDone(saved)} aria-label="Close" className="rounded-full p-1.5 text-muted hover:bg-paper-2">
            <Icon d={I.close} className="size-4" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold">
            Your mark
            <input
              type="number"
              min={0}
              value={mark}
              onChange={(e) => setMark(Math.max(0, Number(e.target.value)))}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-semibold">
            Out of
            <input
              type="number"
              min={1}
              value={outOf}
              onChange={(e) => setOutOf(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => onDone({ mark, outOf, at: Date.now() })} className="flex-1 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Save mark
          </button>
          <button onClick={() => onDone({ mark: 0, outOf, doneOnly: true, at: Date.now() })} className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold hover:bg-paper-2">
            Just mark as done
          </button>
        </div>
      </div>
    </div>
  );
}
