import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Users, 
  Shield, 
  Zap, 
  MessageCircle, 
  Coins, 
  Image as ImageIcon,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const Demo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Connect Your TON Wallet",
      description: "Start by connecting your TON wallet using TON Connect. This enables secure authentication and transactions.",
      icon: <Wallet className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Browse Micro-Communities",
      description: "Explore various threads across different categories like Development, Art, Finance, Gaming, and more.",
      icon: <Users className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Choose Your Entry Method",
      description: "Join threads by either paying TON tokens or proving ownership of required NFTs/SBTs.",
      icon: <Shield className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Get Telegram Access",
      description: "Once verified, receive an invite link to join the private Telegram group instantly.",
      icon: <MessageCircle className="h-8 w-8" />,
      color: "from-green-500 to-green-600"
    }
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Instant verification and group access powered by TON blockchain"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Smart contract verification ensures only qualified members join"
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: "Flexible Payment",
      description: "Pay with TON tokens or verify NFT ownership"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Quality Communities",
      description: "Token-gated access ensures high-quality community members"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How TON Threads{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Experience the future of token-gated communities
            </p>
          </motion.div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Interactive Demo
            </h2>
            
            {/* Step Indicator */}
            <div className="flex justify-center mb-12">
              <div className="flex space-x-4">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Step */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center mb-12"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${demoSteps[currentStep].color} text-white mb-6`}>
                {demoSteps[currentStep].icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {demoSteps[currentStep].title}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {demoSteps[currentStep].description}
              </p>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Why Choose TON Threads?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Built on Cutting-Edge Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">TON Blockchain</h3>
                <p className="text-gray-600">
                  Ultra-fast, scalable blockchain with low fees for seamless transactions and smart contract interactions.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Contracts</h3>
                <p className="text-gray-600">
                  Secure, audited smart contracts for payment processing and NFT verification with full transparency.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Telegram Integration</h3>
                <p className="text-gray-600">
                  Seamless integration with Telegram for instant private group access and community management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Perfect for Every Community
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Coins className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Token-Gated Access</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Premium trading groups</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Exclusive developer communities</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>VIP investment circles</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Educational course access</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <ImageIcon className="h-8 w-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">NFT-Gated Access</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>NFT holder communities</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Artist collaboration spaces</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Gaming guild access</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Collector communities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join the Future of Communities?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start exploring exclusive micro-communities powered by TON blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
              <span>Explore Threads</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
              <span>Learn More</span>
              <ExternalLink className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;