"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
    BarChart3,
    Package,
    Plus,
    Bolt,
    UserLock,
    LocateFixed,
    Euro,
} from "lucide-react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const NavigationBar = () => {
    const currentPath = usePathname();

    const navigation = [
        {
            name: "Dashboard",
            href: "/dashboard",
            current: false,
            icon: BarChart3,
        },
        // {
        //     name: "Inventory",
        //     href: "/inventory",
        //     current: false,
        //     icon: Package,
        // },
        {
            name: "Bills",
            href: "/bills",
            current: false,
            icon: Euro,
        },
        // {
        //     name: "Add Product",
        //     href: "/add-product",
        //     current: false,
        //     icon: Plus,
        // },
        {
            name: "Add Bill",
            href: "/add-bill",
            current: false,
            icon: Plus,
        },
        {
            name: "Address",
            href: "/address",
            current: false,
            icon: LocateFixed,
        },
    ];
    navigation.reduce((acc, item) => {
        if (item.href === currentPath) {
            item.current = true;
        }
        return acc;
    }, null);

    return (
        <Disclosure
            as="nav"
            className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
        >
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                                aria-hidden="true"
                                className="block size-6 group-data-open:hidden"
                            />
                            <XMarkIcon
                                aria-hidden="true"
                                className="hidden size-6 group-data-open:block"
                            />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center space-x-2">
                            <Link href="/">
                                <Bolt color="#03071280" className="h-7 w-7" />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            prefetch={false}
                                            aria-current={
                                                item.current
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={classNames(
                                                item.current
                                                    ? "bg-gray-950/50 text-white"
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                                                "flex items-center rounded-md px-1 py-2 text-sm font-normal",
                                            )}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button
                            type="button"
                            className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="size-6" />
                        </button>

                        <SignedIn>
                            <div className="relative ml-3">
                                <div className="flex items-center justify-between text-gray-950/50 hover:text-gray-950/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    <UserButton />
                                </div>
                            </div>
                        </SignedIn>
                        {/* Profile dropdown */}
                        <SignedOut>
                            <Menu as="div" className="relative ml-3">
                                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    <Link
                                        href="/sign-in"
                                        className="bg-gray-950/50 text-white px-3 py-2 text-sm font-medium rounded-lg font-semibold hover:bg-gray-700/50 transition-colors"
                                    >
                                        <UserLock className="w-5 h-5" />
                                    </Link>
                                </MenuButton>
                            </Menu>
                        </SignedOut>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                                item.current
                                    ? "bg-gray-950/50 text-white"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                                "block rounded-md px-3 py-2 text-base font-medium",
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default NavigationBar;
