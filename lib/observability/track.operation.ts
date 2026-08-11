import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
    powertrack_errors_total,
    powertrack_in_flight_requests,
    powertrack_request_duration_seconds,
    powertrack_requests_total,
} from "@/lib/observability/metrics";

type TrackOptions = {
    operation: string;
    method?: string;
};

export async function trackOperation<T>(
    fn: () => Promise<T>,
    options: TrackOptions,
): Promise<T> {
    const method = options.method ?? "server_action";
    const route = options.operation;

    powertrack_in_flight_requests.inc({ method, route });

    const start = process.hrtime.bigint();

    try {
        const result = await fn();

        const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;

        powertrack_requests_total.inc({
            method,
            route,
            status_code: "200",
        });

        powertrack_request_duration_seconds.observe(
            { method, route, status_code: "200" },
            durationSeconds,
        );

        return result;
    } catch (error) {
        const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;

        if (isRedirectError(error)) {
            powertrack_requests_total.inc({
                method,
                route,
                status_code: "303",
            });

            powertrack_request_duration_seconds.observe(
                { method, route, status_code: "303" },
                durationSeconds,
            );

            throw error;
        }

        powertrack_errors_total.inc({
            method,
            route,
            status_code: "500",
        });

        powertrack_requests_total.inc({
            method,
            route,
            status_code: "500",
        });

        powertrack_request_duration_seconds.observe(
            { method, route, status_code: "500" },
            durationSeconds,
        );

        throw error;
    } finally {
        powertrack_in_flight_requests.dec({ method, route });
    }
}
