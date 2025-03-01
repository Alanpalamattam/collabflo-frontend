import { useNavigate } from "react-router-dom" // Import the navigation hook
import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { useViews } from "@/context/ViewContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { SocketEvent } from "@/types/socket"
import { VIEWS } from "@/types/view"
import { IoCodeSlash } from "react-icons/io5"
import { MdOutlineDraw } from "react-icons/md"
import cn from "classnames"
import { BsRobot } from "react-icons/bs"
import AIChat from "../ai chat/AIChat"
import { ImExit } from "react-icons/im";
function Sidebar() {
    const navigate = useNavigate() // Initialize the navigation hook
    const {
        activeView,
        isSidebarOpen,
        viewComponents,
        viewIcons,
        setIsSidebarOpen,
    } = useViews()
    const { minHeightReached } = useResponsive()
    const { activityState, setActivityState } = useAppContext()
    const { socket } = useSocket()
    const { isMobile } = useWindowDimensions()

    const changeState = () => {
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING)
            socket.emit(SocketEvent.REQUEST_DRAWING)
        } else {
            setActivityState(ACTIVITY_STATE.CODING)
        }

        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    const handleExit = () => {
        navigate("/dashboard") // Navigate to the Dashboard route
    }

    // Update the viewComponents to include AI Chat
    const updatedViewComponents = {
        ...viewComponents,
        [VIEWS.AI_CHAT]: <AIChat />,
    }

    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
            <div
                className={cn(
                    "fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-6 self-end overflow-auto border-t border-darkHover bg-dark p-3 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-2",
                    {
                        hidden: minHeightReached,
                    },
                )}
            >
                <SidebarButton
                    viewName={VIEWS.FILES}
                    icon={viewIcons[VIEWS.FILES]}
                />
                <SidebarButton
                    viewName={VIEWS.CHATS}
                    icon={viewIcons[VIEWS.CHATS]}
                />
                <SidebarButton
                    viewName={VIEWS.RUN}
                    icon={viewIcons[VIEWS.RUN]}
                />
                <SidebarButton
                    viewName={VIEWS.CLIENTS}
                    icon={viewIcons[VIEWS.CLIENTS]}
                />
                <SidebarButton
                    viewName={VIEWS.SETTINGS}
                    icon={viewIcons[VIEWS.SETTINGS]}
                />

                {/* AI Chat Button */}
                <SidebarButton
                    viewName={VIEWS.AI_CHAT}
                    icon={<BsRobot size={30} />}
                />

                {/* Button to change activity state coding or drawing */}
                <button className="self-end" onClick={changeState}>
                    {activityState === ACTIVITY_STATE.CODING ? (
                        <MdOutlineDraw size={30} />
                    ) : (
                        <IoCodeSlash size={30} />
                    )}
                </button>

                {/* Exit Button */}
                <button
            className="self-end text mt-2 flex items-center justify-center"
            onClick={handleExit}

        >
            <ImExit size={25} /> {/* Exit Icon */}
        </button>
            </div>
            <div
                className="relative bg-black md:static md:w-[700px]
"
                style={isSidebarOpen ? {} : { display: "none" }}
            >
                {/* Render the active view component */}
                {updatedViewComponents[activeView]}
            </div>
        </aside>
    )
}

export default Sidebar
