import { Box } from "@mantine/core";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COMPONENT } from "./constants";
import useNestedStyle from "./useNestedStyle";

const style = {
  border: "1px dashed black",
  padding: "0.5rem 1rem",
  backgroundColor: "white",
  cursor: "move"
};
const Component = ({ data, components, path }: any) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: COMPONENT,
    item: {
      id: data.id,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }));

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = components[data.id];

  const {classes} = useNestedStyle()

  return (
    <Box
      ref={ref}
      style={{ ...style, opacity }}
      className={classes.valueRowCol}
    >
      <div>{data.id}</div>
      <div>{component.content}</div>
    </Box>
  );
};
export default Component;
