import { useSortable } from "@dnd-kit/sortable";
import { ActionIcon, Box, Title } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import Item from "./Item";
import { useToolStyle } from "./SortableGroup";
import { CSS } from '@dnd-kit/utilities';
import { animateLayoutChanges } from "./sortableUtils";



const SortableVariableItem: any = ({ id, parentId }: any) => {
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
        data: { isContainer: false, parentId },
        animateLayoutChanges
    });

    const activeItemClass = (active && active.id === id) && '0.1';
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: activeItemClass
    };

    const { classes, theme } = useToolStyle()

    return <Item ref={setNodeRef} style={style} {...attributes} >
        <Box className={classes.valueRowCol}>
            <ActionIcon
                variant="subtle"
                onClick={() => { }}
                size={36}
                ref={setActivatorNodeRef}
                {...listeners}
            >
                <IconGripVertical size={25} color={`${theme.colors.gray[4]}`} />
            </ActionIcon>
            <Title order={5}>{id}</Title>
        </Box>
    </Item>
}

export default SortableVariableItem;