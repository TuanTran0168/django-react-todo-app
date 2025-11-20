import { format } from "date-fns";

export const getTodayString = () => format(new Date(), "dd/MM/yyyy");
