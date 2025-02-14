import { BrowserRouter, Route, Routes } from "react-router-dom";
// pages....
import { CreatePostPage, PostsListPage, UpdatePostPage } from "../pages";

// -------------------------------------------------------------------------------------------------------------------------------
export default function PageRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PostsListPage />}></Route>
                <Route path="/create-post" element={<CreatePostPage />}></Route>
                <Route path="/update-post/:postId" element={<UpdatePostPage />}></Route>
            </Routes>
      </BrowserRouter>
    )
}