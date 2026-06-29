import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Delete } from 'lucide-react';

export default function Verification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(150); // 150 seconds = 2 mins 30 secs
  const activeInputIndex = useRef(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (num) => {
    const newOtp = [...otp];
    let nextIndex = activeInputIndex.current;

    if (num === 'backspace') {
      if (otp[nextIndex] === '' && nextIndex > 0) {
        newOtp[nextIndex - 1] = '';
        nextIndex = nextIndex - 1;
      } else {
        newOtp[nextIndex] = '';
      }
    } else {
      newOtp[nextIndex] = num.toString();
      if (nextIndex < 3) {
        nextIndex = nextIndex + 1;
      }
    }

    setOtp(newOtp);
    activeInputIndex.current = nextIndex;
    
    // Focus the appropriate input element
    if (inputRefs[nextIndex]?.current) {
      inputRefs[nextIndex].current.focus();
    }
  };

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); // Get last char
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      activeInputIndex.current = index + 1;
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 4) {
      // Mock verification - go to home
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col justify-between p-6 overflow-hidden">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => navigate('/signup')}
            className="p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 active:scale-95 transition-all text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-400 font-mono">Langkah 2 dari 2</span>
        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verifikasi</h1>
          <p className="text-gray-500 text-sm mt-2">
            Kami telah mengirimkan kode verifikasi ke
          </p>
          <p className="text-gray-800 font-semibold text-sm mt-1">{localStorage.getItem('user_email') || 'nama@email.com'}</p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-4 mt-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={digit}
              onFocus={() => { activeInputIndex.current = idx; }}
              onChange={(e) => handleInputChange(e, idx)}
              className="w-14 h-14 text-center text-2xl font-extrabold border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-2xl outline-none transition-all"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Tidak menerima kode?{' '}
            {timeLeft > 0 ? (
              <span className="text-orange-500 font-bold">{formatTime(timeLeft)}</span>
            ) : (
              <button 
                onClick={() => setTimeLeft(150)} 
                className="text-orange-500 hover:text-orange-650 font-bold underline transition-colors"
              >
                Kirim ulang kode
              </button>
            )}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.join('').length < 4}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:shadow-none active:scale-98 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/20 mt-6 transition-all"
        >
          Verifikasi
        </button>
      </div>

      {/* Static Custom Keypad */}
      <div className="bg-gray-50 -mx-6 -mb-6 p-6 rounded-t-[2.5rem] border-t border-gray-150">
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="py-3 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 text-xl font-bold rounded-2xl shadow-sm border border-gray-100 transition-all"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            {/* Empty spacer */}
          </div>
          <button
            type="button"
            onClick={() => handleKeyPress(0)}
            className="py-3 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 text-xl font-bold rounded-2xl shadow-sm border border-gray-100 transition-all"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('backspace')}
            className="py-3 bg-white hover:bg-gray-100 active:scale-95 text-red-500 flex items-center justify-center rounded-2xl shadow-sm border border-gray-100 transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
