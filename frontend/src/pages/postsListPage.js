import { Helmet, HelmetProvider } from "react-helmet-async";
import { PostList } from "../sections";

// ----------------------------------------------------------------------------------------------------------
export default function PostsListPage(){
    return(
        <HelmetProvider>            
            <Helmet>
                <title>Posts List</title>
                <meta name="description" content="Post list" />
            </Helmet>
            <PostList />
        </HelmetProvider>
    )
}