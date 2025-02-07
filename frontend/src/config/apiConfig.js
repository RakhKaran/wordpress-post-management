import { host_api } from "./envConfig";

// --------------------------------------------------------------------------------------------------------------------
export const endpoints = {
    posts : {
        create : `${host_api}/posts/create`,
        list : `${host_api}/posts/getAllPosts`,
        update : `${host_api}/posts/update`,
        delete : `${host_api}/posts/delete`,
    }
}