import React from "react";
import {
  useAddNewImage,
  useCanvasOptions,
  useCurrentImage,
  useDeleteImage,
  useDuplicateImage,
  useImages,
  useLineOptions,
  useSetCanvasOption,
  useSetCurrentImage,
  useSetImageName,
  useSetLineOption,
} from "../store/hooks";
import { ColorHue, colorHues } from "../store/types";
import { Button } from "./atoms/Button";
import { FormSelect } from "./atoms/FormSelect";
import { FormInput } from "./atoms/FormInput";
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Copy from "@spectrum-icons/workflow/Copy";
import Edit from "@spectrum-icons/workflow/Edit";
import SaveFloppy from "@spectrum-icons/workflow/SaveFloppy";
import Cancel from "@spectrum-icons/workflow/Cancel";

export function Panel() {
  const lineOptions = useLineOptions();
  const canvasOptions = useCanvasOptions();
  const setLineOption = useSetLineOption();
  const setCanvasOption = useSetCanvasOption();
  const image = useCurrentImage();
  const images = useImages();
  const addNewImage = useAddNewImage();
  const duplicateImage = useDuplicateImage();
  const deleteImage = useDeleteImage();
  const setImageName = useSetImageName();
  const setCurrentImage = useSetCurrentImage();

  const [editingImageName, setEditingImageName] = React.useState(false);
  const [tempImageName, setTempImageName] = React.useState("");
  React.useEffect(() => {
    setTempImageName(image?.name || "");
  }, [image]);

  return (
    <div className="absolute bottom-0 left-0 w-full p-1 bg-slate-800 text-slate-100 flex items-center">
      {/** Line options */}
      <div className="pr-2">
        <label className="text-xs block">Color</label>
        <FormSelect onChange={(e) => setLineOption({ color: e.target.value as ColorHue })} value={lineOptions.color}>
          {colorHues.map((hue) => (
            <option key={hue} value={hue}>
              {hue}
            </option>
          ))}
        </FormSelect>
      </div>
      <div className="pr-2">
        <label className="text-xs block">Width</label>
        <FormSelect
          className="w-14"
          onChange={(e) => setLineOption({ width: Number(e.target.value) })}
          value={lineOptions.width}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </FormSelect>
      </div>
      <div className="pr-2">
        <label className="text-xs block">Opacity</label>
        <FormSelect
          className="w-14"
          onChange={(e) => setLineOption({ opacity: Number(e.target.value) })}
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
        </FormSelect>
      </div>

      {/** Grid options */}
      <div className="ml-2 mr-4 bg-slate-700 w-px self-stretch"></div>
      <div className="pr-2">
        <label className="text-xs block">Grid Size</label>
        <FormSelect
          className="w-14"
          onChange={(e) => setCanvasOption({ gridSize: Number(e.target.value) })}
          value={canvasOptions.gridSize}
        >
          {Array.from({ length: 68 }).map((_, i) => (
            <option key={i + 4} value={i + 4}>
              {i + 4}
            </option>
          ))}
        </FormSelect>
      </div>

      {/** Image options */}
      {editingImageName ? (
        <>
          <div className="ml-auto">
            <FormInput
              type="text"
              className="w-24 mr-2"
              onChange={(e) => setTempImageName(e.currentTarget.value)}
              value={tempImageName}
            />
          </div>
          <div>
            <Button
              className="mr-2"
              onClick={() => {
                setTempImageName(image?.name || "");
                setEditingImageName(false);
              }}
            >
              <Cancel aria-label="cancel" size="S" />
            </Button>
            <Button
              onClick={() => {
                setImageName(tempImageName);
                setEditingImageName(false);
              }}
              title="Save name"
            >
              <SaveFloppy aria-label="save" size="S" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="ml-auto">
            <FormSelect
              className="mr-2"
              onChange={(e) => {
                setCurrentImage(e.currentTarget.value);
              }}
              value={image?.id || ""}
            >
              {images.map((img) => (
                <option key={img.id} value={img.id}>
                  {img.name}
                </option>
              ))}
            </FormSelect>
          </div>
          <div>
            <Button
              className="mr-2"
              onClick={() => {
                setEditingImageName(true);
              }}
              title="Edit the image name"
            >
              <Edit aria-label="edit name" size="S" />
            </Button>
            <Button
              className="mr-2"
              onClick={() => {
                duplicateImage();
              }}
              title="Duplicate this image"
            >
              <Copy aria-label="duplicate" size="S" />
            </Button>
            <Button
              className="mr-2"
              onClick={() => {
                if (window.confirm("Do you really want to delete this image?")) {
                  deleteImage();
                }
              }}
              title="Delete this image"
            >
              <Delete aria-label="delete" size="S" />
            </Button>
            <Button
              onClick={() => {
                addNewImage();
                setEditingImageName(true);
              }}
              title="Add new image"
            >
              <Add aria-label="add" size="S" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
