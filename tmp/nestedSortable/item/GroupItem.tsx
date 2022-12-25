import { SortableContext } from "@dnd-kit/sortable";
import { Stack, Box, ActionIcon, Title, Grid } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import React, { forwardRef, useEffect, useRef } from "react";
import SortableGroup from "../SortableGroup";
import SortableItem from "../SortableItem";



const GroupItem: any = forwardRef<HTMLInputElement>(({
    groupId,
    groups,
    classes,
    handleProps,
    index: idx,
    listeners,
    disableChilds,
    ...props
}: any, ref: any) => {

    const renderCountRef = useRef(0)

    useEffect(() => {
        renderCountRef.current++
    })

    return (
        <div {...props} ref={ref} >
            <SortableContext items={groups[groupId]} >
                <Stack className={classes.rootStack}>
                    <Box className={classes.groupHeader}>
                        {// Base group should not be draggable
                            groupId !== 0 && <ActionIcon
                                variant="subtle"
                                onClick={() => { }}
                                size={36}
                                {...handleProps}
                                {...listeners}
                            >
                                <IconGripVertical size={25} color={`${''/*theme.colors.gray[4]*/}`} />
                            </ActionIcon>}
                        <Title order={5}>{groupId} {renderCountRef.current}</Title>
                    </Box><Grid grow className={classes.groupGrid}>
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
                                            index={idx + index}
                                            groupId={id}
                                            groups={groups}
                                            disableChilds={disableChilds}
                                            parentId={groupId} />
                                        :
                                        <SortableItem
                                            index={idx + index}
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
        </div>
    )
});


export default GroupItem;