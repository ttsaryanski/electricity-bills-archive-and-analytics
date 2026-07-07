import Link from "next/link";

const HomePage = async () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Bills history and analytics
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Optimize the management of your electricity bills with
                        our powerful and easy-to-use system. Track your bills,
                        monitor consumption and get valuable insights.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
