import { useEffect, useState } from "react";
export function Sun(props) {
  return (
    <div className="size-7 rounded-full bg-yellow-300 absolute top-0 right-0">
      <div
        onMouseEnter={() => props.setSunIsBeingHovered(true)}
        onMouseLeave={() => props.setSunIsBeingHovered(false)}
      />
    </div>
  );
}
export default Sun;