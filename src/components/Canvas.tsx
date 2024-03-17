import React from "react";
import colors from "tailwindcss/colors";
import { CanvasOptions, ColorHue, Line, LineOptions, Position, colorHues } from "../store/types";

const options: CanvasOptions = {
  gridBg: colors.slate["100"],
  gridFg: colors.slate["200"],
  gridSize: 12,
  hoverCircleSize: 8,
  hoverCircleColor: "blue",
  selectedCircleSize: 8,
  selectedCircleColor: "green",
};

export function Canvas() {
  const [lineOptions, setLineOptions] = React.useState<LineOptions>({
    width: 2,
    color: "gray",
    opacity: 0.5,
  });

  const [lines, setLines] = React.useState<Line[]>([]);
  const [hoverPosition, setHoverPosition] = React.useState<Position | null>(null);
  const [selectedPosition, setSelectedPosition] = React.useState<Position | null>(null);

  function createLine(start: Position, end: Position) {
    setLines((l) => [...l, { start, end, ...lineOptions }]);
  }

  React.useEffect(() => {
    document.body.onkeydown = (e) => {
      if (e.key === "Escape") {
        setSelectedPosition(null);
      }
    };
  }, []);

  return (
    <>
      <div
        className="h-screen"
        style={{
          backgroundColor: options.gridBg,
          backgroundImage: `linear-gradient(to right,${options.gridFg} 0,${options.gridFg} 1px,transparent 1px,transparent 100%),linear-gradient(to bottom,${options.gridFg} 0,${options.gridFg} 1px,transparent 1px,transparent 100%)`,
          backgroundSize: `${options.gridSize}px ${options.gridSize}px`,
          backgroundPosition: "-1px -1px",
        }}
        onMouseMove={(e) => {
          setHoverPosition(getPositionFromXy(getXyFromEvent(e)));
        }}
        onMouseLeave={() => {
          setHoverPosition(null);
        }}
        onMouseDown={(e) => {
          const newPosition = getPositionFromXy(getXyFromEvent(e));
          if (selectedPosition) {
            if (!isPositionSame(selectedPosition, newPosition)) {
              createLine(selectedPosition, newPosition);
            }
            setSelectedPosition(null);
          } else {
            setSelectedPosition(newPosition);
          }
        }}
      >
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {lines.map((line, i) => (
            <DrawLine key={i} {...line} />
          ))}
          <DrawLine start={selectedPosition} end={hoverPosition} {...lineOptions} />
          <DrawCircle
            position={selectedPosition}
            color={options.selectedCircleColor}
            size={options.selectedCircleSize}
          />
          <DrawCircle position={hoverPosition} color={options.hoverCircleColor} size={options.hoverCircleSize} />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-1 bg-slate-800 text-slate-100 flex items-center">
        <div className="pr-2">
          <label className="text-xs block">Color</label>
          <select
            className="bg-slate-700"
            onChange={(e) => setLineOptions((c) => ({ ...c, color: e.target.value as ColorHue }))}
            value={lineOptions.color}
          >
            {colorHues.map((hue) => (
              <option key={hue} value={hue}>
                {hue}
              </option>
            ))}
          </select>
        </div>
        <div className="pr-2">
          <label className="text-xs block">Width</label>
          <select
            className="bg-slate-700 w-14"
            onChange={(e) => setLineOptions((c) => ({ ...c, width: Number(e.target.value) }))}
            value={lineOptions.width}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="pr-2">
          <label className="text-xs block">Opacity</label>
          <select
            className="bg-slate-700 w-14"
            onChange={(e) => setLineOptions((c) => ({ ...c, opacity: Number(e.target.value) }))}
            value={lineOptions.opacity}
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const n = Math.round(i) * 0.1 + 0.1;
              return (
                <option key={n} value={n}>
                  {Math.round(n * 100)}%
                </option>
              );
            })}
          </select>
        </div>
        <div className="ml-auto">
          {selectedPosition && hoverPosition && (
            <span>
              {hoverPosition[0] - selectedPosition[0]} / {hoverPosition[1] - selectedPosition[1]}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

interface DrawCircleProps {
  position: Position | null;
  color: ColorHue;
  size: number;
}

export function DrawCircle({ position, color, size }: DrawCircleProps) {
  if (!position) return null;
  const [x, y] = getXyFromPosition(position);
  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      stroke={colors[color]["700"]}
      fill={colors[color]["300"]}
      opacity="0.5"
      strokeWidth="2"
    />
  );
}

interface DrawLineProps {
  start: Position | null;
  end: Position | null;
  color: ColorHue;
  width: number;
  opacity: number;
}

export function DrawLine({ start, end, color, width, opacity }: DrawLineProps) {
  if (!start || !end) return null;
  const [x1, y1] = getXyFromPosition(start);
  const [x2, y2] = getXyFromPosition(end);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} opacity={opacity} strokeWidth={width} />;
}

/**
 * Maths functions
 */

function getXyFromEvent(e: React.MouseEvent): Position {
  const rect = e.currentTarget?.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return [x, y];
}

function getPositionFromXy(xy: Position): Position {
  const calc = (n: number) => Math.ceil((n - options.gridSize / 2) / options.gridSize);
  return [calc(xy[0]), calc(xy[1])];
}

function getXyFromPosition(position: Position): Position {
  const calc = (n: number) => n * options.gridSize;
  return [calc(position[0]), calc(position[1])];
}

function isPositionSame(p1: Position, p2: Position): boolean {
  return p1[0] === p2[0] && p1[1] === p2[1];
}
