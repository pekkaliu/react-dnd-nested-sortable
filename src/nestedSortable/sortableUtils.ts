import { DropAnimation, defaultDropAnimationSideEffects, closestCorners, DroppableContainer, getFirstCollision, KeyboardCode, KeyboardCoordinateGetter } from "@dnd-kit/core";
import { AnimateLayoutChanges, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { keyframes } from "@emotion/react";
import { MantineTheme, createStyles } from "@mantine/core";
import { useState, useEffect } from "react";

export const fadeIn = keyframes({
    "0%": {
        opacity: 0
    },
    "100%": {
        opacity: 1
    }
})
export const pop = keyframes({
    "0%": {
        transform: "scale(1)"
    },
    "100%": {
        transform: "scale(1.05)"
    }
})


export const useSortableStyles = createStyles((theme: MantineTheme) => ({
    GroupGrid: {
        backgroundColor: theme.colors.gray[0],
        gap: '24px',
        padding: '24px',
        margin: 0,
        border: '1px dashed',
        borderColor: theme.colors.gray[4],
        borderRadius: theme.defaultRadius,
        position: 'relative',
    },
    overGroup: {
        background: theme.colors.gray[1],
    },
    activeGroup: {
        background: theme.colors.gray[1],
        color: theme.colors[theme.primaryColor][7],
        boxShadow: `0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px ${theme.colors[theme.primaryColor][1]}`,
        border: `1px solid ${theme.colors[theme.primaryColor][7]}`,
    },
    col: {
        transition: 'box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)'
    },
    overLayItem: {
        zoom: 1.1,
        boxShadow: theme.shadows.xl,
    },
    dragOverlay: {
        animation: `${pop} 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)`,
        transform: 'scale(1.05)'
    },
    fadeIn: {
        animation: `${fadeIn} 500ms ease`
    },
    
}))

export const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5'
            },
        },
    }),
};


const directions: string[] = [
    KeyboardCode.Down,
    KeyboardCode.Right,
    KeyboardCode.Up,
    KeyboardCode.Left,
  ];
  
  export const coordinateGetter: KeyboardCoordinateGetter = (
    event,
    {context: {active, droppableRects, droppableContainers, collisionRect}}
  ) => {
    if (directions.includes(event.code)) {
      event.preventDefault();
  
      if (!active || !collisionRect) {
        return;
      }
  
      const filteredContainers: DroppableContainer[] = [];
  
      droppableContainers.getEnabled().forEach((entry) => {
        if (!entry || entry?.disabled) {
          return;
        }
  
        const rect = droppableRects.get(entry.id);
  
        if (!rect) {
          return;
        }
  
        const data = entry.data.current;
  
        if (data) {
          const {type, children} = data;
  
          if (type === 'container' && children?.length > 0) {
            if (active.data.current?.type !== 'container') {
              return;
            }
          }
        }
  
        switch (event.code) {
          case KeyboardCode.Down:
            if (collisionRect.top < rect.top) {
              filteredContainers.push(entry);
            }
            break;
          case KeyboardCode.Up:
            if (collisionRect.top > rect.top) {
              filteredContainers.push(entry);
            }
            break;
          case KeyboardCode.Left:
            if (collisionRect.left >= rect.left + rect.width) {
              filteredContainers.push(entry);
            }
            break;
          case KeyboardCode.Right:
            if (collisionRect.left + collisionRect.width <= rect.left) {
              filteredContainers.push(entry);
            }
            break;
        }
      });
  
      const collisions = closestCorners({
        active,
        collisionRect: collisionRect,
        droppableRects,
        droppableContainers: filteredContainers,
        pointerCoordinates: null,
      });
      const closestId = getFirstCollision(collisions, 'id');
  
      if (closestId != null) {
        const newDroppable = droppableContainers.get(closestId);
        const newNode = newDroppable?.node.current;
        const newRect = newDroppable?.rect.current;
  
        if (newNode && newRect) {
          if (newDroppable.id === 'placeholder') {
            return {
              x: newRect.left + (newRect.width - collisionRect.width) / 2,
              y: newRect.top + (newRect.height - collisionRect.height) / 2,
            };
          }
  
          if (newDroppable.data.current?.type === 'container') {
            return {
              x: newRect.left + 20,
              y: newRect.top + 74,
            };
          }
  
          return {
            x: newRect.left,
            y: newRect.top,
          };
        }
      }
    }
  
    return undefined;
  };
  
export function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 250);
        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}