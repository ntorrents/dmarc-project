import { motion } from 'framer-motion'
import { Check, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 99,
      yearlyPrice: 990,
      description: 'Perfect for small businesses getting started with email security',
      features: [
        '1 Domain',
        '1 User',
        'Weekly Email Reports',
        'DMARC Policy: Monitor',
        'Manual SPF/DKIM Setup',
        'Email Support',
        'Basic Incident Alerts',
        'DNS Toolbox Access'
      ],
      popular: false
    },
    {
      name: 'Standard',
      price: 199,
      yearlyPrice: 1990,
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
        'Custom Reports',
        'Forensic Analysis'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: 299,
      yearlyPrice: 2990,
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
        'Dedicated Account Manager',
        'White-label Options'
      ],
      popular: false
    }
  ]

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Domains', basic: '1', standard: '3', premium: 'Unlimited' },
        { name: 'Users', basic: '1', standard: '5', premium: '10' },
        { name: 'Email Reports', basic: 'Weekly', standard: 'Daily', premium: 'Real-time' },
        { name: 'DMARC Policy', basic: 'Monitor', standard: 'Quarantine', premium: 'Reject' },
        { name: 'SPF/DKIM Setup', basic: 'Manual', standard: 'Assisted', premium: 'Automated' }
      ]
    },
    {
      category: 'Security & Intelligence',
      items: [
        { name: 'Threat Intelligence', basic: false, standard: true, premium: true },
        { name: 'Forensic Reports', basic: false, standard: true, premium: true },
        { name: 'Advanced Analytics', basic: false, standard: false, premium: true },
        { name: 'Custom Reports', basic: false, standard: true, premium: true }
      ]
    },
    {
      category: 'Support & Access',
      items: [
        { name: 'Support', basic: 'Email', standard: 'Email & Chat', premium: 'Priority Support' },
        { name: 'API Access', basic: false, standard: true, premium: true },
        { name: 'Incident Alerts', basic: 'Basic', standard: 'Advanced', premium: 'Enterprise' },
        { name: 'Account Manager', basic: false, standard: false, premium: true }
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your organization. All plans include our core 
              email security features with 30-day money-back guarantee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                      <div className="text-sm text-gray-500 mt-1">
                        or ${plan.yearlyPrice}/year (save 17%)
                      </div>
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

                  <div className="space-y-3">
                    <Link
                      to={`/checkout?plan=${plan.name}`}
                      className={`block w-full text-center ${
                        plan.popular ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      Start {plan.name} Plan
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Link>
                    <button className="w-full text-center text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      Start Free Trial
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Detailed Feature Comparison
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">Basic</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">Standard</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((category, categoryIndex) => (
                      <React.Fragment key={category.category}>
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="py-3 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6 text-gray-700">{item.name}</td>
                            <td className="py-4 px-6 text-center">
                              {typeof item.basic === 'boolean' ? (
                                item.basic ? (
                                  <Check className="w-5 h-5 text-primary-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-gray-700">{item.basic}</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              {typeof item.standard === 'boolean' ? (
                                item.standard ? (
                                  <Check className="w-5 h-5 text-primary-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-gray-700">{item.standard}</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              {typeof item.premium === 'boolean' ? (
                                item.premium ? (
                                  <Check className="w-5 h-5 text-primary-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-gray-700">{item.premium}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600">Yes, all plans come with a 14-day free trial. No credit card required to start.</p>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-2">What's included in support?</h4>
                <p className="text-gray-600">All plans include email support. Standard and Premium plans include chat and phone support.</p>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer custom plans?</h4>
                <p className="text-gray-600">Yes, we offer custom enterprise plans for organizations with specific requirements.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Pricing