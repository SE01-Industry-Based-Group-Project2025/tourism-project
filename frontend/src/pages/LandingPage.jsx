import React from 'react'
import Header    from '../components/landing/Header'
import Intro     from '../components/landing/intro'
import About     from '../components/landing/about'
import Packages  from '../components/landing/Packages'
import Gallery   from '../components/landing/Gallery'
import FAQ       from '../components/landing/FAQ'
import Contact   from '../components/landing/Contact'
import Footer    from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Intro />
        <About />
        <Packages />
        <Gallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
