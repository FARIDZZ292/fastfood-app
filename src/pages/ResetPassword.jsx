import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col justify-between p-6 overflow-hidden">
      <div>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => navigate('/login')}
            className="p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 active:scale-95 transition-all text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-400">Reset Akses</span>
        </div>

        {!submitted ? (
          <>
            <div className="mt-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-left">Atur Ulang Sandi</h1>
              <p className="text-gray-500 text-sm mt-2 text-left">
                Masukkan alamat email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">Alamat Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all"
              >
                Kirim Instruksi
              </button>
            </form>
          </>
        ) : (
          <div className="mt-12 text-center flex flex-col items-center">
            <div className="bg-green-50 p-4 rounded-full text-green-500 mb-4 animate-bounce">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Periksa Email Anda</h2>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
              Kami telah mengirimkan tautan ke <span className="font-semibold text-gray-800">{email}</span> untuk membantu Anda mengatur ulang kata sandi.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/20 mt-8 transition-all"
            >
              Kembali ke Login
            </button>
          </div>
        )}
      </div>

      <div className="text-center pt-6">
        <p className="text-gray-500 text-sm">
          Ingat kata sandinya?{' '}
          <button onClick={() => navigate('/login')} className="text-orange-500 font-bold hover:underline">
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
