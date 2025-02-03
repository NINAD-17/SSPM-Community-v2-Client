const Footer = () => {
    return (
        <div className="mt-3">
            <div className="text-sm text-gray-500 flex flex-wrap gap-x-2 justify-center mx-14">
                <p>
                    <a className="hover:underline hover:text-gray-800" href="">
                        About
                    </a>
                </p>
                <p>
                    <a className="hover:underline hover:text-gray-800" href="">
                        Feedback
                    </a>
                </p>
                <p>
                    <a className="hover:underline hover:text-gray-800" href="">
                        Contact to admin
                    </a>
                </p>
                <p>
                    <a className="hover:underline hover:text-gray-800" href="">
                        Report
                    </a>
                </p>
            </div>
            <div className="flex text-xs items-center space-x-1 justify-center">
                <h4 className="font-bold text-sm text-blue-700">
                    SSPM COMMUNITY
                </h4>
                <p className="text-gray-700">&copy;2025</p>
            </div>
        </div>
    );
};

export default Footer;
