import { Box, Grid, Stack, Text } from '@mantine/core'
import type { Identifier, XYCoord } from 'dnd-core'
import { FC, useCallback } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import useNestedStyle from '../rdnd/useNestedStyle'
import { UniqueIdentifier } from './Container'

import { ItemTypes } from './ItemTypes'
import { useToolContext } from './ToolContext'
/*
const style = {
    border: '1px solid blue',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}*/

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
}


export const Group: FC<GroupProps> = (props: any) => {
    const { id, text, index, parentId } = props
    const { itemsData, items, moveToGroup, getAllChildIds } = useToolContext();

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
            const dragIndex = item.index
            const dragParentId = item.parentId
            const dragType = item.type

            const isOverCurrent = monitor.isOver({ shallow: true })

            // Don't replace items with themselves
            if (item.id === id) {
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

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            let newIndex = 0

            /*if (hoverClientY > hoverMiddleY) {
                newIndex = childAmount
            }*/

            //console.log('newIndex', newIndex)


            // Time to actually perform the action
            moveToGroup(
                { dragId: item.id, dragIndex, dragParentId, dragType },
                { groupId: id, groupParentId: parentId, newIndex: 0 },
            )

            // Dragging downwards
            /*if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }*/
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            //item.index = hoverIndex
            item.index = 0
            item.parentId = id
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.GROUP,
        item: () => {
            return {
                id,
                index,
                type: ItemTypes.GROUP,
                parentId
            }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0.5 : 1
    drag(dragRef)
    drop(ref)

    const { classes } = useNestedStyle()

    return (
        <Box ref={dragRef} className={classes.rootStack} style={{ opacity }} data-handler-id={handlerId}>
            <Box className={classes.groupHeader} ref={ref}>
                <Text>{text}</Text>
            </Box>
            <Grid grow className={classes.groupGrid}>
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
            </Grid>
        </Box>
    )
}
