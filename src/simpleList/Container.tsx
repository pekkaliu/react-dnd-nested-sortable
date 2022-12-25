import update from 'immutability-helper'
import { FC, useMemo } from 'react'
import { useCallback, useState } from 'react'
import { Group } from './Group'
import { Card } from './Card'

import { ItemTypes } from './ItemTypes'
import { arrayMove } from '@dnd-kit/sortable'
import { Box, Stack } from '@mantine/core'
import { ToolContextProvider } from './ToolContext'
import { Motion, spring } from 'react-motion';


export type UniqueIdentifier = number | string


const style = {
    width: 400,
}

export interface Item {
    id: number
    text: string,
    type: string,
    children?: any[]
}

export const Container: FC = () => {
    //const [itemsData, setItemsData] = useState(
    const itemsData = useMemo(() => ({
        0: {
            id: 0,
            text: 'Group 0',
            type: ItemTypes.GROUP
        },
        1: {
            id: 1,
            text: 'Card 1',
            type: ItemTypes.CARD
        },
        2: {
            id: 2,
            text: 'Group 2',
            type: ItemTypes.GROUP,
        },
        3: {
            id: 3,
            text: 'Card 3',
            type: ItemTypes.CARD
        },
        4: {
            id: 4,
            text: 'Card 4',
            type: ItemTypes.CARD
        },
        5: {
            id: 5,
            text: 'Card 5',
            type: ItemTypes.CARD
        },
        6: {
            id: 6,
            text: 'Card 6',
            type: ItemTypes.GROUP
        },
        7: {
            id: 7,
            text: 'Card 7',
            type: ItemTypes.GROUP
        },
        8: {
            id: 8,
            text: 'Card 8',
            type: ItemTypes.CARD
        },
    }), [])

    const [items, setItems] = useState({
        0: [1, 4, 5, 8],
        6: [7],
        7: [8],
        2: [3]
    })

    console.log(items)

    const getAllChildIds = useCallback((id: UniqueIdentifier) => {

        // @ts-ignore
        return items[id].reduce((acc: any[], childId: UniqueIdentifier) => {
            // @ts-ignore
            if (itemsData[childId].type === ItemTypes.CARD) {
                acc.push(childId)
            } else {
                acc = [...acc, childId, ...getAllChildIds(childId)]
            }
            return acc
        }, [])
    }, [items, itemsData])


    const moveToGroup = useCallback((drag: any, group: any) => {

        const { dragId, dragParentId } = drag
        const { groupId, newIndex } = group
        setItems(items => ({
            ...items,
            //@ts-ignore
            [dragParentId]: items[dragParentId].filter((id: UniqueIdentifier) => id !== dragId),
            [groupId]: [
                //@ts-ignore
                ...items[groupId].slice(0, newIndex),
                dragId,
                //@ts-ignore
                ...items[groupId].slice(
                    newIndex,
                    //@ts-ignore
                    items[groupId].length
                )
            ]
        })
        )
    }, [])

    const CardMoveToGroup = useCallback((drag: any, hover: any) => {
        const { dragId, dragParentId } = drag
        const { hoverParentId, newIndex } = hover


        setItems(items => ({
            ...items,
            //@ts-ignore
            [dragParentId]: items[dragParentId].filter((id: UniqueIdentifier) => id !== dragId),
            [hoverParentId]: [
                //@ts-ignore
                ...items[hoverParentId].slice(0, newIndex),
                dragId,
                //@ts-ignore
                ...items[hoverParentId].slice(
                    newIndex,
                    //@ts-ignore
                    items[hoverParentId].length
                )
            ]
        })
        )
    }, [])


    const moveCard = useCallback((drag: any, hover: any) => {
        const { hoverIndex, hoverParentId, hoverType } = hover
        const { dragIndex, dragParentId } = drag

        // siblings
        if (hoverParentId === dragParentId && hoverType !== ItemTypes.GROUP) {
            setItems((items: any) => ({
                ...items,
                [hoverParentId]: arrayMove(items[hoverParentId], dragIndex, hoverIndex)
            }))

            return
        }

    }, [])

    const renderCard = useCallback(
        (itemId: UniqueIdentifier, parentId: UniqueIdentifier, index: number, style: any) => {
            // @ts-ignore
            const card = itemsData[itemId]
            return (
                <Card
                    key={itemId}
                    index={index}
                    parentId={parentId}
                    {...card}
                    style={style}
                />

            )
        },
        [itemsData],
    )

    const renderGroup = useCallback(
        (itemId: UniqueIdentifier, parentId: UniqueIdentifier, index: number, groupItems: any[]) => {
            // @ts-ignore
            const card = itemsData[itemId]

            return (
                <Group
                    key={itemId}
                    index={index}
                    {...card}
                    parentId={parentId}
                >

                    {groupItems.map((childId: UniqueIdentifier, i: number) =>
                        <Motion
                            key={childId}
                            defaultStyle={{y: 0}}
                            style={{ y: spring(i , { stiffness: 1000, damping: 32 }) }}
                        >
                            {// @ts-ignore
                            ({ y }) => itemsData[childId].type === ItemTypes.CARD ?
                                        renderCard(childId, itemId, i, { transform: 'translate3d(0, ' + y + 'px, 0)', }) :
                                        // @ts-ignore
                                        renderGroup(childId, itemId, i, items[childId])
                                }
                        </Motion>
                    )}

                </Group>
            )
        },
        [items, itemsData, renderCard],
    )

    return <Box sx={{
        width: 'auto',
        display: 'flex',
    }}>
        <ToolContextProvider value={{
            itemsData,
            items,
            moveCard,
            moveToGroup,
            CardMoveToGroup,
            getAllChildIds
        }}>
            {
                // @ts-ignore
                renderGroup(0, 'root', 0, items[0])}
        </ToolContextProvider>
    </Box>

}

