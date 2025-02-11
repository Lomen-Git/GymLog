export default function Footer({ onContactClick, onTermsClick }) {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div>GymLog 2025</div>
        <div className="space-x-4">
          <button onClick={onContactClick} className="hover:text-white">Contact Us</button>
          <button onClick={onTermsClick} className="hover:text-white">Terms</button>
        </div>
      </div>
    </footer>
  )
}