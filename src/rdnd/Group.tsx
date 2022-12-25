import { Box } from "@mantine/core";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import Column from "./Column";
import { ROW } from "./constants";
import DropZone from "./DropZone";
import useNestedStyle from "./useNestedStyle";



const style={}
const Group:any = ({ data, components, handleDrop, path }:any) => {
    const ref = useRef(null);
  

    const [{ isDragging }, drag] = useDrag(() => ({
      type: ROW,
      item: {
        id: data.id,
        children: data.children,
        path
      },
      collect: (monitor:any) => ({
        isDragging: monitor.isDragging()
      })
    }));
  
    const opacity = isDragging ? 0 : 1;
    drag(ref);
  
    const renderColumn = (column:any, currentPath:any) => {
      return (
        <Column
          key={column.id}
          data={column}
          components={components}
          handleDrop={handleDrop}
          path={currentPath}
        />
      );
    };
  
    const {classes} = useNestedStyle()
    return (
      <Box ref={ref} style={{ ...style, opacity }} className={classes.group}>
        {data.id}
        <div className="columns">
          {data.children.map((column:any, index:any) => {
            const currentPath = `${path}-${index}`;
  
            return (
              <React.Fragment key={column.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: data.children.length,
                  }}
                  onDrop={handleDrop}
                  className="horizontalDrag"
                />
                {renderColumn(column, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${path}-${data.children.length}`,
              childrenCount: data.children.length
            }}
            onDrop={handleDrop}
            className="horizontalDrag"
            isLast
          />
        </div>
      </Box>
    );
}

export default Group;