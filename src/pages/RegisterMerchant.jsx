import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, ShieldCheck, MapPin, Store, FileText, Image } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import { supabase } from '../lib/supabaseClient';

export default function RegisterMerchant() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Merchant specific fields
  const [shopName, setShopName] = useState('');
  const [foodCategory, setFoodCategory] = useState('Pizza');
  const [ktpNibFile, setKtpNibFile] = useState(''); // mock url or filename
  
  // Indonesian Address format fields
  const [street, setStreet] = useState('');
  const [rtRw, setRtRw] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [city, setCity] = useState('');
  
  const [coords, setCoords] = useState({ lat: -7.942, lng: 112.628 }); // default near Lowokwaru, Malang
  const [locationSelected, setLocationSelected] = useState(false);

  const handleLocationSelect = (lat, lng) => {
    setCoords({ lat, lng });
    setLocationSelected(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpNibFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ktpNibFile) {
      alert("Harap unggah berkas KTP pemilik atau dokumen NIB!");
      return;
    }
    if (!locationSelected) {
      alert("Harap tandai titik lokasi restoran Anda pada peta!");
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

      // Insert merchant to Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            password,
            role: 'merchant',
            status: 'pending',
            shop_name: shopName,
            food_category: foodCategory,
            document_file: ktpNibFile,
            address: fullAddress,
            coords
          }
        ]);

      if (insertError) {
        console.error(insertError);
        alert("Gagal mendaftarkan akun merchant: " + insertError.message);
        return;
      }

      alert("Pendaftaran toko berhasil! Toko Anda sedang menunggu proses verifikasi KTP/NIB & titik koordinat oleh Admin.");
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
          <span className="text-sm font-semibold text-gray-400 font-mono">Pendaftaran Toko Baru</span>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Menjadi Mitra Merchant</h1>
          <p className="text-gray-500 text-sm mt-1">Buka toko Anda di FastFood dan jangkau jutaan pelanggan lapar.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Owner Info */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Lengkap Pemilik</label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Pemilik Toko"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Alamat Email Bisnis</label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email.bisnis@domain.com"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kata Sandi Akun Merchant</label>
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

          {/* Shop details */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-orange-500" /> Detail Toko & Restoran
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Toko / Warung</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Kebab Queen"
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-semibold text-gray-755 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kategori Utama</label>
                <select
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 px-3 text-xs font-semibold text-gray-700 transition-all"
                >
                  <option value="Burger">Burger 🍔</option>
                  <option value="Pizza">Pizza 🍕</option>
                  <option value="Pasta">Pasta 🍝</option>
                  <option value="Sehat">Makanan Sehat 🥗</option>
                  <option value="Minuman">Minuman Segar 🥤</option>
                  <option value="Pencuci Mulut">Pencuci Mulut 🍩</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Foto KTP Pemilik / Berkas NIB</label>
              <div className="relative flex items-center bg-gray-100 rounded-2xl p-4 border border-dashed border-gray-300 hover:bg-gray-150 transition-all">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="text-center w-full">
                  <span className="text-xs text-orange-500 font-bold block">
                    {ktpNibFile ? "✓ Berkas Berhasil Dipilih" : "Unggah Foto KTP / NIB"}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Format JPG/PNG/PDF maks. 5MB</span>
                </div>
              </div>
              {ktpNibFile && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 h-24 bg-gray-50 flex items-center justify-center">
                  <img src={ktpNibFile} alt="Dokumen Preview" className="h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Address Fields */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" /> Alamat Fisik Restoran
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jalan / Komplek Ruko</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ruko Soekarno Hatta Indah Kav 12"
                className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl py-3 pl-4 pr-4 text-xs font-medium text-gray-755 transition-all"
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
                  placeholder="004/009"
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
                  placeholder="Jatimulyo"
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

            {/* Leaflet Map coordinates selection */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tandai Lokasi di Peta (Klik untuk Pilih Titik)</label>
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
                <LeafletMap 
                  center={[-7.942, 112.628]} 
                  zoom={14} 
                  onLocationSelect={handleLocationSelect} 
                  interactive={true} 
                />
              </div>
              {locationSelected && (
                <span className="text-[10px] text-green-600 font-bold block mt-1">
                  ✓ Koordinat Terplot: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/20 mt-6 transition-all cursor-pointer"
          >
            Daftar Sebagai Merchant
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
