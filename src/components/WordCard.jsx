export default function WordCard({ word, wordNumber, totalWords, isDarkMode }) {
  // Helper function to capitalize first letter
  const capitalizeFirst = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Helper function to capitalize first letter of each word in an array
  const capitalizeArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map(item => capitalizeFirst(item.trim()));
  };

  // Pronunciation function
  const pronounceWord = () => {
    console.log('Pronounce button clicked'); // Debug log
    
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser');
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Add event listeners
      utterance.onstart = () => {
        console.log('Speech started for:', word.word);
      };
      
      utterance.onend = () => {
        console.log('Speech ended for:', word.word);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        alert('Speech error: ' + event.error);
      };
      
      // Check if voices are loaded
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.length);
      
      if (voices.length === 0) {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
          console.log('Voices loaded, trying again');
          window.speechSynthesis.speak(utterance);
        };
      } else {
        // Voices already loaded
        console.log('Speaking immediately');
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error in pronounceWord:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className={`rounded-2xl shadow-xl p-8 mb-6 border hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 ${
        isDarkMode ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Word Number Badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
        #{wordNumber}
      </div>

      {/* Word Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {capitalizeFirst(word.word)}
            <span className={`text-lg ml-3 font-normal ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>({word.pos})</span>
          </h2>
          
          {/* Pronunciation Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked!');
              pronounceWord();
            }}
            className={`p-3 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            title="Click to hear pronunciation"
            style={{ zIndex: 10 }}
          >
            🔊
          </button>
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      {/* Bengali Translation */}
      <div className={`rounded-xl p-4 mb-6 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50'
      }`}>
        <p className={`text-lg ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <span className={`font-semibold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-700'
          }`}>🇧🇩 বাংলা:</span>
          <span className="ml-2 font-medium">{word.bengali}</span>
        </p>
      </div>

      {/* Explanation */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-3 flex items-center ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
          }`}>
            💡
          </span>
          Explanation
        </h3>
        <p className={`text-lg leading-relaxed pl-8 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {capitalizeFirst(word.Explanation)}
        </p>
      </div>

      {/* Synonyms and Antonyms Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Synonyms */}
        <div className={`rounded-xl p-4 ${
          isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            isDarkMode ? 'text-green-400' : 'text-green-800'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              ✅
            </span>
            Synonyms
          </h3>
          <div>
            {capitalizeArray(word.synonym).map((syn, index) => (
              <span
                key={index}
                className={`inline-block px-3 py-1 rounded-full text-sm mr-2 mb-2 border ${
                  isDarkMode 
                    ? 'bg-green-800/50 text-green-300 border-green-700' 
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}
              >
                {syn}
              </span>
            ))}
          </div>
        </div>

        {/* Antonyms */}
        <div className={`rounded-xl p-4 ${
          isDarkMode ? 'bg-red-900/30' : 'bg-red-50'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            isDarkMode ? 'text-red-400' : 'text-red-800'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              isDarkMode ? 'bg-red-900/50' : 'bg-red-100'
            }`}>
              ❌
            </span>
            Antonyms
          </h3>
          <div>
            {capitalizeArray(word.antonym).map((ant, index) => (
              <span
                key={index}
                className={`inline-block px-3 py-1 rounded-full text-sm mr-2 mb-2 border ${
                  isDarkMode 
                    ? 'bg-red-800/50 text-red-300 border-red-700' 
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}
              >
                {ant}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Example */}
      <div className={`rounded-xl p-6 border-l-4 border-purple-500 ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 flex items-center ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
          }`}>
            📝
          </span>
          Example
        </h3>
        <p className={`italic text-lg leading-relaxed pl-8 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          "{word.example}"
        </p>
      </div>

      {/* Progress Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${(wordNumber / totalWords) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
