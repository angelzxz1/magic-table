"use client";
interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className=" w-full flex h-full justify-center items-center ">
            <div className=" max-w-7xl w-full h-full">{children}</div>
        </div>
    );
};

export default Layout;
