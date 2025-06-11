import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Shield, Mail, Lock, Eye } from 'lucide-react'

const Accordion = () => {
  const [activePanel, setActivePanel] = useState(0)

  const panels = [
    {
      title: 'DMARC Protection',
      icon: Shield,
      content: 'DMARC (Domain-based Message Authentication, Reporting & Conformance) is an email authentication protocol that helps protect your domain from email spoofing and phishing attacks. It builds upon SPF and DKIM to provide comprehensive email security by allowing domain owners to specify how unauthenticated emails should be handled.'
    },
    {
      title: 'SPF Authentication',
      icon: Mail,
      content: 'SPF (Sender Policy Framework) is an email authentication method that prevents spammers from sending messages on behalf of your domain. It works by publishing a list of authorized mail servers in your DNS records, allowing receiving servers to verify that incoming emails are from legitimate sources.'
    },
    {
      title: 'DKIM Signing',
      icon: Lock,
      content: 'DKIM (DomainKeys Identified Mail) adds a digital signature to your emails, ensuring message integrity and authenticity. This cryptographic signature allows receiving servers to verify that the email content hasn\'t been tampered with during transit and confirms the sender\'s identity.'
    },
    {
      title: 'Email Monitoring',
      icon: Eye,
      content: 'Continuous monitoring of your email authentication status provides real-time insights into your domain\'s security posture. Our advanced monitoring system tracks authentication failures, identifies potential threats, and provides detailed reports to help you maintain optimal email security.'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Email Security Fundamentals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding the core components of email authentication and protection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Illustration - Made bigger */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-primary rounded-full flex items-center justify-center relative overflow-hidden">
                <Shield className="w-40 h-40 text-white z-10" />
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </div>
              
              {/* Background glow */}
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl scale-110 -z-10" />
            </div>
          </motion.div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {panels.map((panel, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => setActivePanel(activePanel === index ? -1 : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                      <panel.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {panel.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: activePanel === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {activePanel === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed">
                          {panel.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Accordion