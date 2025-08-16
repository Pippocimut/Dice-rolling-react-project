import React, {useMemo, useState} from "react";
import type {ReactNode} from "react";
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import type {Active, UniqueIdentifier} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
} from "@dnd-kit/sortable";

import {SortableItem} from "./SortableItem.tsx";
import {SortableOverlay} from "./SortableOverlay.tsx";

export interface BaseItem {
    id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
    items: T[];

    onChange(items: T[]): void;

    openCreateDialog: () => void;

    renderItem(item: T): ReactNode;
}

export function SortableList<T extends BaseItem>({
                                                     items,
                                                     onChange,
                                                     renderItem,
                                                 }: Props<T>) {
    const [active, setActive] = useState<Active | null>(null);
    const activeItem = useMemo(
        () => items.find((item) => item.id === active?.id),
        [active, items]
    );
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                delay: 250,      // 250 milliseconds delay
                tolerance: 10,    // 5 pixels of movement tolerance
                distance: 3
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 10,
                distance: 3
            }
        })
    );
    return (
        <DndContext
            sensors={sensors}
            onDragStart={({active}) => {
                setActive(active);
            }}
            onDragEnd={({active, over}) => {
                if (over && active.id !== over?.id) {
                    const activeIndex = items.findIndex(({id}) => id === active.id);
                    const overIndex = items.findIndex(({id}) => id === over.id);

                    onChange(arrayMove(items, activeIndex, overIndex));
                }
                setActive(null);
            }}
            onDragCancel={() => {
                setActive(null);
            }}
        >
            <SortableContext items={items}>
                <ul className="flex flex-row flex-wrap gap-2 m-4 my-0 p-4  w-full justify-center items-center h-fit"
                    role="application">
                    {items.map((item) => (
                        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
                    ))}

                </ul>
            </SortableContext>
            <SortableOverlay>
                {activeItem ? <div>{renderItem(activeItem)}
                    <button value={"Hello"} name={"Baby"}/>
                </div> : null}
            </SortableOverlay>
        </DndContext>
    );
}

SortableList.Item = SortableItem;
