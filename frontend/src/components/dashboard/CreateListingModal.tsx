import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Image as ImageIcon, CheckCircle, Info, DollarSign, MapPin } from 'lucide-react';
import { listingAPI } from '../../services/api';
import type { CreateListingDto, ServiceCategory } from '../../types';
import { TagInput } from '../common/TagInput';

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
    { value: 0, label: 'Emlak' }, { value: 1, label: 'Düğün' },
    { value: 2, label: 'İnceleme' }, { value: 3, label: 'Ticari' },
    { value: 4, label: 'Haritacılık' }, { value: 5, label: 'Tarım' },
    { value: 6, label: 'İnşaat' }, { value: 7, label: 'Etkinlik' },
    { value: 8, label: 'Sinematografi' },
];

const DEFAULT_LISTING: CreateListingDto = {
    title: '', description: '', category: 0 as ServiceCategory,
    hourlyRate: 0, dailyRate: 0, projectRate: 0,
    coverImageUrl: '', maxDistance: 50, requiredEquipment: '', deliverableFormat: ''
};

interface CreateListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateListingModal({ isOpen, onClose, onSuccess }: CreateListingModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateListingDto>(DEFAULT_LISTING);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleNext = () => {
        setError('');
        setStep(s => Math.min(3, s + 1));
    };

    const handleBack = () => {
        setError('');
        setStep(s => Math.max(1, s - 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent early form submission on Enter key press
        if (step < 3) {
            handleNext();
            return;
        }

        setError('');
        if (!formData.coverImageUrl) {
            return setError('Lütfen geçerli bir kapak görseli URL\'si ekleyin.');
        }

        setLoading(true);
        try {
            let url = formData.coverImageUrl.trim();
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            const submitData = { ...formData, coverImageUrl: url };
            await listingAPI.create(submitData);
            setFormData(DEFAULT_LISTING);
            setStep(1);
            onSuccess();
        } catch (err: any) {
            const data = err.response?.data;
            let msg = 'Hizmet oluşturulurken bir hata oluştu.';
            
            if (typeof data === 'string') {
                msg = data;
            } else if (data?.errors) {
                const firstKey = Object.keys(data.errors)[0];
                msg = data.errors[firstKey][0];
            } else if (data?.message) {
                msg = data.message;
            }
            
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700/80 rounded-[2rem] w-full max-w-3xl shadow-2xl relative animate-slide-up flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="shrink-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/80 px-8 py-6 flex flex-col gap-4 rounded-t-[2rem] z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <CheckCircle className="text-blue-500" size={20} />
                            </div>
                            Yeni Hizmet Oluştur
                        </h2>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="p-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700 active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${s <= step ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto overflow-x-hidden relative flex-1 custom-scrollbar">
                    <form id="create-listing-form" onSubmit={handleSubmit}>
                        {/* STEP 1: Basic Info */}
                        <div className={`space-y-6 transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 absolute -translate-x-full pointer-events-none'}`}>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Temel Bilgiler</h3>
                                <p className="text-sm text-slate-400 mb-6">Müşterilerin göreceği ana başlık ve detaylar.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Hizmet Başlığı <span className="text-red-400">*</span></label>
                                <input type="text" className="input-field shadow-inner" placeholder="Örn: Profesyonel Gayrimenkul Çekimi" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Detaylı Açıklama <span className="text-red-400">*</span></label>
                                <textarea className="input-field min-h-[140px] shadow-inner resize-y" placeholder="Hizmetinizin detaylarını, deneyiminizi ve neler sunduğunuzu açıklayın..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Kategori <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <select className="input-field appearance-none cursor-pointer shadow-inner pr-10" value={formData.category} onChange={e => setFormData({ ...formData, category: Number(e.target.value) as ServiceCategory })}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-slate-900">{c.label}</option>)}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* STEP 2: Pricing & Scope */}
                        <div className={`space-y-6 transition-all duration-500 ${step === 2 ? 'opacity-100 translate-x-0 relative' : step < 2 ? 'opacity-0 absolute translate-x-full pointer-events-none' : 'opacity-0 absolute -translate-x-full pointer-events-none'}`}>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Fiyatlandırma ve Kapsam</h3>
                                <p className="text-sm text-slate-400 mb-6">Hizmet bedelleri ve hizmet vereceğiniz maksimum mesafe.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Saatlik Ücret <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><DollarSign size={16} /></span>
                                        <input type="number" className="input-field pl-11 shadow-inner" placeholder="0" value={formData.hourlyRate || ''} onChange={e => setFormData({ ...formData, hourlyRate: Number(e.target.value) })} />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₺</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Günlük Ücret <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><DollarSign size={16} /></span>
                                        <input type="number" className="input-field pl-11 shadow-inner" placeholder="0" value={formData.dailyRate || ''} onChange={e => setFormData({ ...formData, dailyRate: Number(e.target.value) })} />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₺</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Maksimum Hizmet Mesafesi <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><MapPin size={16} /></span>
                                        <input type="number" className="input-field pl-11 shadow-inner pr-12" placeholder="50" value={formData.maxDistance || ''} onChange={e => setFormData({ ...formData, maxDistance: Number(e.target.value) })} max={1000} />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">km</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Sabit konumunuzdan itibaren en fazla ne kadar uzağa gideceğinizi belirtin. (1-1000 km)</p>
                                </div>
                            </div>
                        </div>

                        {/* STEP 3: Media & Details */}
                        <div className={`space-y-6 transition-all duration-500 ${step === 3 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 absolute translate-x-full pointer-events-none'}`}>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Medya ve Detaylar</h3>
                                <p className="text-sm text-slate-400 mb-6">Müşteriyi çekecek görsel ve donanım bilgileri.</p>
                            </div>
                            
                            {/* Image Preview Area */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Kapak Görseli URL <span className="text-red-400">*</span></label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <input type="url" className="input-field shadow-inner mb-3" placeholder="https://resim-adresi.com/foto.jpg" value={formData.coverImageUrl} onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })} />
                                        <p className="text-xs text-slate-500 leading-relaxed">Önerilen boyut: 1920x1080px (16:9 oran). Unsplash, Imgur vb. direkt resim URL'si girin.</p>
                                    </div>
                                    <div className="w-32 h-24 shrink-0 rounded-xl bg-slate-800/80 border border-slate-700 overflow-hidden flex items-center justify-center shadow-inner group relative">
                                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                                            <ImageIcon size={24} className="text-slate-600" />
                                        </div>
                                        {formData.coverImageUrl && (
                                            <img src={formData.coverImageUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 z-10 relative" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                                <div className="col-span-2">
                                    <TagInput
                                        label="Gerekli Ekipmanlar"
                                        placeholder="DJI Mavic 3 Pro, FPV Goggles..."
                                        value={formData.requiredEquipment || ''}
                                        onChange={(val) => setFormData({ ...formData, requiredEquipment: val })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <TagInput
                                        label="Teslimat Formatı"
                                        placeholder="4K 60fps MOV, RAW DNG Fotoğraf..."
                                        value={formData.deliverableFormat || ''}
                                        onChange={(val) => setFormData({ ...formData, deliverableFormat: val })}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="shrink-0 bg-slate-900 border-t border-slate-800/60 px-8 py-5 rounded-b-[2rem] z-10 flex flex-col gap-4">
                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-fade-in">
                            <Info size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-1">
                        <div>
                            {step > 1 && (
                                <button type="button" onClick={handleBack} className="py-2.5 px-5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500/50">
                                    <ChevronLeft size={16} /> Geri
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="py-2.5 px-6 rounded-xl font-semibold hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all focus:outline-none">
                                İptal
                            </button>
                            
                            {step < 3 ? (
                                <button type="button" onClick={handleNext} className="py-2.5 px-6 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                    İleri <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" form="create-listing-form" disabled={loading} className="py-2.5 px-8 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {loading ? 'Yayınlanıyor...' : 'Hizmeti Yayınla'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
