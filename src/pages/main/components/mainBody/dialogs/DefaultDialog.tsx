import {Fragment} from "react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

const DefaultDialog = ({
                           isOpen,
                           onClose,
                           children,
                       }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {
                onClose()
            }}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                className="flex flex-col justify-center w-full max-w-lg transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl border-2 border-[var(--borders-color)] transition-all bg-[var(--background-color)]">
                                <div className={"flex flex-row gap-2 w-full justify-end items-end"}>
                                    <button className={"px-4 w-fit text-3xl text-text"} onClick={() => onClose()}>
                                        ✕
                                    </button>
                                </div>
                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DefaultDialog;
