const ProgramListView = ({ programs, onProgramSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {programs.map((program) => (
        <div
          key={program.id}
          onClick={() => onProgramSelect(program.id)}
          className="group relative bg-gray-800 rounded-xl shadow-xl p-6 cursor-pointer transition-all duration-300 hover:bg-gray-750 hover:shadow-2xl hover:-translate-y-1"
        >
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-indigo-700 text-indigo-100 px-3 py-1 rounded-full text-sm font-medium z-10">
            {program.choice === 1 ? 'RPM' : program.choice === 2 ? '%' : '-'}
          </div>

          {/* Content - Lisätty ylimääräinen relative ja z-index */}
          <div className="flex flex-col h-full">
            {/* Title with truncation - Päivitetty padding oikealle */}
            <h3 className="text-gray-100 text-xl font-semibold mb-3 pr-12 truncate">
              {program.name}
            </h3>

            {/* Dates with icons */}
            <div className="mt-auto space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  Created: {new Date(program.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  Updated: {new Date(program.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Hover overlay - Päivitetty z-index */}
          <div className="absolute inset-0 rounded-xl border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />
        </div>
      ))}
    </div>
  )
}

export default ProgramListView