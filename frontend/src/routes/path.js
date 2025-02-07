export const paths = {
    posts : {
        list : '/',
        create  : '/create-post',
        update : (postId) => `/update-post/${postId}`
    }
}