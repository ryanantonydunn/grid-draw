import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import colors from "tailwindcss/colors";
import { createNewImage, getCurrentImage, getNewLine } from "./helpers";
import { AppState, CanvasOptions, LineOptions, Position } from "./types";
import { v4 as uuidv4 } from "uuid";

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
      image.name = action.payload;
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
      const image = getCurrentImage(state);
      if (!image) return;
      const id = uuidv4();
      const newImage = {
        ...image,
        id,
        lines: image.lines.map((l) => ({ ...l })),
        name: `${image.name} (Copy)`,
      };
      state.images.push(newImage);
      state.currentImage = id;
    },
    setCanvasOption: (state, action: PayloadAction<Partial<CanvasOptions>>) => {
      state.canvasOptions = { ...state.canvasOptions, ...action.payload };
    },
    setLineOption: (state, action: PayloadAction<Partial<LineOptions>>) => {
      state.lineOptions = { ...state.lineOptions, ...action.payload };
    },
    clearActivePosition: (state) => {
      const image = getCurrentImage(state);
      if (!image) return;
      image.activePosition = null;
    },
    clickPosition: (state, action: PayloadAction<Position>) => {
      const image = getCurrentImage(state);
      if (!image) return;

      // if there is a new line to create
      const newLine = getNewLine(state, action.payload);
      if (newLine && image) {
        image.lines.push(newLine);
        image.activePosition = action.payload;
      } else {
        // if there is no new line, set the active position or clear it if is same
        if (action.payload === image.activePosition) {
          image.activePosition = null;
        } else {
          image.activePosition = action.payload;
        }
      }
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
} = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
