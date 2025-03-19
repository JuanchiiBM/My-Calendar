import { getUserByName } from "../controllers/user.controller.ts";

export const getIdGuests = async (guests?: string[]) => {
  const idGuests = await Promise.all(
    guests?.map(async (guest) => {
      const user = await getUserByName(guest);
      return user?.id_user;
    }) || [],
  );

  return idGuests
};
