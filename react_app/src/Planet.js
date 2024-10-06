export function Planet(props) {
  return (
    <div
      className="size-96 rounded-full"
      style={{ backgroundColor: props.bgColor }}
      onMouseEnter={() => props.setPlanetIsBeingHovered(true)}
      onMouseLeave={() => props.setPlanetIsBeingHovered(false)}
    ></div>
  );
}

export default Planet;
