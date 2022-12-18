import { useSensors, useSensor, MouseSensor, TouchSensor,  MeasuringStrategy, DragOverlay, DndContext, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Box, Portal } from "@mantine/core";
import { useEffect,  useState } from "react";
import { dropAnimationConfig } from "./sortableUtils";
import { DragOverlayItem, DragOverlayGroup } from "./Item";
import SortableGroup from "./SortableGroup";

export enum TYPES {
    Group = 'group',
    Item = 'item'
}

const ToolContainer: any = () => {

    const data:any = {
        groups: {
            0: [1, 3, 4, 6],
            1: [2],
            //5: [7]
        },
        items: {
            0: { type: TYPES.Group },
            1: { type: TYPES.Group },
            2: { type: TYPES.Item },
            3: { type: TYPES.Item },
            4: { type: TYPES.Item },
            5: { type: TYPES.Group },
            6: { type: TYPES.Item },
            7: { type: TYPES.Item },
            8: { type: TYPES.Item },
        }
    }
    const [activeId, setActiveId] = useState(null);
    const [items, setItems] = useState(data.items)
    const [groups, setGroups] = useState(data.groups)
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    useEffect(() => console.log(groups), [groups])

    return <Box
        sx={{
            width: 'auto',
            display: 'flex',
            marginLeft: '150px'
        }}>
        <DndContext
            sensors={sensors}
            //collisionDetection={collisionDetectionStrategy}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
                draggable: {
                    measure: (element) => {
                        return element.getBoundingClientRect()
                    }
                }
            }}
            onDragStart={({ active }:any) => {
                setActiveId(active.id);
            }}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={() => { }}
        //onDragCancel={onDragCancel}
        >
            <SortableContext
                items={[0]}
            //strategy={verticalListSortingStrategy}
            >
                <SortableGroup
                    groupId={0}
                    groups={groups}
                    parentId={null}
                />
            </SortableContext>

            <Portal>
                <DragOverlay
                    zIndex={9999}
                    dropAnimation={dropAnimationConfig}
                >
                    {activeId && data.items[activeId].type === TYPES.Item ?
                        <DragOverlayItem
                            dragOverlay
                            id={activeId}
                        /> :
                        <DragOverlayGroup
                            dragOverlay
                            groupItems={groups[activeId || 0]}
                            items={items}
                            groupId={activeId}
                        />}
                </DragOverlay>
            </Portal>
        </DndContext>

    </Box >

    function onDragEnd({ active, over }:any) {
        setActiveId(null)
    }
    

    function onDragOver({ active, over }:any) {
        if (activeId !== null && over && active?.id !== over?.id) {
            const overId = over.id
            const { isContainer: overIsContainer, parentId: overParentId } = over.data.current;
            const { isContainer: activeIsContainer, parentId: activeParentId } = active.data.current;


            // skip if active is over child item
            if (activeIsContainer && groups[activeId].includes(overId))
                return;

            // move inside container
            if (overParentId === activeParentId && items[overId].type !== TYPES.Group) {

                console.log('move inside container. overType', overId, items[overId].type)
                const activeIndex = groups[activeParentId].indexOf(active.id);
                const overIndex = groups[overParentId || 0].indexOf(over.id);
                setGroups((groups:any) => ({
                    ...groups,
                    [overParentId]: arrayMove(groups[overParentId || 0], activeIndex, overIndex)
                }))
                return
            }


            //move to container when:
            // - on groupin päällä ja groupissa ei vielä ko. itemiä/grouppia
            if (overIsContainer && !groups[overId].includes(activeId)) {

                const overItems = groups[overId];
                const isBelowOverItem =
                    active.rect.current.translated.top + active.rect.current.translated.height / 2 >
                    over.rect.top + over.rect.height / 2;
                const newIndex = isBelowOverItem ? overItems.length + 1 : 0;
                const newOverGroup = [
                    ...groups[overId].slice(0, newIndex),
                    activeId,
                    ...groups[overId].slice(
                        newIndex,
                        groups[overId].length
                    )
                ]
                setGroups((groups:any) => ({
                    ...groups,
                    [activeParentId]: groups[activeParentId].filter((id: UniqueIdentifier) => id !== activeId),
                    [overId]: newOverGroup
                }))
                return;
            }

            // - on itemin päällä ja itemin parent groupissa ei vielä itemia/grouppia
            if (!overIsContainer && !groups[overParentId].includes(activeId)) {
                const overIndex = groups[overParentId].indexOf(overId)

                setGroups((groups:any) => ({
                    ...groups,
                    [activeParentId]: groups[activeParentId].filter((id: UniqueIdentifier) => id !== activeId),
                    [overParentId]: [
                        ...groups[overParentId].slice(0, overIndex),
                        activeId,
                        ...groups[overParentId].slice(
                            overIndex,
                            groups[overParentId].length
                        )]
                }))
                return;
            }

        }
    }
}


export default ToolContainer;
