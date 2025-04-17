import React from "react"; 
import Header from "../components/header";
import Login from "../views/sign-in/Login";


export const routes = [
    {
        path: "*",
        element: <Header/>,
        isprivate: false,
    },
    {
        path: "/",
        element: <Login/>,
        isprivate: false,
    },
 
];