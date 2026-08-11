import client from "prom-client";

type MetricsGlobal = {
    prometheusRegister?: client.Registry;
    prometheusInitialized?: boolean;
};

const globalForMetrics = globalThis as unknown as MetricsGlobal;

export const register =
    globalForMetrics.prometheusRegister ?? new client.Registry();

if (!globalForMetrics.prometheusRegister) {
    globalForMetrics.prometheusRegister = register;
}

if (!globalForMetrics.prometheusInitialized) {
    client.collectDefaultMetrics({ register });
    globalForMetrics.prometheusInitialized = true;
}

function getOrCreateCounter(
    name: string,
    help: string,
    labelNames: string[],
): client.Counter<string> {
    const existing = register.getSingleMetric(name) as
        | client.Counter<string>
        | undefined;
    if (existing) {
        return existing;
    }

    const metric = new client.Counter({
        name,
        help,
        labelNames,
        registers: [register],
    });

    return metric;
}

function getOrCreateHistogram(
    name: string,
    help: string,
    labelNames: string[],
    buckets: number[],
): client.Histogram<string> {
    const existing = register.getSingleMetric(name) as
        | client.Histogram<string>
        | undefined;
    if (existing) {
        return existing;
    }

    const metric = new client.Histogram({
        name,
        help,
        labelNames,
        buckets,
        registers: [register],
    });

    return metric;
}

function getOrCreateGauge(
    name: string,
    help: string,
    labelNames: string[],
): client.Gauge<string> {
    const existing = register.getSingleMetric(name) as
        | client.Gauge<string>
        | undefined;
    if (existing) {
        return existing;
    }

    const metric = new client.Gauge({
        name,
        help,
        labelNames,
        registers: [register],
    });

    return metric;
}

export const powertrack_requests_total = getOrCreateCounter(
    "powertrack_requests_total",
    "Total number of tracked PowerTrack operations",
    ["method", "route", "status_code"],
);

export const powertrack_request_duration_seconds = getOrCreateHistogram(
    "powertrack_request_duration_seconds",
    "Duration of tracked PowerTrack operations in seconds",
    ["method", "route", "status_code"],
    [0.05, 0.1, 0.2, 0.4, 0.8, 1.5, 3, 5],
);

export const powertrack_errors_total = getOrCreateCounter(
    "powertrack_errors_total",
    "Total number of tracked PowerTrack operation errors",
    ["method", "route", "status_code"],
);

export const powertrack_in_flight_requests = getOrCreateGauge(
    "powertrack_in_flight_requests",
    "Number of tracked PowerTrack operations currently in flight",
    ["method", "route"],
);
