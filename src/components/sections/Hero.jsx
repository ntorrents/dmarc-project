import { motion } from 'framer-motion'
import { Shield, ArrowRight, CheckCircle } from 'lucide-react'

const Hero = () => {
  const features = [
    'Block phishing attacks',
    'Improve email deliverability',
    'Real-time monitoring',
    'Enterprise-grade security'
  ]

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden -mt-20 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Enterprise Badge - Moved to right side */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-24 right-8 z-20"
      >
        <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 rounded-full text-primary-200 text-sm font-medium backdrop-blur-sm border border-primary-400/30">
          <Shield className="w-4 h-4 mr-2" />
          Enterprise Email Security
        </div>
      </motion.div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Protect Your Email with{' '}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                SafeDMARC
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Block phishing, business email compromise, ransomware, and spam while 
              improving your email deliverability with our comprehensive DMARC solution.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="btn-primary group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                View Demo
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 pt-8 border-t border-gray-700"
            >
              <p className="text-gray-400 text-sm mb-4">Built for modern businesses</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-2xl font-bold">14-Day</div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-2xl font-bold">24/7</div>
              </div>
              <div className="flex items-center space-x-8 text-xs text-gray-500 mt-1">
                <div>Free Trial</div>
                <div>Uptime SLA</div>
                <div>Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Shield - Made smaller */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10 bg-gradient-primary rounded-3xl p-6 shadow-2xl w-48 h-48 flex items-center justify-center mx-auto"
              >
                <Shield className="w-20 h-20 text-white" />
              </motion.div>

              {/* Floating Elements - Made same size as main shield elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 w-20 h-20 flex flex-col items-center justify-center"
              >
                <div className="text-white text-sm font-medium">DMARC</div>
                <div className="text-primary-300 text-xs">Protected</div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  x: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 w-20 h-20 flex flex-col items-center justify-center"
              >
                <div className="text-white text-sm font-medium">SPF</div>
                <div className="text-primary-300 text-xs">Verified</div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  x: [0, 8, 0]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute top-1/2 -right-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 w-20 h-20 flex flex-col items-center justify-center"
              >
                <div className="text-white text-sm font-medium">DKIM</div>
                <div className="text-primary-300 text-xs">Signed</div>
              </motion.div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-primary-500/20 rounded-3xl blur-3xl scale-110 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero