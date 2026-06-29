import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  
  // Indonesian Address format fields
  const [street, setStreet] = useState('');
  const [rtRw, setRtRw] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [city, setCity] = useState('');
  
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 }); // default Jakarta
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);

  // Get GPS coords on load
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
        setGeoSuccess(true);
      },
      (err) => {
        console.error(err);
        setGeoLoading(false);
        alert("Gagal mendeteksi lokasi otomatis. Silakan masukkan alamat manual.");
      }
    );
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) {
      setPin(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length < 6) {
      alert("PIN harus 6 digit angka!");
      return;
    }

    const fullAddress = `${street}, RT/RW ${rtRw}, Kel. ${kelurahan}, Kec. ${kecamatan}, ${city}`;

    try {
      // Check duplicate email in Supabase
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (checkError) {
        console.error(checkError);
        alert("Gagal melakukan pengecekan email. Coba lagi.");
        return;
      }

      if (existingUser) {
        alert("Email sudah terdaftar!");
        return;
      }

      // Insert user to Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            password,
            pin,
            role: 'customer',
            status: 'pending',
            address: fullAddress,
            coords
          }
        ]);

      if (insertError) {
        console.error(insertError);
        alert("Gagal mendaftarkan akun: " + insertError.message);
        return;
      }

      // Save user's email for verification page to show
      localStorage.setItem('user_email', email);
      
      alert("Pendaftaran berhasil! Akun Anda sedang menunggu verifikasi oleh Admin.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col justify-between p-6 overflow-y-auto text-left">
      <div>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => navigate('/signup')}
            className="p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 active:scale-95 transition-all text-gray-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-400 font-mono">Daftar Konsumen</span>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Daftar Pelanggan</h1>
          <p className="text-gray-500 text-sm mt-1">Dapatkan kuliner terbaik diantarkan ke rumah Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Personal Info */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Alamat Email</label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi minimal 8 karakter"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">PIN Transaksi (6 Digit)</label>
            <div className="relative flex items-center">
              <ShieldCheck className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="password"
                required
                pattern="[0-9]*"
                inputMode="numeric"
                value={pin}
                onChange={handlePinChange}
                placeholder="••••••"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all font-mono tracking-widest"
              />
            </div>
          </div>

          {/* Indonesian Address Standard Section */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" /> Alamat Pengiriman
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jalan / Nama Gedung / No Rumah</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Jl. Soekarno Hatta No. 15"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-medium text-gray-750 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">RT / RW</label>
                <input
                  type="text"
                  required
                  value={rtRw}
                  onChange={(e) => setRtRw(e.target.value)}
                  placeholder="001/002"
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-medium text-gray-755 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kelurahan</label>
                <input
                  type="text"
                  required
                  value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                  placeholder="Mojolangu"
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-medium text-gray-755 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kecamatan</label>
                <input
                  type="text"
                  required
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  placeholder="Lowokwaru"
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-medium text-gray-755 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Kota Malang"
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-medium text-gray-755 transition-all"
                />
              </div>
            </div>

            {/* Geolocation Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLoading}
              className={`w-full flex items-center justify-center gap-2 border-2 rounded-2xl py-3 text-xs font-bold transition-all cursor-pointer ${
                geoSuccess 
                  ? 'border-green-150 bg-green-50 text-green-700' 
                  : 'border-orange-100 bg-orange-50/20 text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
              {geoLoading ? "Mendeteksi Koordinat..." : geoSuccess ? "✓ Koordinat GPS Terdeteksi" : "Gunakan Lokasi GPS Saat Ini"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/20 mt-6 transition-all cursor-pointer"
          >
            Daftar Sebagai Customer
          </button>
        </form>
      </div>

      <div className="text-center pt-6">
        <p className="text-gray-500 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold underline transition-colors">
            MASUK
          </Link>
        </p>
      </div>
    </div>
  );
}
