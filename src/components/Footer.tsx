import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-10">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Help Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">HELP</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">Contact Us</Link></li>
                            <li><Link href="#" className="hover:underline">Delivery Information</Link></li>
                            <li><Link href="#" className="hover:underline">Customer Service</Link></li>
                            <li><Link href="#" className="hover:underline">Returns Policy</Link></li>
                            <li><Link href="#" className="hover:underline">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* About Us Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">ABOUT US</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">About Us</Link></li>
                            <li><Link href="#" className="hover:underline">Our Social Purpose</Link></li>
                            <li><Link href="#" className="hover:underline">Student Discount</Link></li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">LEGAL</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">Terms & Conditions</Link></li>
                            <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:underline">Cookie Preferences</Link></li>
                        </ul>
                    </div>

                    {/* Payment Methods and Reviews Section */}
                    <div className="space-y-4">
                        {/* Payment Methods */}
                        <div className="relative w-full h-40">
                            <Image
                                src={'/payments.webp'}
                                alt="Payment gateway"
                                layout="fill"
                                objectFit="contain"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm">
                    {/* Social Media Icons */}
                    <div className="flex space-x-4 mb-4 sm:mb-0">
                        <Link href="#"><Image src="/images/facebook.webp" alt="Facebook" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/x.webp" alt="X" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/youtube.webp" alt="YouTube" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/instagram.webp" alt="Instagram" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/pinterest.webp" alt="Pinterest" width={24} height={24} /></Link>
                        <Link href="#"><Image src="/images/tiktok.png" alt="TikTok" width={24} height={24} /></Link>
                    </div>

                    {/* Copyright */}
                    <p className="text-center sm:text-left mb-4 sm:mb-0">
                        © 2025 Borcelle Perfumes Limited
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;