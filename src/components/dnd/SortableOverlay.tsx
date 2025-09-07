import type { PropsWithChildren } from "react";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.4",
            },
        }
    }),
    keyframes: ({ transform }) => {
        return [
            { transform: CSS.Transform.toString(transform.initial) },
            { transform: CSS.Transform.toString(transform.final) }
        ];
    },

};

const overlayStyle = {
    listStyleType: 'none',
    '::marker': {
        display: 'none'
    }
};

export function SortableOverlay({ children }: PropsWithChildren) {
    return <DragOverlay style={overlayStyle} dropAnimation={dropAnimationConfig}>{children}</DragOverlay>;
}
