"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FORMULA_SHEET_URL,
  paperBySlug,
  paperDocLabel,
  paperDocUrl,
  papersPast,
  type PaneDoc,
  type PaperSeries,
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
  | "browse"
  | "select"
  | "text"
  | "math"
  | "pen"
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

const COLORS = [
  { name: "Black", hex: "#111827" },
  { name: "Red", hex: "#dc2626" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#16a34a" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Orange", hex: "#ea580c" },
] as const;
const THICKNESS = [
  { label: "Fine", pen: 1.6, hl: 10 },
  { label: "Medium", pen: 2.6, hl: 16 },
  { label: "Bold", pen: 4.2, hl: 24 },
  { label: "Extra bold", pen: 6.5, hl: 34 },
] as const;
const colorName = (hex: string) => COLORS.find((c) => c.hex === hex)?.name ?? "Black";

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
  selectBox: "M4 4h4M16 4h4M20 8v4M20 16v4M16 20h4M8 20H4M4 16v-4M4 8V4",
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
  penHandle: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  home: "M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 3",
  chat: "M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z",
  rail: "M4 6h16M4 12h16M4 18h16",
  panelToggle: "M4 5h16v14H4zM9 5v14",
  book: "M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 0-2 2zM4 5v16",
  arrowSplit: "M4 12h12m0 0-4-4m4 4-4 4M20 5v14",
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

function CalcRow({ children }: { children: React.ReactNode }) {
  return <div className="flex items-stretch gap-1.5">{children}</div>;
}

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
    "h-8 flex-1 rounded-full text-[12px] font-medium text-zinc-100 bg-[#39415a] active:bg-[#4a5470] hover:bg-[#434c66] border-b-2 border-black/40 leading-none";
  const btnD =
    "h-8 flex-1 rounded-full text-[10px] font-semibold text-zinc-300 bg-[#232941] active:bg-[#2c3450] border-b-2 border-black/50 leading-none";
  const btnF =
    "h-8 flex-1 rounded-full text-[12px] font-semibold text-zinc-100 bg-[#39415a] active:bg-[#4a5470] border-b-2 border-black/40 leading-none";

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
          <div className="bg-[#171c2b] p-3">
            <p className="mb-1.5 text-[10px] font-medium text-zinc-500">{model} layout</p>
            <div className="rounded-md bg-[#c9cdb2] px-3 py-2 text-right shadow-inner">
              <p className="h-4 truncate text-[11px] text-zinc-700">{expr || "\u00a0"}</p>
              <p className="truncate font-mono text-xl font-semibold text-zinc-900">{out}</p>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <CalcRow>
                <button className={btnD} onClick={() => { exprRef.current = ""; setExpr(""); setOut("0"); }} aria-label="Power">ON</button>
                <button className={btnD} aria-label="Home">HOME</button>
                <span className="flex-1" />
                <button className={btnD} aria-label="Cursor up">▲</button>
                <button className={btnD} aria-label="Cursor down">▼</button>
              </CalcRow>
              <CalcRow>
                <button className={btnD} aria-label="Settings">SETTINGS</button>
                <button className={btnD} aria-label="Cursor left">◀</button>
                <button className={btnF} onClick={evaluate} aria-label="OK">OK</button>
                <button className={btnD} aria-label="Cursor right">▶</button>
                <button className={btnD} aria-label="Down">▽</button>
              </CalcRow>
              <CalcRow>
                <button className="h-8 flex-1 rounded-full border-b-2 border-black/50 bg-[#1d4ed8] text-[10px] font-semibold leading-none text-white active:bg-[#2b5cd9]" aria-label="Shift">SHIFT</button>
                <button className={btnD} aria-label="Variable">VARIABLE</button>
                <button className={btnD} aria-label="Function">FUNCTION</button>
                <button className={btnD} aria-label="Catalog">CATALOG</button>
                <button className={btnD} aria-label="Tools">TOOLS</button>
              </CalcRow>
              <CalcRow>
                <button className={btn} aria-label="x">x</button>
                <button className={btn} aria-label="Fraction">x□</button>
                <button className={btn} onClick={() => push("R(")} aria-label="Square root">√□</button>
                <button className={btn} onClick={() => push("^")} aria-label="Power">x■</button>
                <button className={btn} onClick={() => push("^2")} aria-label="Square">x²</button>
                <button className={btn} onClick={() => push("L(")} aria-label="Logarithm">log□</button>
              </CalcRow>
              <CalcRow>
                <button className={btn} aria-label="Answer">Ans</button>
                <button className={btn} onClick={() => push("S(")} aria-label="Sine">sin</button>
                <button className={btn} onClick={() => push("C(")} aria-label="Cosine">cos</button>
                <button className={btn} onClick={() => push("T(")} aria-label="Tangent">tan</button>
                <button className={btn} onClick={() => push("(")} aria-label="Left bracket">(</button>
                <button className={btn} onClick={() => push(")")} aria-label="Right bracket">)</button>
              </CalcRow>
              <CalcRow>
                <button className={btn} onClick={() => push("7")} aria-label="7">7</button>
                <button className={btn} onClick={() => push("8")} aria-label="8">8</button>
                <button className={btn} onClick={() => push("9")} aria-label="9">9</button>
                <button className={btnF} onClick={() => { exprRef.current = exprRef.current.slice(0, -1); setExpr(exprRef.current); }} aria-label="Delete">⌫</button>
                <button className={btnF} onClick={() => { exprRef.current = ""; setExpr(""); setOut("0"); }} aria-label="All clear">AC</button>
              </CalcRow>
              <CalcRow>
                <button className={btn} onClick={() => push("4")} aria-label="4">4</button>
                <button className={btn} onClick={() => push("5")} aria-label="5">5</button>
                <button className={btn} onClick={() => push("6")} aria-label="6">6</button>
                <button className={btnF} onClick={() => push("×")} aria-label="Multiply">×</button>
                <button className={btnF} onClick={() => push("÷")} aria-label="Divide">÷</button>
              </CalcRow>
              <CalcRow>
                <button className={btn} onClick={() => push("1")} aria-label="1">1</button>
                <button className={btn} onClick={() => push("2")} aria-label="2">2</button>
                <button className={btn} onClick={() => push("3")} aria-label="3">3</button>
                <button className={btnF} onClick={() => push("+")} aria-label="Plus">+</button>
                <button className={btnF} onClick={() => push("−")} aria-label="Minus">−</button>
              </CalcRow>
              <CalcRow>
                <button className={btn} onClick={() => push("0")} aria-label="0">0</button>
                <button className={btn} onClick={() => push(".")} aria-label="Decimal point">.</button>
                <button className={btnF} onClick={() => push("×10^")} aria-label="Times ten to the">×10■</button>
                <button className={`${btnF} bg-emerald-700 hover:bg-emerald-600`} onClick={evaluate} aria-label="Execute">EXE</button>
              </CalcRow>
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
  papersOpen: boolean;
  onTogglePapers: () => void;
  style?: React.CSSProperties;
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
  papersOpen,
  onTogglePapers,
  style,
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
  // select-and-move live preview (declared early: overlay effect reads it)
  const [preview, setPreview] = useState<Op[] | null>(null);
  const shownOps = preview ?? ops;

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
      for (const op of shownOps) if (op.page === page) drawOp(ctx, op, W, H);
    });
  }, [shownOps, zoom, pageCount, drawOp]);

  const norm = (e: { clientX: number; clientY: number }, el: HTMLElement): [number, number] => {
    const r = el.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  /* ---- pointer drawing on the overlay of a page ---- */
  const drag = useRef<null | { mode: "draw" | "line" | "erase"; pts: [number, number][]; start: [number, number]; page: number }>(null);
  // select-and-move: index of the op being dragged + drag origin + latest translated array
  const moveRef = useRef<null | { page: number; start: [number, number]; index: number; last: [number, number]; next?: Op[] }>(null);

  const hitTest = (p: [number, number], page: number): number => {
    for (let i = ops.length - 1; i >= 0; i--) {
      const op = ops[i];
      if (op.page !== page) continue;
      if (op.kind === "text") {
        if (Math.hypot(op.x - p[0], op.y - p[1]) < 0.08) return i;
      } else if (op.kind === "stroke") {
        if (op.pts.some(([x, y]) => Math.hypot(x - p[0], y - p[1]) < 0.014)) return i;
      } else if (op.kind === "line") {
        const [x1, y1] = op.a;
        const [x2, y2] = op.b;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const t = Math.max(0, Math.min(1, ((p[0] - x1) * dx + (p[1] - y1) * dy) / (dx * dx + dy * dy || 1e-9)));
        if (Math.hypot(x1 + t * dx - p[0], y1 + t * dy - p[1]) < 0.014) return i;
      } else if (op.kind === "arc") {
        const d = Math.hypot(op.c[0] - p[0], op.c[1] - p[1]);
        const r = Math.hypot(op.rx, op.ry) / 2;
        if (d < r + 0.02 && d > Math.max(0.005, r - 0.045)) return i;
      }
    }
    return -1;
  };

  const translateOp = (op: Op, dx: number, dy: number): Op => {
    if (op.kind === "stroke") return { ...op, pts: op.pts.map(([x, y]) => [Math.min(1, Math.max(0, x + dx)), Math.min(1, Math.max(0, y + dy))] as [number, number]) };
    if (op.kind === "line") return { ...op, a: [op.a[0] + dx, op.a[1] + dy], b: [op.b[0] + dx, op.b[1] + dy] };
    if (op.kind === "arc") return { ...op, c: [op.c[0] + dx, op.c[1] + dy] };
    return { ...op, x: Math.min(1, Math.max(0, op.x + dx)), y: Math.min(1, Math.max(0, op.y + dy)) };
  };

  const onPagePointerDown = (page: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (editing) return;
    const overlay = e.currentTarget;
    try {
      overlay.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events may not support capture */
    }
    const p = norm(e, overlay);
    if (tool === "browse") return;
    if (tool === "select") {
      const i = hitTest(p, page);
      if (i >= 0) moveRef.current = { page, start: p, index: i, last: p };
      return;
    }
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
    // live drag of a selected annotation
    const mv = moveRef.current;
    if (mv && mv.page === page && mv.index >= 0 && mv.index < ops.length) {
      const overlay = e.currentTarget;
      const p = norm(e, overlay);
      const dx = p[0] - mv.last[0];
      const dy = p[1] - mv.last[1];
      mv.last = p;
      const base = mv.next ?? ops;
      const next = base.map((op, i) => (i === mv.index ? translateOp(op, dx, dy) : op));
      mv.next = next;
      setPreview(next);
      return;
    }
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
          ctx.lineWidth = THICKNESS[thick].pen * (zoom * 2);
          ctx.globalAlpha = 1;
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
    // finish select-drag
    const mv = moveRef.current;
    if (mv && mv.page === page) {
      moveRef.current = null;
      if (mv.next) onOps(mv.next);
      setPreview(null);
      return;
    }
    const d = drag.current;
      if (d && d.page === page) {
        drag.current = null;
        if (d.mode === "draw" && d.pts.length > 1) {
          onOps([
            ...ops,
            {
              page,
              kind: "stroke",
              tool: "pen",
              color,
              width: THICKNESS[thick].pen,
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
    tool === "browse" || tool === "select" ? "cursor-default" : tool === "eraser" ? "cursor-cell" : tool === "text" || tool === "math" ? "cursor-text" : "cursor-crosshair";

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-zinc-100/80" style={style} aria-label={`${label}: ${paperDocLabel(doc)}`}>
      {/* pane header */}
      <div className="relative flex items-center gap-2 border-b border-line bg-panel px-3 py-1.5">
        <button
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-haspopup="listbox"
          aria-label={label}
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
          <button
            onClick={onTogglePapers}
            aria-label={papersOpen ? "Hide papers" : "Show papers"}
            aria-expanded={papersOpen}
            title={papersOpen ? "Hide papers" : "Show papers"}
            className="grid size-8 place-items-center rounded-full bg-ink text-paper hover:opacity-85"
          >
            <Icon d={I.arrowSplit} className="size-4" />
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download ${paperDocLabel(doc).toLowerCase()}`}
              title={`Download ${paperDocLabel(doc).toLowerCase()}`}
              className="hidden rounded-full p-1.5 text-muted hover:bg-paper-2 hover:text-ink sm:block"
            >
              <Icon d={I.download} className="size-4" />
            </a>
          )}
          <button
            onClick={onClose}
            aria-label={`Close ${label === "Left pane" ? "left" : "right"} split pane`}
            className="rounded-full p-1.5 text-muted hover:bg-paper-2 hover:text-ink"
          >
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
              role="region"
              aria-label={`Page ${page + 1}`}
              className={`relative mx-auto mb-5 w-fit rounded-sm bg-white shadow-[0_2px_14px_rgba(0,0,0,0.14)] ${cursorClass}`}
              onPointerDown={onPagePointerDown(page)}
              onPointerMove={onPagePointerMove(page)}
              onPointerUp={onPagePointerUp(page)}
            >
              <PageView url={url!} pageNo={page} zoom={zoom} />

              {/* text-tool hint popover, like the original's "Put your answer down" */}
              {tool === "text" && !editing && page === 0 && (
                <div className="pointer-events-none absolute left-1/2 top-[4%] z-30 w-72 -translate-y-2 rounded-2xl bg-white p-4 text-left shadow-2xl" role="status">
                  <p className="text-[15px] font-semibold text-ink">Put your answer down</p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">Click anywhere in the box and type your working. It saves as you go.</p>
                  <span className="absolute -bottom-2.5 left-10 size-0 border-x-8 border-t-[10px] border-x-transparent border-t-white" aria-hidden />
                </div>
              )}

              {/* text boxes */}
              {shownOps.map((op, i) =>
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

      {/* zoom rail — pinned to the pane's top-right edge like the original */}
      <div className="absolute right-2 top-14 z-30 flex flex-col items-center gap-1">
        <button
          onClick={() => onZoom(Math.max(0.5, +(zoom - 0.15).toFixed(2)))}
          aria-label="Zoom out"
          title="Zoom out"
          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-paper-2 hover:text-ink"
        >
          <Icon d={I.zoomOut} className="size-5" />
        </button>
        <button
          onClick={() => onZoom(Math.min(3, +(zoom + 0.15).toFixed(2)))}
          aria-label="Zoom in"
          title="Zoom in"
          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-paper-2 hover:text-ink"
        >
          <Icon d={I.zoomIn} className="size-5" />
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

/* ------------------------------ papers sidebar ----------------------------- */

function PapersGroup({
  series,
  currentSlug,
  onNavigate,
}: {
  series: PaperSeries;
  currentSlug: string;
  onNavigate: () => void;
}) {
  const contains = series.papers.some((p) => p.slug === currentSlug);
  // null = not toggled by the user yet → follow the current slug
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? contains;
  return (
    <div className="mb-1">
      <button
        onClick={() => setManual(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[15px] font-medium hover:bg-paper-2"
      >
        <span className="min-w-0 truncate">{series.series}</span>
        <Icon d={I.chevDown} className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mb-1 ml-1 space-y-0.5">
          {series.papers.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/paper/edexcel/${p.slug}`}
                onClick={onNavigate}
                aria-current={p.slug === currentSlug ? "page" : undefined}
                className={`block truncate rounded-lg px-3 py-1.5 text-sm ${
                  p.slug === currentSlug ? "bg-cyan-100 font-semibold text-cyan-900" : "text-ink/80 hover:bg-paper-2"
                }`}
              >
                {p.paperLabel ?? p.title}
                {p.tier ? <span className="text-muted"> · {p.tier}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------- workspace -------------------------------- */

export default function PaperWorkspace({ slug }: { slug: string }) {
  const paper = useMemo(() => paperBySlug(slug), [slug]);
  const [leftDoc, setLeftDoc] = useState<PaneDoc>("question");
  const [zooms, setZooms] = useState<Record<string, number>>({ question: 1, markscheme: 1, formula: 1 });
  const [tool, setTool] = useState<Tool>("text");
  const [color, setColor] = useState<string>(COLORS[0].hex);
  const [thick, setThick] = useState(1);
  const [widget, setWidget] = useState<Widget>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [more, setMore] = useState(false);
  const [calc, setCalc] = useState(false);
  const [papersOpen, setPapersOpen] = useState(false);
  const [leftPct, setLeftPct] = useState(50);
  const [printPop, setPrintPop] = useState(false);
  const [colourPop, setColourPop] = useState(false);
  const [thickPop, setThickPop] = useState(false);
  // popovers render fixed above the toolbar (the toolbar scrolls, which would clip absolute children)
  const [popAnchor, setPopAnchor] = useState<{ x: number; y: number } | null>(null);
  const anchorFrom = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top };
  };
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
        setPrintPop(false);
        setColourPop(false);
        setThickPop(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoDoc(leftDoc);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leftDoc, undoDoc]);

  // draggable split divider (a slider like the original's)
  const panesRef = useRef<HTMLDivElement | null>(null);
  const dividerDrag = useRef(false);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dividerDrag.current || !panesRef.current) return;
      const r = panesRef.current.getBoundingClientRect();
      const pct = Math.round(Math.min(75, Math.max(25, ((e.clientX - r.left) / r.width) * 100)));
      setLeftPct(pct);
    };
    const up = () => {
      dividerDrag.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

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
    <div className="flex min-h-screen bg-zinc-100/80">
      {/* persistent site rail, like the original viewer */}
      <aside className="sticky top-0 z-40 hidden h-screen w-14 shrink-0 flex-col items-center gap-0.5 border-r border-line bg-panel py-3 sm:flex" aria-label="Site navigation">
        <button aria-label="Show menu" title="Show menu" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.panelToggle} className="size-5" />
        </button>
        <button aria-label="Expand menu" title="Expand menu" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.arrowSplit} className="size-5" />
        </button>
        <Link href="/" aria-label="Home" title="Home" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.home} className="size-5" />
        </Link>
        <Link href="/your-plan" aria-label="Revision planner" title="Revision planner" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.book} className="size-5" />
        </Link>
        <span className="my-1 grid size-8 place-items-center rounded-full bg-emerald-500 text-white shadow" aria-hidden>
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <path d="M12 3c3.2 0 5.5 2.2 5.5 5.3 0 1.9-.8 3.2-1.9 4.1-.7.6-1 1.3-1 2.2v1.2H9.4v-1.2c0-.9-.3-1.6-1-2.2-1.1-.9-1.9-2.2-1.9-4.1C6.5 5.2 8.8 3 12 3z" />
          </svg>
        </span>
        <Link href="/gcse/maths/edexcel/papers" aria-label="Past papers" title="Past papers" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.print} className="size-5" />
        </Link>
        <button aria-label="Recent" title="Recent" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.clock} className="size-5" />
        </button>
        <Link href="/ask-genie" aria-label="Ask Genie AI" title="Ask Genie AI" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.chat} className="size-5" />
        </Link>
        <Link href="/feature-requests" aria-label="Ideas + feedback" title="Ideas + feedback" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.bulb} className="size-5" />
        </Link>
        <button aria-label="Other" title="Other" className="mt-auto grid size-9 place-items-center rounded-full border border-line text-muted hover:bg-paper-2 hover:text-ink">
          <Icon d={I.more} className="size-5" />
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
      {/* top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-1 border-b border-line bg-panel px-3 sm:px-4">
        <Link href={backHref} aria-label="Back to past papers" className="rounded-full p-2 hover:bg-paper-2">
          <Icon d={I.back} />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setRightDoc((d) => (d ? null : "markscheme"))}
            className="flex items-center gap-2 rounded-full bg-[#35b3c9] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#2aa2b7]"
            aria-pressed={!!rightDoc}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16M4 10h16M4 15h10M4 20h10" /></svg>
            {rightDoc ? "Hide mark scheme" : "View mark scheme"}
          </button>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" aria-label="Download" className="rounded-full p-2 hover:bg-paper-2">
            <Icon d={I.download} />
          </a>
          <div className="relative">
            <button onClick={() => setPrintPop((v) => !v)} aria-expanded={printPop} aria-haspopup="dialog" aria-label="Print" className="rounded-full p-2 hover:bg-paper-2">
              <Icon d={I.print} />
            </button>
            {printPop && (
              <div role="dialog" aria-label="Print" className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-line bg-panel p-4 shadow-2xl">
                <button
                  onClick={() => window.print()}
                  className="w-full rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
                >
                  Print now
                </button>
                <h5 className="mt-4 text-[13px] font-bold">Send it to someone to print</h5>
                <input
                  aria-label="Their email"
                  placeholder="Their email"
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <button
                  disabled
                  aria-label="Send"
                  className="mt-2 w-full cursor-not-allowed rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted"
                >
                  Send
                </button>
                <p className="mt-2 text-[11px] leading-snug text-muted">Email delivery isn&apos;t wired up in this recreation.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setMarkDlg(true)}
            aria-label={`Log your mark for ${paper.title}`}
            title={`Log your mark for ${paper.title}`}
            className="rounded-full p-2 hover:bg-paper-2"
          >
            <Icon d={I.flag} />
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
          {saved && (
            <span className="ml-1 hidden rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold sm:block">
              {saved.doneOnly ? "Marked done" : `Your mark: ${saved.mark}/${saved.outOf}`}
            </span>
          )}
        </div>
      </header>

      {/* panes */}
      <div ref={panesRef} className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        {papersOpen && (
          <aside className="absolute inset-y-0 left-0 z-30 flex w-72 flex-col overflow-y-auto border-r border-line bg-panel lg:relative lg:z-auto" aria-label="Papers">
            <div className="px-4 pb-1 pt-3">
              <h2 className="text-xl font-bold">Papers</h2>
            </div>
            <nav className="flex-1 px-2 pb-4">
              {papersPast.series.map((s) => (
                <PapersGroup key={s.series} series={s} currentSlug={slug} onNavigate={() => setPapersOpen(false)} />
              ))}
            </nav>
          </aside>
        )}
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
          papersOpen={papersOpen}
          onTogglePapers={() => setPapersOpen((v) => !v)}
          style={{ flexBasis: 0, flexGrow: leftPct }}
        />
        {rightDoc && (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize panes"
              aria-valuenow={leftPct}
              aria-valuemin={25}
              aria-valuemax={75}
              tabIndex={0}
              onPointerDown={(e) => {
                e.preventDefault();
                dividerDrag.current = true;
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setLeftPct((p) => Math.max(25, p - 2));
                if (e.key === "ArrowRight") setLeftPct((p) => Math.min(75, p + 2));
              }}
              className="group hidden w-1.5 shrink-0 cursor-col-resize items-center justify-center bg-line/60 lg:flex"
            >
              <span className="h-10 w-1 rounded-full bg-muted/50 group-hover:bg-accent" />
            </div>
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
              papersOpen={papersOpen}
              onTogglePapers={() => setPapersOpen((v) => !v)}
              style={{ flexBasis: 0, flexGrow: 100 - leftPct }}
            />
          </>
        )}
      </div>

      {/* annotation toolbar */}
      {!collapsed && !papersOpen && (
        <div className="sticky bottom-3 z-40 mx-auto mb-3 flex max-w-[94vw] items-center gap-0.5 overflow-x-auto rounded-2xl border border-line bg-panel px-2 py-1.5 shadow-2xl" role="toolbar" aria-label="Annotation tools">
          <TBtn label="Undo" onClick={() => undoDoc(leftDoc)} icon={I.undo} disabled={!(depths[leftDoc]?.u ?? 0)} />
          <TBtn label="Redo" onClick={() => redoDoc(leftDoc)} icon={I.redo} disabled={!(depths[leftDoc]?.r ?? 0)} />
          <TBtn label="Clear all" icon={I.trash} danger disabled={!opsFor(leftDoc).length} onClick={() => commitOps(leftDoc, [])} />
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <TBtn label="Browse" icon={I.cursor} active={tool === "browse"} onClick={() => { setTool("browse"); setWidget(null); }} />
          <TBtn label="Select" icon={I.selectBox} active={tool === "select"} onClick={() => setTool("select")} />
          <TBtn label="Text" icon={I.type} active={tool === "text"} onClick={() => setTool("text")} />
          <TBtn label="Math text box" icon={I.sqrt} active={tool === "math"} onClick={() => setTool("math")} />
          <TBtn label="Draw" icon={I.pen} active={tool === "pen"} onClick={() => setTool("pen")} />
          <TBtn label="Erase" icon={I.marker} active={tool === "eraser"} onClick={() => setTool("eraser")} />
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <div className="relative shrink-0">
            <button
              onClick={(e) => { setPopAnchor(anchorFrom(e)); setColourPop((v) => !v); setThickPop(false); }}
              aria-expanded={colourPop}
              aria-haspopup="menu"
              aria-label={`Pen colour: ${colorName(color)}`}
              title={`Pen colour: ${colorName(color)}`}
              className={`grid size-9 place-items-center rounded-xl hover:bg-paper-2 ${colourPop ? "bg-paper-2" : ""}`}
            >
              <span className="size-4 rounded-full border border-black/20" style={{ background: color }} />
            </button>
            {colourPop && popAnchor && (
              <div
                role="menu"
                aria-label="Pen colour"
                style={{ position: "fixed", left: popAnchor.x, top: popAnchor.y - 8, transform: "translate(-50%, -100%)" }}
                className="z-[70] grid grid-cols-3 gap-2 rounded-2xl border border-line bg-panel p-3 shadow-2xl"
              >
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    role="menuitemradio"
                    aria-checked={color === c.hex}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => { setColor(c.hex); setColourPop(false); if (tool === "select") setTool("pen"); }}
                    className={`size-7 rounded-full border-2 ${color === c.hex ? "border-ink ring-2 ring-ink/25" : "border-black/10 hover:scale-110"}`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="relative shrink-0">
            <button
              onClick={(e) => { setPopAnchor(anchorFrom(e)); setThickPop((v) => !v); setColourPop(false); }}
              aria-expanded={thickPop}
              aria-haspopup="menu"
              aria-label={`Pen thickness: ${THICKNESS[thick].label}`}
              title={`Pen thickness: ${THICKNESS[thick].label}`}
              className={`grid size-9 place-items-center rounded-xl hover:bg-paper-2 ${thickPop ? "bg-paper-2" : ""}`}
            >
              <span className="rounded-full bg-current" style={{ width: 4 + thick * 3, height: 4 + thick * 3 }} />
            </button>
            {thickPop && popAnchor && (
              <div
                role="menu"
                aria-label="Pen thickness"
                style={{ position: "fixed", left: popAnchor.x, top: popAnchor.y - 8, transform: "translate(-50%, -100%)" }}
                className="z-[70] flex items-center gap-2 rounded-2xl border border-line bg-panel p-3 shadow-2xl"
              >
                {THICKNESS.map((t, i) => (
                  <button
                    key={t.label}
                    role="menuitemradio"
                    aria-checked={thick === i}
                    aria-label={t.label}
                    title={t.label}
                    onClick={() => { setThick(i); setThickPop(false); if (tool === "select") setTool("pen"); }}
                    className={`grid size-8 place-items-center rounded-lg ${thick === i ? "bg-paper-2 ring-2 ring-ink/25" : "hover:bg-paper-2"}`}
                  >
                    <span className="rounded-full bg-current" style={{ width: 4 + i * 3, height: 4 + i * 3 }} />
                  </button>
                ))}
              </div>
            )}
          </div>
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
          <button onClick={() => setCollapsed(true)} aria-label="Collapse toolbar" title="Hide tools" className="grid size-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-paper-2 hover:text-ink">
            <Icon d={I.close} className="size-4.5" />
          </button>
        </div>
      )}
      {collapsed && !papersOpen && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand toolbar"
          title="Show tools"
          className="fixed bottom-5 left-1/2 z-40 grid size-14 -translate-x-1/2 place-items-center rounded-2xl border border-line bg-panel text-ink shadow-2xl hover:bg-paper-2"
        >
          <Icon d={I.penHandle} />
        </button>
      )}

      {/* ask genie float */}
      <Link
        href="/ask-genie"
        aria-label="Open Ask Genie"
        className="fixed bottom-5 right-4 z-40 grid size-11 place-items-center rounded-[10px] bg-zinc-800 text-emerald-400 shadow-xl transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
          <path d="M12 2.5c3.6 0 6.2 2.5 6.2 5.9 0 2.1-.9 3.6-2.1 4.6-.8.7-1.1 1.5-1.1 2.6v1.9H9v-1.9c0-1.1-.3-1.9-1.1-2.6-1.2-1-2.1-2.5-2.1-4.6 0-3.4 2.6-5.9 6.2-5.9z" />
          <circle cx="9.6" cy="8.6" r="1" fill="#0f172a" />
          <circle cx="14.4" cy="8.6" r="1" fill="#0f172a" />
          <path d="M9 19.5h6M10 22h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Link>

      {calc && <Calculator onClose={() => setCalc(false)} />}

      {markDlg && <MarkDialog paper={paper} saved={saved ?? null} onDone={(m) => { if (m) saveMark(slug, m); else saveMark(slug, null); setMarks(loadMarks()); setMarkDlg(false); }} />}
      </div>
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
