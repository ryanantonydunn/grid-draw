import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import colors from "tailwindcss/colors";
import { createNewImage, getCurrentImage, getImageDuplicate, getNewLine, snapshotImageStateForUndo } from "./helpers";
import { AppState, CanvasOptions, Line, LineEditor, LineOptions, NAME_LIMIT, Position } from "./types";

const initialState: AppState = {
  currentImage: "0",
  images: [createNewImage("0")],
  canvasOptions: {
    gridBg: colors.slate["100"],
    gridFg: colors.slate["200"],
    gridSize: 12,
    hoverCircleSize: 8,
    hoverCircleColor: "blue",
    selectedCircleSize: 8,
    selectedCircleColor: "green",
  },
  lineOptions: {
    width: 1,
    color: "gray",
    opacity: 0.3,
  },
  lineEditor: {
    isOpen: false,
    activeIndex: -1,
    activeAttributeEdit: null,
    activeHover: "start",
  },
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setCurrentImage: (state, action: PayloadAction<string>) => {
      state.currentImage = action.payload;
    },
    setImageName: (state, action: PayloadAction<string>) => {
      const image = getCurrentImage(state);
      if (!image) return;
      image.name = action.payload.slice(0, NAME_LIMIT);
    },
    addNewImage: (state) => {
      const newImage = createNewImage();
      state.images.push(newImage);
      state.currentImage = newImage.id;
    },
    deleteImage: (state) => {
      const i = state.images.findIndex((img) => img.id === state.currentImage);
      state.images.splice(i, 1);
      state.currentImage = state.images[0]?.id || "";
    },
    duplicateImage: (state) => {
      const dupe = getImageDuplicate(state);
      if (!dupe) return;
      state.images.push(dupe);
      state.currentImage = dupe.id;
    },
    setCanvasOption: (state, action: PayloadAction<Partial<CanvasOptions>>) => {
      state.canvasOptions = { ...state.canvasOptions, ...action.payload };
    },
    setLineOption: (state, action: PayloadAction<Partial<LineOptions>>) => {
      state.lineOptions = { ...state.lineOptions, ...action.payload };
    },
    clearActivePosition: (state) => {
      const image = getCurrentImage(state);
      if (!image || image.state.present.activePosition === null) return;
      snapshotImageStateForUndo(state);
      image.state.present.activePosition = null;
    },
    clickPosition: (state, action: PayloadAction<Position>) => {
      const image = getCurrentImage(state);
      if (!image) return;
      snapshotImageStateForUndo(state);

      // if we are editing a lines position
      const editingLine = image.state.present.lines[state.lineEditor.activeIndex];
      if (state.lineEditor.activeAttributeEdit === "start" && editingLine) {
        editingLine.start = action.payload;
        state.lineEditor.activeAttributeEdit = null;
        state.lineEditor.activeIndex = -1;
        return;
      }
      if (state.lineEditor.activeAttributeEdit === "end" && editingLine) {
        editingLine.end = action.payload;
        state.lineEditor.activeAttributeEdit = null;
        state.lineEditor.activeIndex = -1;
        return;
      }

      // if there is a new line to create
      const newLine = getNewLine(state, action.payload);
      if (newLine && image) {
        image.state.present.lines.push(newLine);
        image.state.present.activePosition = action.payload;
      } else {
        // if there is no new line, set the active position or clear it if is same
        if (action.payload === image.state.present.activePosition) {
          image.state.present.activePosition = null;
        } else {
          image.state.present.activePosition = action.payload;
        }
      }
    },
    undo: (state) => {
      const image = getCurrentImage(state);
      if (!image || !image.state.past.length) return;

      // move present to future
      image.state.future.unshift(image.state.present);

      // move previous past to present
      image.state.present = image.state.past.splice(-1, 1)[0];
    },
    redo: (state) => {
      const image = getCurrentImage(state);
      if (!image || !image.state.future.length) return;

      // move present to past
      image.state.past.push(image.state.present);

      // move previous future to present
      image.state.present = image.state.future.splice(0, 1)[0];
    },
    setLineEditor: (state, action: PayloadAction<Partial<LineEditor>>) => {
      const image = getCurrentImage(state);
      if (!image) return;
      if (action.payload.activeAttributeEdit) {
        snapshotImageStateForUndo(state);
        image.state.present.activePosition = null;
      }
      state.lineEditor = { ...state.lineEditor, ...action.payload };
    },
    deleteLine: (state, action: PayloadAction<number>) => {
      const image = getCurrentImage(state);
      if (!image) return;

      snapshotImageStateForUndo(state);
      image.state.present.lines.splice(action.payload, 1);
    },
    moveLine: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const image = getCurrentImage(state);
      if (!image) return;

      snapshotImageStateForUndo(state);
      const { oldIndex, newIndex } = action.payload;
      const { lines } = image.state.present;
      lines.splice(newIndex, 0, lines.splice(oldIndex, 1)[0]);
    },
    editLine: (state, action: PayloadAction<{ i: number; line: Partial<Line> }>) => {
      const image = getCurrentImage(state);
      if (!image) return;

      snapshotImageStateForUndo(state);
      const { lines } = image.state.present;
      lines[action.payload.i] = { ...lines[action.payload.i], ...action.payload.line };
    },
  },
});

export const {
  setCurrentImage,
  setImageName,
  addNewImage,
  duplicateImage,
  deleteImage,
  setCanvasOption,
  setLineOption,
  clickPosition,
  clearActivePosition,
  undo,
  redo,
  setLineEditor,
  deleteLine,
  moveLine,
  editLine,
} = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
