import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SetSelect} from "@/pages/main/components/NavHeader/SetSelect.tsx";
import {useNavigate} from "react-router-dom";
import {ImportButton} from "@/components/ImportButton.tsx";

export const Header = () => {
    const navigate = useNavigate();

    return <div
        className={"h-fit w-full px-8 py-4 border-b-2 border-borders gap-4 flex flex-row justify-start items-start flex-wrap"}>
        <NavigationMenu className={"w-full"}>
            <NavigationMenuList className={"w-full flex flex-row gap-4"}>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Button onClick={() => navigate("/")} className={"p-4"}>
                            Home
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Button onClick={() => navigate("/history")} className={"p-4"}>
                            History
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Button onClick={() => navigate("/tags")} className={"p-4"}>
                            Tags
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Button onClick={() => navigate("/export")} className={"p-4"}>
                            Export
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Button onClick={() => navigate("/connect")} className={"p-4"}>
                            Connect
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        <ImportButton/>
        <SetSelect/>
    </div>
}