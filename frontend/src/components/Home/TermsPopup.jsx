export default function TermsPopup({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Terms of Use</h2>
        <p className="mb-4">
          This project is provided as-is without any warranties. We reserve the right to terminate or modify the service at any time. Users are responsible for their own data and usage of the application.
        </p>
        <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Close
        </button>
      </div>
    </div>
  )
}