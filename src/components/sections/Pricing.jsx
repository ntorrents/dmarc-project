import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 99,
      description: 'Perfect for small businesses getting started with email security',
      features: [
        '1 Domain',
        '1 User',
        'Weekly Email Reports',
        'DMARC Policy: Monitor',
        'Manual SPF/DKIM Setup',
        'Email Support',
        'Basic Incident Alerts'
      ],
      popular: false,
      cta: 'Start Basic Plan'
    },
    {
      name: 'Standard',
      price: 199,
      description: 'Ideal for growing businesses with multiple domains',
      features: [
        '3 Domains',
        '5 Users',
        'Daily Email Reports',
        'DMARC Policy: Quarantine',
        'Assisted SPF/DKIM Setup',
        'Threat Intelligence',
        'Email & Chat Support',
        'API Access',
        'Advanced Incident Alerts',
        'Custom Reports'
      ],
      popular: true,
      cta: 'Start Standard Plan'
    },
    {
      name: 'Premium',
      price: 299,
      description: 'Enterprise-grade security for large organizations',
      features: [
        'Unlimited Domains',
        '10 Users',
        'Real-time Email Reports',
        'DMARC Policy: Reject',
        'Automated SPF/DKIM Setup',
        'Advanced Threat Intelligence',
        'Priority Support',
        'Full API Access',
        'Enterprise Incident Alerts',
        'Custom Reports & Analytics',
        'Dedicated Account Manager'
      ],
      popular: false,
      cta: 'Start Premium Plan'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your organization. All plans include our core 
            email security features with 30-day money-back guarantee.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`card h-full ${plan.popular ? 'border-primary-200 shadow-xl' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/checkout?plan=${plan.name}`}
                  className={`block w-full text-center ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">30-Day</div>
                <div className="text-gray-600">Money-back guarantee</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-gray-600">Security monitoring</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing