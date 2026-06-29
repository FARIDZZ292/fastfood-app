import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Bike, Store, Check, X, ShieldAlert, ExternalLink, Image } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'courier' | 'merchant'
  const [users, setUsers] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null); // for document viewing modal

  // Load users from Supabase
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        const mappedUsers = data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
          pin: u.pin,
          role: u.role,
          status: u.status,
          address: u.address,
          coords: u.coords,
          plateNumber: u.plate_number,
          vehicleType: u.vehicle_type,
          simPhoto: u.sim_photo,
          documentFile: u.document_file,
          shopName: u.shop_name,
          foodCategory: u.food_category
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/portalmasuk/login');
    } else {
      loadUsers();
    }
  }, []);

  const handleApprove = async (userId) => {
    try {
      const userToApprove = users.find(u => u.id === userId);
      if (!userToApprove) return;

      const { error: updateError } = await supabase
        .from('users')
        .update({ status: 'approved' })
        .eq('id', userId);

      if (updateError) {
        console.error(updateError);
        alert("Gagal menyetujui akun: " + updateError.message);
        return;
      }

      if (userToApprove.role === 'merchant') {
        const newRest = {
          id: userId,
          name: userToApprove.shopName,
          rating: 4.5,
          delivery_time: '15-20 mnt',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
          category: userToApprove.foodCategory,
          lat: userToApprove.coords?.lat || -7.942,
          lng: userToApprove.coords?.lng || 112.628
        };

        const { error: restError } = await supabase
          .from('restaurants')
          .insert([newRest]);

        if (restError) {
          console.error(restError);
        }
      }

      alert("Akun berhasil disetujui!");
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handleReject = async (userId) => {
    try {
      const userToReject = users.find(u => u.id === userId);
      if (!userToReject) return;

      const { error: updateError } = await supabase
        .from('users')
        .update({ status: 'rejected' })
        .eq('id', userId);

      if (updateError) {
        console.error(updateError);
        alert("Gagal menolak akun: " + updateError.message);
        return;
      }

      if (userToReject.role === 'merchant') {
        const { error: deleteError } = await supabase
          .from('restaurants')
          .delete()
          .eq('id', userId);

        if (deleteError) {
          console.error(deleteError);
        }
      }

      alert("Pendaftaran akun ditolak!");
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  // Filter users by role and tab
  const filteredUsers = users.filter((u) => u.role === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col justify-between relative text-left">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 px-4 py-4.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/portalmasuk')}
            className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-gray-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Dasbor Admin</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('admin_authenticated');
            navigate('/portalmasuk');
          }}
          className="bg-red-550 hover:bg-red-650 text-white text-[10px] font-extrabold px-3.5 py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Tabs Menu navigation */}
      <div className="bg-white border-b border-gray-100 p-2 flex gap-1.5">
        {[
          { id: 'customer', label: 'Pelanggan', icon: Users },
          { id: 'courier', label: 'Kurir', icon: Bike },
          { id: 'merchant', label: 'Merchant', icon: Store }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-1 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {filteredUsers.length} Permohonan Pendaftaran
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 p-6">
            <div className="bg-orange-50 p-4 rounded-full text-orange-500 mb-4">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Antrean Bersih!</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
              Tidak ada permohonan pendaftaran baru di tab ini.
            </p>
          </div>
        ) : (
          filteredUsers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3"
            >
              {/* Top Header Card */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-black text-gray-800 tracking-tight">
                    {item.role === 'merchant' ? item.shopName : item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{item.email}</p>
                </div>
                {/* Verification Badge */}
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  item.status === 'approved' 
                    ? 'bg-green-100 text-green-700' 
                    : item.status === 'rejected' 
                    ? 'bg-red-100 text-red-650' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Tertunda'}
                </span>
              </div>

              {/* Specific Details */}
              <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 text-xs text-gray-600">
                {item.role === 'merchant' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pemilik:</span>
                      <span className="font-bold text-gray-800">{item.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kategori:</span>
                      <span className="font-bold text-gray-800">{item.foodCategory}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Dokumen KTP/NIB:</span>
                      <button 
                        type="button"
                        onClick={() => setSelectedDoc(item.documentFile)}
                        className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Image className="w-3.5 h-3.5" /> Lihat Berkas <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}

                {item.role === 'courier' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kendaraan:</span>
                      <span className="font-bold text-gray-800">{item.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plat Nomor:</span>
                      <span className="font-bold text-gray-800">{item.plateNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Berkas SIM:</span>
                      <button 
                        type="button"
                        onClick={() => setSelectedDoc(item.simPhoto)}
                        className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Image className="w-3.5 h-3.5" /> Lihat SIM <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}

                <div className="border-t border-dashed border-gray-200 my-1.5 pt-1.5">
                  <span className="text-gray-400 block mb-1">Alamat Terdaftar:</span>
                  <span className="font-medium text-gray-700 block leading-relaxed">{item.address}</span>
                </div>
                
                {item.coords && (
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Latitude: {item.coords.lat.toFixed(5)}</span>
                    <span>Longitude: {item.coords.lng.toFixed(5)}</span>
                  </div>
                )}
              </div>

              {/* Action buttons (only show if pending) */}
              {item.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 border border-red-200 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Tolak
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-green-500/10 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Setujui
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Document Review Modal overlay */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl p-6 relative flex flex-col items-center">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-base font-black text-gray-800 mt-2 mb-4">Peninjauan Dokumen</h3>
            
            <div className="w-full h-64 bg-gray-50 border border-gray-150 rounded-2xl flex items-center justify-center overflow-hidden">
              {/* Show the mock image url */}
              <img src={selectedDoc} alt="Document Preview" className="max-w-full max-h-full object-contain" />
            </div>

            <button
              onClick={() => setSelectedDoc(null)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold text-xs mt-6 transition-all cursor-pointer"
            >
              Tutup Peninjauan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
