"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { createBill } from "@/services/bill.services";

import { parseBillFile } from "@/lib/bill/tools/bill.file.parser";

import { AddressesProps } from "@/components/address/addresses";
const CreateBillForm = ({
    primaryAddress,
    getFile,
}: {
    primaryAddress: AddressesProps | null;
    getFile: (fileData: File | null) => void;
}) => {
    const router = useRouter();
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [dayConsumption, setDayConsumption] = useState("");
    const [nightConsumption, setNightConsumption] = useState("");
    const [total, setTotal] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [pending, setPending] = useState(false);
    const [isConverted, setIsConverted] = useState(false);
    const [errors, setErrors] = useState({
        month: "",
        year: "",
        dayConsumption: "",
        nightConsumption: "",
        total: "",
        file: "",
    });

    useEffect(() => {
        if (!file) {
            return;
        }

        const parseFile = async () => {
            try {
                const {
                    parsedPeriod,
                    parsedDayCons,
                    parsedNightCons,
                    parsedTotal,
                } = await parseBillFile(file);

                setIsConverted(false);
                setMonth(parsedPeriod.month);
                setYear(parsedPeriod.year);
                setDayConsumption(parsedDayCons);
                setNightConsumption(parsedNightCons);
                setTotal(parsedTotal);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to parse the bill file",
                );
            }
        };

        parseFile();
    }, [file]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 9 + i);

    const submitHandler = async (
        e: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        const data = {
            month: Number(month),
            year: Number(year),
            period: new Date(Date.UTC(Number(year), Number(month) - 1, 1)),
            day_consumption_kwh: Number(dayConsumption),
            night_consumption_kwh: Number(nightConsumption),
            total: Number(total),
            addressId: primaryAddress?.id || "",
        };

        setPending(true);
        try {
            await createBill(data);
            router.push("/bills");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create bill",
            );
        } finally {
            setPending(false);
            setIsConverted(false);
        }
    };

    const monthChangeHandler = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        setMonth(e.target.value);
        setErrors((prev) => ({
            ...prev,
            month: validateMonth(e.target.value),
        }));
    };
    const validateMonth = (month: string): string => {
        const monthNumber = Number(month);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return "Month must be between 1 and 12";
        }
        return "";
    };

    const yearChangeHandler = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        setYear(e.target.value);
        setErrors((prev) => ({
            ...prev,
            year: validateYear(e.target.value),
        }));
    };
    const validateYear = (year: string): string => {
        const yearNumber = Number(year);
        if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 2100) {
            return "Year must be between 1900 and 2100";
        }
        return "";
    };

    const dayConsChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setDayConsumption(e.target.value);
        setErrors((prev) => ({
            ...prev,
            dayConsumption: validateDayCons(e.target.value),
        }));
    };
    const validateDayCons = (day_consumption_kwh: string): string => {
        const dayConsNumber = Number(day_consumption_kwh);
        if (isNaN(dayConsNumber) || dayConsNumber < 0) {
            return "Day consumption must be a positive number";
        }
        return "";
    };

    const nightConsChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setNightConsumption(e.target.value);
        setErrors((prev) => ({
            ...prev,
            nightConsumption: validateNightCons(e.target.value),
        }));
    };
    const validateNightCons = (night_consumption_kwh: string): string => {
        const nightConsNumber = Number(night_consumption_kwh);
        if (isNaN(nightConsNumber) || nightConsNumber < 0) {
            return "Night consumption must be a positive number";
        }
        return "";
    };

    const totalChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setTotal(e.target.value);
        setIsConverted(false);
        setErrors((prev) => ({
            ...prev,
            total: validateTotal(e.target.value),
        }));
    };
    const validateTotal = (total: string): string => {
        const totalNumber = Number(total);
        if (isNaN(totalNumber) || totalNumber < 0) {
            return "Bill must be a positive number";
        }
        const decimalRegex = /^\d+(\.\d{1,2})?$/;
        if (!decimalRegex.test(total)) {
            return "Bill can have at most 2 decimal places";
        }
        return "";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = e.dataTransfer.files[0] ?? null;
        const fileError = validateFile(droppedFiles);
        setErrors((prev) => ({ ...prev, file: fileError }));
        getFile(fileError ? null : droppedFiles);
        setFile(fileError ? null : droppedFiles);
    };

    const fileChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const selected = e.target.files?.[0] ?? null;
        const fileError = validateFile(selected);
        setErrors((prev) => ({ ...prev, file: fileError }));
        getFile(fileError ? null : selected);
        setFile(fileError ? null : selected);
    };
    const validateFile = (file: File | null | undefined): string => {
        const allowedTypes = ["application/pdf"];
        if (!file) {
            return "Please select a file!";
        }
        if (!allowedTypes.includes(file.type)) {
            return "Only pdf formats are allowed.";
        }
        return "";
    };

    const isFormValid =
        month &&
        year &&
        dayConsumption &&
        nightConsumption &&
        total &&
        !errors.month &&
        !errors.year &&
        !errors.dayConsumption &&
        !errors.nightConsumption &&
        !errors.total;

    const ConvertToEuro = () => {
        const totalNumber = Number(total);
        if (isNaN(totalNumber) || totalNumber <= 0) {
            return;
        }
        const convertedTotal = (totalNumber / 1.95583).toFixed(2);
        setTotal(convertedTotal);
        setErrors((prev) => ({
            ...prev,
            total: validateTotal(convertedTotal),
        }));
        setIsConverted(true);
    };

    return (
        <form className="space-y-6" onSubmit={submitHandler}>
            {primaryAddress ? (
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        value={primaryAddress.address || ""}
                        disabled
                    />
                </div>
            ) : (
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        value="Loading..."
                        disabled
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="month"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Month *
                    </label>
                    <select
                        id="month"
                        name="month"
                        required
                        value={month}
                        onChange={monthChangeHandler}
                        className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    >
                        <option value="" disabled>
                            Select Month
                        </option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                {errors.month && (
                    <p className="text-red-500 text-xs mt-2">{errors.month}</p>
                )}

                <div>
                    <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Year *
                    </label>
                    <select
                        id="year"
                        name="year"
                        required
                        value={year}
                        onChange={yearChangeHandler}
                        className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    >
                        <option value="" disabled>
                            Select Year
                        </option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.year && (
                    <p className="text-red-500 text-xs mt-2">{errors.year}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="day_consumption_kwh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Day Consumption (kWh) *
                    </label>
                    <input
                        type="number"
                        id="day_consumption_kwh"
                        name="day_consumption_kwh"
                        required
                        className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        placeholder="123"
                        onChange={dayConsChangeHandler}
                        value={dayConsumption}
                    />
                    {errors.dayConsumption && (
                        <p className="text-red-500 text-xs mt-2">
                            {errors.dayConsumption}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="night_consumption_kwh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Night Consumption (kWh) *
                    </label>
                    <input
                        type="number"
                        id="night_consumption_kwh"
                        name="night_consumption_kwh"
                        required
                        className="w-full px-1 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        placeholder="123"
                        onChange={nightConsChangeHandler}
                        value={nightConsumption}
                    />
                    {errors.nightConsumption && (
                        <p className="text-red-500 text-xs mt-2">
                            {errors.nightConsumption}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div>
                    <label
                        htmlFor="total"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Bill *{" "}
                        <span className="text-red-500">
                            &#40; in &euro; &#41;
                        </span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        id="total"
                        name="total"
                        required
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        placeholder="Enter bill amount"
                        onChange={totalChangeHandler}
                        value={total}
                    />
                    {errors.total && (
                        <p className="text-red-500 text-xs mt-2">
                            {errors.total}
                        </p>
                    )}
                </div>

                <div>
                    <div
                        className="mt-1 flex items-baseline
                     gap-2"
                    >
                        <p className="text-xs text-gray-500 mt-2">
                            If your bill is in BGN you can convert it to € using
                            the button
                        </p>
                        <button
                            type="button"
                            className="text-xs px-1 bg-gray-400 text-white rounded-sm hover:bg-gray-500"
                            onClick={ConvertToEuro}
                            disabled={isConverted}
                            style={
                                isConverted
                                    ? {
                                          cursor: "not-allowed",
                                          backgroundColor: "#999",
                                      }
                                    : {}
                            }
                        >
                            Convert
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="col-span-full "
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <label
                    htmlFor="upload pdf"
                    className="block text-sm font-medium text-gray-700"
                >
                    or Upload PDF of the Bill (optional)
                </label>
                <span className="text-gray-500 text-xs">
                    (only for <strong>ENERGO-PRO</strong> Bulgaria customers for
                    now)
                </span>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                            <label
                                htmlFor="file"
                                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input
                                    id="file"
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    className="sr-only"
                                    onChange={fileChangeHandler}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/5 text-gray-600">PDF up to 5MB</p>
                        {errors.file && (
                            <p className="text-red-500 text-xs mt-2">
                                {errors.file}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-5">
                <button
                    type="submit"
                    disabled={pending || !isFormValid}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    style={
                        !isFormValid || pending
                            ? {
                                  cursor: "not-allowed",
                                  backgroundColor: "#999",
                              }
                            : {}
                    }
                >
                    {pending ? "Adding..." : "Add Bill"}
                </button>
                <Link
                    href="/bills"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
};

export default CreateBillForm;
