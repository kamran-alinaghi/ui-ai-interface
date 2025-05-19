import React from "react";

interface SidebarStyleParams {
  visible: boolean;
  width: number;
  isLeft: boolean;
  isDragging: boolean;
}

export function getSidebarStyle({
  visible,
  width,
  isLeft,
  isDragging,
}: SidebarStyleParams): React.CSSProperties {
  return {
    position: "relative",
    width: visible ? width : 24,
    transition: isDragging ? "none" : "width 0.3s ease",
    backgroundColor: "#f0f0f0",
    borderRight: isLeft ? "1px solid #ccc" : undefined,
    borderLeft: !isLeft ? "1px solid #ccc" : undefined,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: isLeft ? "flex-start" : "flex-end",
    boxSizing: "border-box",
  };
}

export function hideButtonStyle({
  visible,
  width,
  isLeft,
  isDragging,
}: SidebarStyleParams): React.CSSProperties {
  return {
    position: "absolute",
    width: 24,
    top: 10,
    [isLeft ? "right" : "left"]: visible ? 6 : 0,
    zIndex: 10,
    cursor: "pointer",
    padding: "4px 8px",
    backgroundColor: "#ddd",
    border: "1px solid #aaa",
    borderRadius: isLeft ? "4px 0px 0px 4px" : "0px 4px 4px 0px"
  };
}
export function contentContainer(): React.CSSProperties {
  return {
    flex: 1,
    width: "100%",
    overflowY: "auto",
    padding: "16px"
  };
}

export function columnDevider({
  visible,
  width,
  isLeft,
  isDragging,
}: SidebarStyleParams): React.CSSProperties {
  return {
    position: "absolute",
    top: 0,
    bottom: 0,
    [isLeft ? "right" : "left"]: 0,
    width: "6px",
    cursor: "col-resize",
    backgroundColor: "#ccc"
  };
}