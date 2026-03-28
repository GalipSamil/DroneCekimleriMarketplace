import React, { useState } from 'react';
import { X, Send, Calendar, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { ServiceCategory } from '../../types';

interface CustomRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    prefillCategory?: ServiceCategory;
    prefillLocation?: string;
}

const CATEGORY_NAMES: Record<ServiceCategory, string> = {
    [ServiceCategory.RealEstate]: 'Emlak',
    [ServiceCategory.Wedding]: 'Düğün',
    [ServiceCategory.Inspection]: 'İnceleme',
    [ServiceCategory.Commercial]: 'Ticari',
    [ServiceCategory.Mapping]: 'Haritacılık',
    [ServiceCategory.Agriculture]: 'Tarım',
    [ServiceCategory.Construction]: 'İnşaat',
    [ServiceCategory.Events]: 'Etkinlik',
    [ServiceCategory.Cinematography]: 'Sinematografi',
};

export const CustomRequestModal: React.FC<CustomRequestModalProps> = ({ 
    isOpen, 
    onClose,
    prefillCategory,
    prefillLocation
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: prefillCategory ?? '',
        location: prefillLocation || '',
        date: '',
        budget: '',
        details: '',
        contactPhone: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call for the Custom Request (Fake it till you make it)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Özel çekim talebiniz başarıyla alındı! Ekibimiz 24 saat içinde size ulaşıp en uygun pilotu yönlendirecektir.');
            onClose();
            setFormData({ category: '', location: '', date: '', budget: '', details: '', contactPhone: ''});
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
            <div className="bg-[#020617] border border-slate-800/80 rounded-[2.5rem] w-full max-w-2xl shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-600/20 transition-colors duration-700" />
                
                <div className="p-8 border-b border-slate-800/80 flex items-center justify-between z-20">
                    <div>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Send className="text-blue-400" size={24} />
                            </span>
                            Özel Talep Oluştur
                        </h2>
                        <p className="text-slate-400 text-sm mt-2 ml-14">
                            Size uygun pilot yoksa bile sorun değil. Talebinizi bırakın, en uygun pilotu 24 saat içinde biz ayarlayalım.
                        </p>
                    </div>
                    <button
                        className="text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors self-start"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                    <Briefcase size={16} className="text-slate-500" /> Kategori
                                </label>
                                <select
                                    required
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="" disabled>Seçiniz...</option>
                                    {Object.entries(CATEGORY_NAMES).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-500" /> Konum (İl / İlçe)
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Örn: Kadıköy, İstanbul"
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-500" /> Tahmini Tarih
                                </label>
                                <input
                                    required
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Contact Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                    <DollarSign size={16} className="text-slate-500 opacity-0" /> İletişim Numarası
                                </label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="05XX XXX XX XX"
                                    className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60"
                                    value={formData.contactPhone}
                                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Proje Detayları ve İhtiyaçlarınız</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Nasıl bir çekim yapılacak? Özel ekipman beklentiniz var mı? Detaylı şekilde anlatın..."
                                className="w-full bg-slate-800/40 border border-slate-700/80 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium hover:bg-slate-800/60 resize-none"
                                value={formData.details}
                                onChange={e => setFormData({ ...formData, details: e.target.value })}
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:active:scale-100 disabled:hover:-translate-y-0 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>Gönder <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" /></>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
