import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Power Track",
        short_name: "PowerTrack",
        description:
            "A web application for tracking power usage and statistics.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        orientation: "portrait",
        icons: [
            {
                src: "/statistic_144.png",
                sizes: "144x144",
                type: "image/png",
            },
            {
                src: "/statistic_256.png",
                sizes: "256x256",
                type: "image/png",
            },
            {
                src: "/statistic_192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/statistic_512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        screenshots: [
            {
                src: "/screenshot-mobile.png",
                sizes: "360x640",
                type: "image/png",
            },
            {
                src: "/screenshot-desktop.png",
                sizes: "1280x720",
                type: "image/png",
                form_factor: "wide",
            },
        ],
    };
}
