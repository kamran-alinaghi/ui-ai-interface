import { useEffect, useRef, useState } from "react";
import { getSidebarStyle, hideButtonStyle, contentContainer, columnDevider } from "../styles/side-bar-styles";
import { SidebarProps } from "../shared/interfaces";



export function Sidebar({ side, children }: SidebarProps) {
  const [visible, setVisible] = useState(true);
  const [width, setWidth] = useState(250);
  const [isDragging, setIsDragging] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const isLeft = side === "left";

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = visible ? `${width}px` : "24px";
    }
  }, [visible, width]);

  const handleMouseDown = (e: React.MouseEvent) => {
    document.body.style.userSelect = 'none';
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = isLeft
        ? moveEvent.clientX - startX
        : startX - moveEvent.clientX;
      const newWidth = Math.max(150, startWidth + delta);
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = (moveEvent: MouseEvent) => {
      const delta = isLeft
        ? moveEvent.clientX - startX
        : startX - moveEvent.clientX;
      const finalWidth = Math.max(150, startWidth + delta);
      setWidth(finalWidth);
      document.body.style.userSelect = '';
      setIsDragging(false);

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      style={getSidebarStyle({ visible, width, isLeft, isDragging })}
    >
      <button
        onClick={() => setVisible(!visible)}
        style={hideButtonStyle({ visible, width, isLeft, isDragging })}
      >
        {visible ? (isLeft ? "<" : ">") : isLeft ? ">" : "<"}
      </button>

      {visible && (
        <div style={contentContainer()}>
          {children}
        </div>
      )}

      {visible && (
        <div
          onMouseDown={handleMouseDown}
          style={columnDevider({ visible, width, isLeft, isDragging })}
        />
      )}
    </div>
  );
}
