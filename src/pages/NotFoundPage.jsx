import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import notFoundImage from '../assets/404.png';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-blue-50 p-4">
                <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl w-full text-center">
                    <div className="space-y-6">
                        <div className="flex flex-col items-center">
                            <img
                                className="w-64 h-64 object-contain mb-6"
                                src={notFoundImage}
                                alt="404 Not Found"
                            />
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Oops! Page Not Found
                            </h1>
                            <p className="text-gray-600 text-lg max-w-md">
                                We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <span className="material-symbols-outlined mr-2">arrow_back</span>
                                Go Back
                            </button>
                            <button
                                onClick={() => navigate('/home')}
                                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <span className="material-symbols-outlined mr-2">home</span>
                                Back to Home
                            </button>
                        </div>

                        <div className="text-gray-500 text-sm pt-4">
                            If you think this is a mistake, please contact support.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotFoundPage; 