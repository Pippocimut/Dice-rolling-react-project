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

    renderItem(item: T): ReactNode;

    orientation?: "col" | "row";
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
                delay: 100,
                tolerance: 5,
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
                if (over && active.id !== over.id) {
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
                <ul className={"flex flex-col flex-wrap gap-2 w-full max-h-125 overflow-x-auto shadow-lg border-gray-300 border-1 border-solid py-8 p-2 rounded-xl"}
                    role="application">
                    {items.map((item) => (
                        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
                    ))}

                </ul>
            </SortableContext>
            <SortableOverlay>
                {activeItem ? <div className={"shadow-2xl"}>
                    {renderItem(activeItem)}
                </div> : null}
            </SortableOverlay>
        </DndContext>
    );
}

SortableList.Item = SortableItem;
