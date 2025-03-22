import useSet from "@/hooks/useSet";
import { NotificationProps } from "@/types/notificationsModel";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import NotificationModal from "./notificationModal";
import React, { useEffect, useState } from 'react'
import { decodeJWT } from "@/utils/helpers/JWTDecode";
import { PUTFunction } from "@/utils/helpers/httpFunctions";
import useWebSocket from "@/hooks/useWebSocket";

const token = localStorage.getItem("userToken");
const userPayload = token ? decodeJWT(token) : null;
const userId = userPayload?.id;

const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedNotification, setSelectedNotification] = useState<NotificationProps | null>(null)

    const all = useSet('/api/notifications');
    useEffect(() => {
        setNotifications(all);
      }, [all]);
    
      // 🎧 Escuchamos WebSocket
      useWebSocket(userId as number, (newNotification: NotificationProps) => {
        setNotifications((prev) => [newNotification, ...prev]);
      });
    

    const handleModal = (notification: NotificationProps) => {
        setSelectedNotification(notification)
        notification.saw = true
        PUTFunction('/api/notifications', notification)
        setIsModalOpen(true)
    }

	return (
		<div>
			<Dropdown>
				<DropdownTrigger>
					<Button isIconOnly variant="light" className="">
						{notifications.length > 0 && notifications.filter(notification => !notification.saw).length > 0 ?
                            <Badge color="danger" content={notifications.filter(notification => !notification.saw).length}>
                                <Icon icon="bxs:bell" width={20} />
                            </Badge> :
							<Icon icon="bxs:bell" width={20} />
						}
					</Button>
				</DropdownTrigger>
                <DropdownMenu className="max-h-40 overflow-y-auto" emptyContent="Sin notificaciones" aria-label="Static Actions">
                    {notifications.map((notification) => (
                        <DropdownItem className={notification.saw ? "text-default-400" : "bg-default-100"} onPress={() => handleModal(notification)} key={notification.id_notification}
                        endContent={!notification.saw ? <Icon icon="ic:twotone-circle" className="text-danger" width={20} /> : null}
                        >
                            {notification.title}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
			</Dropdown>
            <NotificationModal notification={selectedNotification} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
		</div>
	)
}

export default Notifications
