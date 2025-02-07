import { Helmet, HelmetProvider } from "react-helmet-async";
import { UpdatePost } from "../sections";

// ----------------------------------------------------------------------------------------------------------
export default function UpdatePostPage(){
    return(
        <HelmetProvider>            
            <Helmet>
                <title>Update Post</title>
                <meta name="description" content="Update post list" />
            </Helmet>
            <UpdatePost />
        </HelmetProvider>
    )
}