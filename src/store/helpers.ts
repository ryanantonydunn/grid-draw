import { AppState, Image, Line, Position } from "./types";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a new line object using the options and active positions in the current app state
 */
export function getNewLine(state: AppState, position: Position): Line | null {
  const image = getCurrentImage(state);
  if (!image || !image.activePosition) return null;
  return {
    ...state.lineOptions,
    start: image.activePosition,
    end: position,
  };
}

/**
 * Return current image from the app state
 */
export function getCurrentImage(state: AppState): Image | null {
  return state.images.find((img) => img.id === state.currentImage) || null;
}

/**
 * Get the raw position of a mouse event relartive to the element
 */
export function getXyFromEvent(e: React.MouseEvent): Position {
  const rect = e.currentTarget?.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return [x, y];
}

/**
 * Are two positions the same
 */
export function isPositionSame(p1: Position, p2: Position): boolean {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

/**
 * Create new image
 */
export function createNewImage(id?: string): Image {
  return {
    id: id || uuidv4(),
    name: "New Image",
    lines: [],
    activePosition: null,
  };
}
