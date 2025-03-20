import { EventProps } from "../models/event.model.ts";
import { getUserByName } from "..//controllers/user.controller.ts";

export const errorGuestHandler = async (data: EventProps, guests: number[]) => {
  console.log(data.guests);
  if (data.guests && data.guests && Array.isArray(data.guests)) {
    const uniqueGuests = new Set(data.guests);

    if (uniqueGuests.size !== data.guests.length) {
      throw new Error("Hay invitados repetidos en la lista");
    }

    for (const guestName of data.guests) {
      if (guestName != "") {
        const guest = await getUserByName(guestName);
        if (!guest) {
          throw new Error("Alguno de los invitados no es un usuario");
        }

        if (guest.id_user === data.created_by) {
          throw new Error("Usted no puede asignarse como invitado");
        }

        if (guest.id_user) {
          guests.push(guest.id_user);
        }
      }
    }
  }
};
