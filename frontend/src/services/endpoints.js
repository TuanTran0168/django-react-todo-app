import { SERVER } from "./api";

export const endpoints = {
    tasks: `${SERVER}/api/tasks/`,
    users: `${SERVER}/api/users/`,
    bulk_delete: `${SERVER}/api/tasks/bulk_delete/`,
    bulk_done: `${SERVER}/api/tasks/bulk_done/`,
};
