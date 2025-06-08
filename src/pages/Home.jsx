import { motion } from 'framer-motion'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import DomainChecker from '../components/sections/DomainChecker'
import Pricing from '../components/sections/Pricing'
import Benefits from '../components/sections/Benefits'
import Contact from '../components/sections/Contact'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <Services />
      <DomainChecker />
      <Pricing />
      <Benefits />
      <Contact />
    </motion.div>
  )
}

export default Home