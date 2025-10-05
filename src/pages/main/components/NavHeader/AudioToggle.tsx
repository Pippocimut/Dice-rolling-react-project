import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {toggleAudio} from "@/store/settings/settingsSlice.ts";
import type {RootState} from "@/store";


export function AudioToggle() {

    const dispatch = useDispatch()
    const audioOn = useSelector((state:RootState) => state.settings.audioOn)

    const onClick = () => {
        dispatch(toggleAudio())
    }

    return <Button onClick={onClick}>
        {
            audioOn ? "Mute" : "Unmute"
        }
    </Button>

}