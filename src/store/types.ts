export type Position = [number, number];

export const colorHues = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
  "pink",
] as const;

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

export interface ImageState {
  activePosition: Position | null;
  lines: Line[];
}

export interface Image {
  id: string;
  name: string;
  state: {
    past: ImageState[];
    present: ImageState;
    future: ImageState[];
  };
}

export interface LineEditor {
  isOpen: boolean;
  activeIndex: number;
  activeAttributeEdit: keyof Line | null;
}

export interface AppState {
  currentImage: string;
  images: Image[];
  canvasOptions: CanvasOptions;
  lineOptions: LineOptions;
  lineEditor: LineEditor;
}

export const NAME_LIMIT = 30;
