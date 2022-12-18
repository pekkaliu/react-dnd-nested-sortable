import { Box, ActionIcon, Stack, Grid, Title } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons';
import React, { forwardRef } from 'react';
import { useToolStyle } from './SortableGroup';
import { TYPES } from './ToolContainer';

const Item: any = React.memo(forwardRef<HTMLInputElement>(({ id, ...props }: any, ref: any) => {
    return (
        <div {...props} ref={ref} >{props.children}</div>
    )
}

));
Item.displayName = 'Item';

export default Item;



export const DragOverlayItem: any = React.memo(forwardRef<HTMLInputElement>((
    { id }: any,
    ref) => {

    const { classes, theme } = useToolStyle()
    return <Box ref={ref} className={classes.valueRowCol}>
        <ActionIcon
            variant="subtle"
            onClick={() => { }}
            size={36}
        >
            <IconGripVertical size={25} color={`${theme.colors.gray[4]}`} />
        </ActionIcon>
        <Title order={5}>{id}</Title>
    </Box>
})
)

export const DragOverlayGroup: any = React.memo(forwardRef<HTMLInputElement>(({ groupId, items, groupItems }: any, ref) => {

    const { classes, theme } = useToolStyle()

    return <Stack ref={ref} className={classes.rootStack}>
        <Box className={classes.groupHeader}>
            <ActionIcon
                variant="subtle"
                onClick={() => { }}
                size={36}
            >
                <IconGripVertical size={25} color={`${theme.colors.gray[4]}`} />
            </ActionIcon>
            <Title order={5}>{groupId}</Title>
        </Box>
        <Grid grow className={classes.groupGrid}>
            <Grid.Col span="content" className={classes.sidebar}>
                <Box>
                    {groupId}
                </Box>
            </Grid.Col>
            <Grid.Col span='content' className={classes.valueRowCol}>
                <Stack className={classes.rootStack}>
                    {groupItems.map((id: any, index: number) => {
                        return items[id].type === TYPES.Group ?
                            <DragOverlayGroup
                                key={id}
                                groupId={id}
                                parentId={groupId} />
                            :
                            <DragOverlayItem
                                parentId={groupId}
                                key={id}
                                id={id} />
                    })
                    }
                </Stack>
            </Grid.Col>
        </Grid>
    </Stack>
}))