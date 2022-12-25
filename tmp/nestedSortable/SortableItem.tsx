import { useSortable } from "@dnd-kit/sortable";
import { ActionIcon, Box, Title } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import Item from "./Item";
import { useToolStyle } from "./SortableGroup";
import { CSS } from '@dnd-kit/utilities';
import { animateLayoutChanges } from "./sortableUtils";
import { useRef, useEffect, useMemo } from "react";



const SortableVariableItem: any = ({ id, parentId, index, disableChilds }: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef,
        active
    } = useSortable({
        id,
        disabled: disableChilds,
        data: { isContainer: false, parentId },
        animateLayoutChanges
    });

    const activeItemClass = (active && active.id === id) && '0.1';
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: activeItemClass
    };

    const renderCountRef = useRef(0)

    useEffect(() => {
    })

    const { classes, theme } = useToolStyle()
    const SItem = useMemo(() => {
        renderCountRef.current++
        return <Box className={classes.valueRowCol}>
        <ActionIcon
            variant="subtle"
            onClick={() => { }}
            size={36}
            ref={setActivatorNodeRef}
            {...listeners}
        >
            <IconGripVertical size={25} color={`${theme.colors.gray[4]}`} />
        </ActionIcon>
        <Title order={5}>{id} {renderCountRef.current}</Title>
    </Box>
    },[])

    return <Item ref={setNodeRef} index={index} style={style} {...attributes} >
        {SItem}
    </Item>
}

export default SortableVariableItem;