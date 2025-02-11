import { useState } from 'react'
import Footer from '../Footer/Footer'
import ContactPopup from './ContactPopup'
import TermsPopup from './TermsPopup'

export default function Homepage() {
  const [showContact, setShowContact] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  return (
    <div className="min-h-screen flex flex-col text-white">
      <main className="flex-grow p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center mb-12">Welcome to GymLog</h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Track Your Progress</h2>
            <p>GymLog helps you create and manage your workout programs efficiently. Plan your exercises, track progress, and achieve your fitness goals.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create custom workout programs</li>
              <li>Track weights and repetitions</li>
              <li>Monitor your progress over time</li>
              <li>Simple and intuitive interface</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer onContactClick={() => setShowContact(true)} onTermsClick={() => setShowTerms(true)} />
      <ContactPopup isOpen={showContact} onClose={() => setShowContact(false)} />
      <TermsPopup isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  )
}