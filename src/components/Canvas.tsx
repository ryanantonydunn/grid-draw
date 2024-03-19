import React from "react";
import colors from "tailwindcss/colors";
import { getXyFromEvent } from "../store/helpers";
import {
  useCanvasOptions,
  useClearActivePosition,
  useClickPosition,
  useCurrentImage,
  useGetPositionFromXy,
  useGetXyFromPosition,
  useLineOptions,
} from "../store/hooks";
import { ColorHue, Position } from "../store/types";

export function Canvas() {
  const lineOptions = useLineOptions();
  const canvasOptions = useCanvasOptions();
  const image = useCurrentImage();
  const clickPosition = useClickPosition();
  const getPositionFromXy = useGetPositionFromXy();
  const clearActivePosition = useClearActivePosition();

  const [hoverPosition, setHoverPosition] = React.useState<Position | null>(null);

  if (!image) return null;

  const { lines, activePosition } = image.state.present;

  const offset =
    hoverPosition && activePosition
      ? {
          x: hoverPosition[0] - activePosition[0],
          y: hoverPosition[1] - activePosition[1],
        }
      : null;

  return (
    <>
      <div
        className="h-screen"
        style={{
          backgroundColor: canvasOptions.gridBg,
          backgroundImage: `linear-gradient(to right,${canvasOptions.gridFg} 0,${canvasOptions.gridFg} 1px,transparent 1px,transparent 100%),linear-gradient(to bottom,${canvasOptions.gridFg} 0,${canvasOptions.gridFg} 1px,transparent 1px,transparent 100%)`,
          backgroundSize: `${canvasOptions.gridSize}px ${canvasOptions.gridSize}px`,
          backgroundPosition: "-1px -1px",
        }}
        onMouseMove={(e) => {
          setHoverPosition(getPositionFromXy(getXyFromEvent(e)));
        }}
        onMouseLeave={() => {
          setHoverPosition(null);
        }}
        onMouseDown={(e) => {
          if (e.button === 2) {
            clearActivePosition();
          } else {
            clickPosition(getPositionFromXy(getXyFromEvent(e)));
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {lines.map((line, i) => (
            <DrawLine key={i} {...line} />
          ))}
          <DrawLine start={activePosition} end={hoverPosition} {...lineOptions} />
          <DrawCircle
            position={activePosition}
            color={canvasOptions.selectedCircleColor}
            size={canvasOptions.selectedCircleSize}
          />
          <DrawCircle
            position={hoverPosition}
            color={canvasOptions.hoverCircleColor}
            size={canvasOptions.hoverCircleSize}
          />
        </svg>
      </div>
      <div className="flex absolute top-0 left-0 text-xs text-white bg-slate-900 bg-opacity-70">
        <div className="w-10 p-2">{hoverPosition?.[0] || "0"}</div>
        <div className="w-10 p-2">{hoverPosition?.[1] || "0"}</div>
        {offset && (
          <>
            <div className="w-px self-stretch bg-white bg-opacity-30"></div>
            <div className="w-11 p-2">
              {offset.x > 0 && "+"}
              {offset.x}
            </div>
            <div className="w-11 p-2">
              {offset.y > 0 && "+"}
              {offset.y}
            </div>
          </>
        )}
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
  const getXyFromPosition = useGetXyFromPosition();
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
  const getXyFromPosition = useGetXyFromPosition();
  if (!start || !end) return null;
  const [x1, y1] = getXyFromPosition(start);
  const [x2, y2] = getXyFromPosition(end);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[color]["500"]} opacity={opacity} strokeWidth={width} />;
}
