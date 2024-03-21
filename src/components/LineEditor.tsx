import React from "react";
import {
  useCurrentImage,
  useDeleteLine,
  useEditLine,
  useLineEditor,
  useMoveLine,
  useSetLineEditor,
} from "../store/hooks";
import { Button } from "./atoms/Button";
import ArrowUp from "@spectrum-icons/workflow/ArrowUp";
import Delete from "@spectrum-icons/workflow/Delete";
import ArrowDown from "@spectrum-icons/workflow/ArrowDown";
import Close from "@spectrum-icons/workflow/Close";
import { FormSelectColor, FormSelectOpacity, FormSelectWidth } from "./atoms/FormSelect";
import { ColorHue } from "../store/types";
import styles from "./LineEditor.module.css";

export function LineEditor() {
  const image = useCurrentImage();
  const lineEditor = useLineEditor();
  const setLineEditor = useSetLineEditor();
  const moveLine = useMoveLine();
  const deleteLine = useDeleteLine();
  const editLine = useEditLine();

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (lineEditor.activeAttributeEdit && e.button !== 1 && e.button !== 2) {
        setLineEditor({ activeAttributeEdit: null });
      }
    };
    const handleRightClick = (e: MouseEvent) => {
      if (lineEditor.activeAttributeEdit) {
        e.preventDefault();
        setLineEditor({ activeAttributeEdit: null });
      }
    };
    document.body.addEventListener("contextmenu", handleRightClick);
    document.body.addEventListener("mousedown", handleClick);
    return () => {
      document.body.removeEventListener("contextmenu", handleRightClick);
      document.body.removeEventListener("mousedown", handleClick);
    };
  }, [lineEditor, setLineEditor]);

  if (!lineEditor.isOpen) return null;

  return (
    <>
      <div
        className="absolute top-0 right-0 w-full h-full bg-slate-900 text-slate-100 text-xs overflow-y-auto pb-20 bg-opacity-90 grid items-stretch"
        style={{ maxWidth: 540, gridTemplateColumns: "repeat(6, auto)" }}
      >
        <div className={`contents ${styles.headers}`}>
          <div>p1</div>
          <div>p2</div>
          <div>color</div>
          <div>width</div>
          <div>opacity</div>
          <div className="text-right">
            <Button
              onClick={() => {
                setLineEditor({ isOpen: false });
              }}
              title="Close"
            >
              <Close aria-label="close" size="XS" />
            </Button>
          </div>
        </div>
        {(image?.state.present.lines || []).map((line, i) => (
          <div
            key={i}
            className={`contents ${styles.row} ${lineEditor.activeIndex === i ? styles.rowActive : ""}`}
            onMouseEnter={() => {
              if (!["start", "end"].includes(lineEditor.activeAttributeEdit || "")) {
                setLineEditor({ activeIndex: i });
              }
            }}
          >
            <div
              onClick={() => setLineEditor({ activeIndex: i, activeAttributeEdit: "start" })}
              onMouseEnter={() => {
                setLineEditor({ activeHover: "start" });
              }}
            >
              <span
                className={
                  lineEditor.activeIndex === i && lineEditor.activeAttributeEdit === "start"
                    ? "p-1 bg-yellow-600 rounded"
                    : "p-1"
                }
              >
                {line.start[0]} / {line.start[1]}
              </span>
            </div>
            <div
              onClick={() => setLineEditor({ activeIndex: i, activeAttributeEdit: "end" })}
              onMouseEnter={() => {
                setLineEditor({ activeHover: "end" });
              }}
            >
              <span
                className={
                  lineEditor.activeIndex === i && lineEditor.activeAttributeEdit === "end"
                    ? "p-1 bg-yellow-600 rounded"
                    : "p-1"
                }
              >
                {line.end[0]} / {line.end[1]}
              </span>
            </div>
            <div>
              <FormSelectColor
                onChange={(e) => editLine(i, { color: e.target.value as ColorHue })}
                value={line.color}
              />
            </div>
            <div>
              <FormSelectWidth onChange={(e) => editLine(i, { width: Number(e.target.value) })} value={line.width} />
            </div>
            <div>
              <FormSelectOpacity
                onChange={(e) => editLine(i, { opacity: Number(e.target.value) })}
                value={line.opacity}
              />
            </div>
            <div className="text-right">
              <Button
                className="mr-1"
                onClick={() => {
                  moveLine(i, i - 1);
                }}
                title="Move up"
              >
                <ArrowUp aria-label="move up" size="XS" />
              </Button>
              <Button
                className="mr-1"
                onClick={() => {
                  moveLine(i, i + 1);
                }}
                title="Move down"
              >
                <ArrowDown aria-label="move down" size="XS" />
              </Button>
              <Button
                onClick={() => {
                  deleteLine(i);
                }}
                title="Delete"
              >
                <Delete aria-label="delete" size="XS" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
