// "use client";

// import React, { createContext, useContext, useState } from "react";

// type SidebarContextType = {
//     collapsed: boolean;
//     setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const SidebarContext = createContext<SidebarContextType | undefined>(
//     undefined
// );

// export const SidebarProvider = ({
//     children,
// }: {
//     children: React.ReactNode;
// }) => {
//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <SidebarContext.Provider
//             value={{
//                 collapsed,
//                 setCollapsed,
//             }}
//         >
//             {children}
//         </SidebarContext.Provider>
//     );
// };

// export const useSidebar = () => {
//     const context = useContext(SidebarContext);

//     if (!context) {
//         throw new Error("useSidebar must be used inside SidebarProvider");
//     }

//     return context;
// };


"use client";

import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(
    undefined
);

export const SidebarProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <SidebarContext.Provider
            value={{
                collapsed,
                setCollapsed,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("useSidebar must be used inside SidebarProvider");
    }

    return context;
};