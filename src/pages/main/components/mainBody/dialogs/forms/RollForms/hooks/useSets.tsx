import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useCallback, useEffect, useState} from "react";
import {addNewSet} from "@/store/button-sets/buttonSetSlice.ts";
import {defaultTags} from "@/store/button-sets/defaultTags.ts";
import {useNavigate} from "react-router-dom";

const ERROR_SET_EXISTS = "Set already exists";
const ERROR_NAME_EMPTY = "The set must have a name";

export const useSets = (openTriggerDialog: boolean, setOpenTriggerDialog: (x: boolean) => void) => {
    const buttonSet = useSelector((state: RootState) => state.buttonSet);
    const sets = buttonSet.sets
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const normalize = (s: string) => s.trim().toLowerCase();

    const triggerExists = useCallback(
        (name: string) =>
            Object.values(sets || {})
                .map((t) => t.name)
                .map(normalize)
                .includes(normalize(name)),
        [sets]
    );

    const createTrigger = useCallback(
        (name: string): { success: boolean; error?: string } => {
            if (!name || normalize(name) === "") {
                return {success: false, error: ERROR_NAME_EMPTY};
            }

            if (triggerExists(name)) {
                return {success: false, error: ERROR_SET_EXISTS};
            }

            dispatch(
                addNewSet(
                    {
                        name: name,
                        id:-1,
                        version: "1.2",
                        tags: defaultTags,
                        buttonList: {}
                    }
                )
            );

            return {success: true};
        },
        [dispatch, triggerExists]
    );

    useEffect(() => {
        if (!openTriggerDialog) {
            setName("");
            setErrorMessage("");
        }
    }, [openTriggerDialog]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setName(value);

        if (value.trim() === "") {
            setErrorMessage("");
            return;
        }

        if (triggerExists(value)) {
            setErrorMessage(ERROR_SET_EXISTS);
        } else {
            setErrorMessage("");
        }
    };


    const handleConfirm =(closeMenu: () => void) =>  () => {
        const {success, error} = createTrigger(name);
        if (!success) {
            setErrorMessage(error || "Failed to create trigger");
            return;
        }

        setName("");
        setOpenTriggerDialog(false);
        closeMenu()
        navigate("/")
    };

    return {name, handleConfirm, handleChange, errorMessage};
};
