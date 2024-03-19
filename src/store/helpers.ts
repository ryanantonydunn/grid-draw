import { AppState, Image, ImageState, Line, NAME_LIMIT, Position } from "./types";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a new line object using the options and active positions in the current app state
 */
export function getNewLine(state: AppState, position: Position): Line | null {
  const image = getCurrentImage(state);
  if (!image || !image.state.present.activePosition) return null;
  return {
    ...state.lineOptions,
    start: image.state.present.activePosition,
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
 * Copy current image state snapshot to past
 * (Directly mutates state arg as used in redux immer context)
 */
const UNDO_LIMIT = 200;

export function snapshotImageStateForUndo(state: AppState): void {
  const image = getCurrentImage(state);
  if (!image) return;
  const present = duplicateImageState(image.state.present);
  image.state.past = [...image.state.past, present].slice(-UNDO_LIMIT);
  image.state.future = [];
}

/**
 * Get full copy of current image present state
 */
export function duplicateImageState(state: ImageState): ImageState {
  return {
    lines: state.lines.map((l) => ({ ...l })),
    activePosition: state.activePosition,
  };
}

/**
 * Get duplicate of current image
 */
export function getImageDuplicate(state: AppState): Image | null {
  const image = getCurrentImage(state);
  if (!image) return null;
  const id = uuidv4();
  return {
    id,
    name: `${image.name.slice(0, NAME_LIMIT - 7)} (Copy)`,
    state: {
      past: image.state.past.map(duplicateImageState),
      present: duplicateImageState(image.state.present),
      future: image.state.future.map(duplicateImageState),
    },
  };
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
    state: {
      past: [],
      present: {
        lines: [],
        activePosition: null,
      },
      future: [],
    },
  };
}
