import Link from "next/link";

const EditBillButton = ({ id }: { id: string }) => {
    return (
        <Link
            className="text-green-600 hover:text-green-900 hover:cursor-pointer mr-2"
            href={`/bills/edit/${id}`}
        >
            Edit
        </Link>
    );
};

export default EditBillButton;
