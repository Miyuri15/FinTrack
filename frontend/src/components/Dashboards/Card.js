export default function Card({ title, value, icon }) {
    return (
      <div className="bg-[#e6f2f9] dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center gap-4">
        <div className="text-blue-600 dark:text-blue-400 text-3xl">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-text-light dark:text-gray-300">{title}</h2>
          <p className="text-2xl font-bold text-text-light dark:text-white">{value}</p>
        </div>
      </div>
    );
  }