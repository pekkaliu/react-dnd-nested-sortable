import { Box } from '@mantine/core'
import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import useNestedStyle from '../rdnd/useNestedStyle'
import { UniqueIdentifier } from './Container'

import { ItemTypes } from './ItemTypes'
import { useToolContext } from './ToolContext'



export interface CardProps {
  id: any
  text: string
  index: number,
  parentId: UniqueIdentifier
  style: any
}

interface DragItem {
  index: number
  id: string
  type: string
  parentId: UniqueIdentifier
}

export const Card: FC<CardProps> = ({ id, text, index, parentId, style  }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { moveCard, CardMoveToGroup, getAllChildIds} = useToolContext()
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: [ItemTypes.CARD, ItemTypes.GROUP],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const dragParentId = item.parentId
      const dragType = item.type

      const hoverIndex = index
      const hoverParentId = parentId
      const hoverType = ItemTypes.CARD

      // Don't replace items with themselves
      if (item.id === id ) {
        return
      }

      const allChildIds = dragType === ItemTypes.GROUP ? getAllChildIds(item.id) : []
      if(allChildIds.includes(id))
        return

      if (parentId !== dragParentId ) {
        CardMoveToGroup(
          { dragId: item.id, dragParentId, dragType },
          {  hoverParentId: parentId, newIndex: index },
        )

        item.index = hoverIndex
        item.parentId = parentId
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      /*if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }*/

      // Time to actually perform the action
      moveCard(
        { dragId: item.id, dragIndex, dragParentId, dragType },
        { hoverId: id, hoverIndex, hoverParentId, hoverType }
      )

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
      item.parentId = parentId
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return {
        id,
        index,
        type: ItemTypes.CARD,
        parentId
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.5 : 1
  drag(drop(ref))
  const { classes } = useNestedStyle()

  return (
    <Box ref={ref} className={classes.valueRowCol} style={{ ...style, opacity }} data-handler-id={handlerId}>
      {text} {index}
    </Box>
  )
}
