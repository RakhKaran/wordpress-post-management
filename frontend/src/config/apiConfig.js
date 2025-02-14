import { host_api } from "./envConfig";

// --------------------------------------------------------------------------------------------------------------------
export const endpoints = {
    posts : {
        create : `${host_api}/posts/create`,
        createBulk : `${host_api}/posts/bulk-create`,
        list : `${host_api}/posts/getAllPosts`,
        post : `${host_api}/posts/getSinglePost`,
        update : `${host_api}/posts/update`,
        delete : `${host_api}/posts/delete`,
    }
}