import { ActionIcon, Box, createStyles, Grid, MantineTheme, Stack, Title } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import Item from "./Item";
import SortableItem from "./SortableItem";
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useEffect, useMemo, useRef } from "react";
import { animateLayoutChanges, fadeIn } from "./sortableUtils";
import GroupItem from "./item/GroupItem";

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
        height: '47px',
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
    sidebar: {
        margin: 0,
        padding: 0,
        width: '80px',
        background: 'yellow',
        minHeight: '50px',
    },
    mtb: {
        marginBottom: '15px'
    },
    fadeIn: {
        animation: `${fadeIn} 500ms ease`
    }

}))


const SortableGroup: any = ({ groupId, parentId, groups, index: idx, disableChilds }: any) => {

    const { classes, theme } = useToolStyle()

    const {
        attributes,
        listeners,
        setNodeRef: setContainerNodeRef,
        transform,
        transition,
        active,
        isDragging,
        setActivatorNodeRef
    } = useSortable({
        id: groupId,
        disabled: disableChilds,
        data: { isContainer: true, parentId },
        animateLayoutChanges
    });

    const activeItemClass = (active && active.id === groupId) && '0.1';

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: activeItemClass
    };

    return <GroupItem
        groupId={groupId}
        groups={groups}
        classes={classes}
        ref={setContainerNodeRef}
        handleProps={{ref:setActivatorNodeRef}}
        index={idx}
        disableChilds={isDragging}
        style={style}
        {...listeners}
        {...attributes}
    />
}


export default SortableGroup;
