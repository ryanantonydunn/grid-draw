import { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentImage } from "./helpers";
import {
  addNewImage,
  clearActivePosition,
  clickPosition,
  deleteImage,
  deleteLine,
  duplicateImage,
  editLine,
  moveLine,
  redo,
  setCanvasOption,
  setCurrentImage,
  setImageName,
  setLineEditor,
  setLineOption,
  undo,
} from "./reducer";
import { AppState, CanvasOptions, Image, Line, LineEditor, LineOptions, Position } from "./types";

export const useCanvasOptions = () => {
  return useSelector((state: AppState) => state.canvasOptions);
};

export const useLineEditor = () => {
  return useSelector((state: AppState) => state.lineEditor);
};

export const useLineOptions = () => {
  return useSelector((state: AppState) => state.lineOptions);
};

export const useCurrentImage = (): Image | null => {
  return useSelector((state: AppState) => getCurrentImage(state));
};

export const useImages = (): Image[] => {
  return useSelector((state: AppState) => state.images);
};

export const useSetCurrentImage = () => {
  const dispatch = useDispatch();
  return (str: string) => dispatch(setCurrentImage(str));
};

export const useSetImageName = () => {
  const dispatch = useDispatch();
  return (str: string) => dispatch(setImageName(str));
};

export const useAddNewImage = () => {
  const dispatch = useDispatch();
  return () => dispatch(addNewImage());
};

export const useDuplicateImage = () => {
  const dispatch = useDispatch();
  return () => dispatch(duplicateImage());
};

export const useDeleteImage = () => {
  const dispatch = useDispatch();
  return () => dispatch(deleteImage());
};

export const useSetLineOption = () => {
  const dispatch = useDispatch();
  return (opt: Partial<LineOptions>) => dispatch(setLineOption(opt));
};

export const useSetCanvasOption = () => {
  const dispatch = useDispatch();
  return (opt: Partial<CanvasOptions>) => dispatch(setCanvasOption(opt));
};

export const useClickPosition = () => {
  const dispatch = useDispatch();
  return (p: Position) => dispatch(clickPosition(p));
};

export const useClearActivePosition = () => {
  const dispatch = useDispatch();
  return () => dispatch(clearActivePosition());
};

export const useSetLineEditor = () => {
  const dispatch = useDispatch();
  return (l: Partial<LineEditor>) => dispatch(setLineEditor(l));
};

export const useDeleteLine = () => {
  const dispatch = useDispatch();
  return (i: number) => dispatch(deleteLine(i));
};

export const useMoveLine = () => {
  const dispatch = useDispatch();
  return (i1: number, i2: number) => dispatch(moveLine({ oldIndex: i1, newIndex: i2 }));
};

export const useEditLine = () => {
  const dispatch = useDispatch();
  return (i: number, line: Partial<Line>) => dispatch(editLine({ i, line }));
};

export const useUndo = (): (() => PayloadAction) | null => {
  const dispatch = useDispatch();
  const image = useCurrentImage();
  if (!image || !image.state.past.length) return null;
  return () => dispatch(undo());
};

export const useRedo = (): (() => PayloadAction) | null => {
  const dispatch = useDispatch();
  const image = useCurrentImage();
  if (!image || !image.state.future.length) return null;
  return () => dispatch(redo());
};

/**
 * Get the closest grid position on a canvas from the pixel co-ordinates - using gridsize
 * Eg: With a gridSize of 10: [11, 17] => [1, 2]
 */
export const useGetPositionFromXy = () => {
  const gridSize = useSelector((state: AppState) => state.canvasOptions.gridSize);
  const calc = (n: number) => Math.ceil((n - gridSize / 2) / gridSize);
  return (p: Position) => [calc(p[0]), calc(p[1])] as Position;
};

/**
 * Get the pixel co-ordinates on a canvas from the grid position - using gridSize
 * Eg: With a gridSize of 12: [1, 2] => [12, 24]
 */
export const useGetXyFromPosition = () => {
  const gridSize = useSelector((state: AppState) => state.canvasOptions.gridSize);
  const calc = (n: number) => n * gridSize;
  return (p: Position) => [calc(p[0]), calc(p[1])] as Position;
};
