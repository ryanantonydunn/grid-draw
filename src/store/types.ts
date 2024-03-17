export type Position = [number, number];

export const colorHues = ["red", "green", "blue", "gray"] as const;

export type ColorHue = (typeof colorHues)[number];

export interface CanvasOptions {
  gridBg: string;
  gridFg: string;
  gridSize: number;
  hoverCircleSize: number;
  hoverCircleColor: ColorHue;
  selectedCircleSize: number;
  selectedCircleColor: ColorHue;
}

export interface LineOptions {
  color: ColorHue;
  width: number;
  opacity: number;
}

export interface Line {
  start: Position;
  end: Position;
  width: number;
  opacity: number;
  color: ColorHue;
}

export enum ActionTypes {
  CREATE_LINE = "CREATE_LINE",
}

export interface ActionCreateLine {
  type: ActionTypes.CREATE_LINE;
  line: Line;
}

export type Action = ActionCreateLine;

export interface Image {
  id: string;
  lines: Line[];
  history: Action[];
}

export interface Store {
  currentImage: string;
  images: Image[];
  options: CanvasOptions;
}
