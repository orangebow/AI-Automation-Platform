import {parseAsInteger} from "nuqs/server";
import{PAGINATION} from "@/config/constants";

export const executionsParams = {
    page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({clearOnDefault: true}),

    pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({clearOnDefault: true}),
};

//http://localhost:3000/workflows?page=2