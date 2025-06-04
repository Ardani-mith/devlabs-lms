'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SocialLogin() {
  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    try {
      // TODO: Implement actual social login logic here
      console.log(`Logging in with ${provider}...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* Google Login Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSocialLogin('google')}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        <Image
          src="/images/google-logo.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-gray-700">Google</span>
      </motion.button>

      {/* Microsoft Login Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSocialLogin('microsoft')}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        <Image
          src="/images/microsoft-logo.svg"
          alt="Microsoft"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-gray-700">Microsoft</span>
      </motion.button>
    </div>
  );
} 