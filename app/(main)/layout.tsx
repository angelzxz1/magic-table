"use client";
import { DeckProvider } from "@/components/deck-provider";
import { CheckSession } from "@/components/session-validation";
import { NavBar } from "@/components/ui/nav-bar";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { store } from "@/store/store";
import { Provider } from "react-redux";
interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Provider store={store}>
            <EdgeStoreProvider>
                <CheckSession>
                    <DeckProvider>
                        <NavBar />
                        <div className=" w-full flex h-full justify-center items-center ">
                            <div className=" max-w-7xl w-full h-full">
                                {children}
                            </div>
                        </div>
                    </DeckProvider>
                </CheckSession>
            </EdgeStoreProvider>
        </Provider>
    );
};

export default Layout;
