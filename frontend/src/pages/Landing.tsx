import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Statement from '../components/Statement'
import Vault from '../components/Vault'
import Privacy from '../components/Privacy'
import Visits from '../components/Visits'
import Maps from '../components/Maps'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useReveal, useTextReveal } from '../hooks/useMotion'

/**
 * The marketing landing page — full editorial scroll experience.
 */
export default function Landing() {
  useSmoothScroll()
  useReveal()
  useTextReveal()

  return (
    <div className="bg-ink">
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Vault />
        <Visits />
        <Maps />
        <Privacy />
        <CTA />
      </main>
      <Footer variant="landing" />
    </div>
  )
}
