import { redirect } from "next/navigation";

import { findPrimaryAddress } from "@/services/address.services";

export default async function WithPrimaryLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const primaryAddress = await findPrimaryAddress();

    if (!primaryAddress) {
        redirect("/address");
    }

    return <>{children}</>;
}
