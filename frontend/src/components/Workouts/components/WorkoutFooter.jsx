export const WorkoutFooter = ({ isMenuOpen, setIsMenuOpen, onComplete }) => (
    <div className="pt-4 border-t border-gray-700">
    <div className="flex justify-between items-center">
        <div className="relative">
        <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-white transition-colors"
        >
            <MoreVertical className="w-7 h-7" />
        </button>
        
        {isMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-32 
                        bg-gray-800 rounded-lg shadow-xl p-2">
            <button className="w-full p-2 text-left hover:bg-gray-700 rounded-md">
                Muokkaa
            </button>
            <button className="w-full p-2 text-left hover:bg-gray-700 rounded-md">
                Jaa
            </button>
            </div>
        )}
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 
                        bg-blue-600 hover:bg-blue-500 rounded-lg 
                        transition-colors">
        <Check className="w-6 h-6" />
        <span className="font-medium">Done</span>
        </button>
    </div>
    </div>
  )