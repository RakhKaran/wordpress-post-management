import {Helmet, HelmetProvider} from "react-helmet-async";
import { CreatePost } from "../sections";

// --------------------------------------------------------------------------------------------------------------
export default function CreatePostPage(){
    return(
        <HelmetProvider>
            <Helmet>
                <title>Create post</title>
                <meta name="description" content="Create a new post"/>
            </Helmet>
            <CreatePost/>
        </HelmetProvider>
    )
}