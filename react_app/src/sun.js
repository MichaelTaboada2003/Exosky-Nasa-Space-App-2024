export function Sun(props) {
  return (
    <div
      className="size-12 bg-yellow-400 rounded-full absolute top-0 right-0"
      onMouseEnter={() => props.setSunIsBeingHovered(true)}
      onMouseLeave={() => props.setSunIsBeingHovered(false)}
    ></div>
  );
}
export default Sun;
