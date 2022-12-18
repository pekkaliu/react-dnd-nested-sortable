import { ActionIcon, Box, createStyles, Grid, MantineTheme, Stack, Title } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import Item from "./Item";
import SortableItem from "./SortableItem";
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import React from "react";
import { animateLayoutChanges, fadeIn } from "./sortableUtils";

export const useToolStyle = createStyles((theme: MantineTheme) => ({

    rootStack: {
        gap: 0,
        margin: 0,
        spacing: 0,
        border: '1px solid black',
        minWidth: '500px',
    },
    groupHeader: {
        background: theme.colors.blue[3],
        borderWidth: "0px 1px 1px 1px",
        borderColor: 'red',
        minHeight: '47px',
        minWidth: '420px',
        display: 'flex',
        justifyContent: 'left',
        gap: '8px',
        paddingLeft: '17px!important',
        paddingRight: '17px!important',
        '> *': {
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    groupGrid: {
        gap: 0,
        margin: 0,
        gutter: 0,
        background: 'red'
    },
    sidebar: {
        margin: 0,
        padding: 0,
        width: '80px',
        background: 'yellow'
    },
    valueRowCol: {
        background: 'lightblue',
        display: 'flex',
        padding: 0,
        margin: 0,
        minHeight: '50px',
        borderBottom: '1px solid black',
        '> *': {
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    mtb: {
        marginBottom: '15px'
    },
    fadeIn: {
        animation: `${fadeIn} 500ms ease`
    }

}))


const SortableGroup: any = React.memo(({ groupId, parentId, groups }: any) => {

    const { classes, theme } = useToolStyle()

    const {
        attributes,
        listeners,
        setNodeRef: setContainerNodeRef,
        transform,
        transition,
        active,
        //isOver,
        setActivatorNodeRef
    } = useSortable({
        id: groupId,
        data: { isContainer: true, parentId },
        animateLayoutChanges
    });

    const activeItemClass = (active && active.id === groupId) && '0.1';

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: activeItemClass
    };

    return <Item id={groupId} ref={setContainerNodeRef} style={style} {...attributes}>
        <SortableContext items={groups[groupId]}
        //strategy={verticalListSortingStrategy}
        >
            <Stack className={classes.rootStack}>
                <Box className={classes.groupHeader}>
                    {// Base group should not be draggable
                    groupId !== 0 && <ActionIcon
                        variant="subtle"
                        onClick={() => { }}
                        size={36}
                        ref={setActivatorNodeRef}
                        {...listeners}
                    >
                        <IconGripVertical size={25} color={`${theme.colors.gray[4]}`} />
                    </ActionIcon>}
                    <Title order={5}>{groupId}</Title>
                </Box>
                <Grid grow className={classes.groupGrid}>
                    <Grid.Col span="content" className={classes.sidebar}>
                        <Box>
                            {groupId}
                        </Box>
                    </Grid.Col>
                    <Grid.Col span='content' className={`${classes.valueRowCol} ${classes.mtb}`}>
                        <Stack className={classes.rootStack}>
                            {groups[groupId].map((id: any, index: number) => {
                                return groups[id] ?
                                    <SortableGroup
                                        key={id}
                                        index={index}
                                        groupId={id}
                                        groups={groups}
                                        parentId={groupId} />
                                    :
                                    <SortableItem
                                        index={index}
                                        parentId={groupId}
                                        key={id}
                                        id={id} />
                            })
                            }
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </SortableContext>
    </Item>
})


export default SortableGroup;
