import useSet from "@/hooks/useSet";
import { NotificationProps } from "@/types/notificationsModel";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect } from 'react'

const Notifications = () => {
	const notifications: NotificationProps[] = useSet('/api/notifications')

	return (
		<div>
			<Dropdown>
				<DropdownTrigger>
					<Button isIconOnly variant="light" className="">
						{notifications.length > 0 ?
							<Badge color="danger" content={notifications.length}>
								<Icon icon="bxs:bell" width={20} />
							</Badge> :
							<Icon icon="bxs:bell" width={20} />
						}
					</Button>
				</DropdownTrigger>
				<DropdownMenu emptyContent="Sin notificaciones" aria-label="Static Actions">
					{notifications.map((notification) => (
						<DropdownItem key={notification.id_notification}>
							{notification.title}
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
		</div>
	)
}

export default Notifications
