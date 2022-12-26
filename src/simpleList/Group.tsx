import { Box, Grid, Stack, Text } from '@mantine/core'
import type { Identifier, XYCoord } from 'dnd-core'
import { FC } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import useNestedStyle from './useNestedStyle'
import { transition, UniqueIdentifier } from './Container'

import { ItemTypes } from './ItemTypes'
import { useSortableContext } from './SortableContext'
import { motion, usePresence } from "framer-motion"


export interface GroupProps {
    id: any
    text: string
    index: number
    moveToGroup: (drag: any, group: any) => void
    parentId: UniqueIdentifier
    childAmount: any
}

interface DragItem {
    index: number
    id: string
    type: string
    parentId: UniqueIdentifier
    isPresent: any
}


export const Group: FC<GroupProps> = (props: any) => {
    const { id, text, index, parentId } = props
    const { items, activeId, setActiveId, moveToGroup, getAllChildIds } = useSortableContext();
    const [isPresent, safeToRemove] = usePresence()

    const ref = useRef<HTMLDivElement>(null)
    const dragRef = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: [ItemTypes.GROUP, ItemTypes.CARD],
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: any) {
            if (!ref.current) {
                return
            }
            activeId !== item.index ?? setActiveId(item.index)
            const dragIndex = item.index
            const dragParentId = item.parentId
            const dragType = item.type

            const isOverCurrent = monitor.isOver({ shallow: true })

            // Don't replace items with themselves
            if (item.id === id || !item.isPresent) {
                return
            }

            const allChildIds = dragType === ItemTypes.GROUP ? getAllChildIds(item.id) : []
            if (allChildIds.includes(id))
                return

            // skip move to group if drag item already in group 
            // or if not straight over current group
            if (dragParentId === id || !isOverCurrent) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const mouseOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (mouseOffset as XYCoord).y - hoverBoundingRect.top



            // Time to actually perform the action
            moveToGroup(
                { dragId: item.id, dragIndex, dragParentId, dragType },
                { groupId: id, groupParentId: parentId, newIndex: 0 },
            )

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            //item.index = hoverIndex
            item.index = 0
            item.parentId = id
        },
    })

    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: ItemTypes.GROUP,
        item: () => {
            return {
                id,
                index,
                type: ItemTypes.GROUP,
                parentId,
                isPresent: isPresent
            }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = activeId === id ? 0.5 : 1
    drag(dragRef)
    drop(ref)

    const { classes } = useNestedStyle()

    const animations = {
        layout: true,
        initial: 'in',
        animate: isPresent ? 'in' : 'out',
        whileTap: 'tapped',
        variants: {
          in: { opacity: 1, transition: { duration: 0 } },
          out: { opacity: 0, zIndex: -1, transition: { duration: 0.3 }  },
        },
        onAnimationComplete: () => !isPresent && safeToRemove(),
        transition
      }
      
    return (
        <Box style={{opacity}} >
            <motion.div ref={dragRef} {...animations}  className={classes.rootStack} data-handler-id={handlerId}>

            <Box className={classes.groupHeader} ref={ref}>
                <Text>{text}</Text>
            </Box>
            {items[id].length > 0  && <Grid grow className={classes.groupGrid}>
                <Grid.Col span="content" className={classes.sidebar}>
                    <Box>
                        {text}
                    </Box>
                </Grid.Col>
                <Grid.Col span='content' className={`${classes.valueRowCol}`}>
                    <Stack className={classes.container}>
                        {props.children}
                    </Stack>
                </Grid.Col>
            </Grid>}
            </motion.div>
        </Box>
    )
}
