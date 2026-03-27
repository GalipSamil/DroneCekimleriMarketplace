import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder, label }) => {
    const [inputValue, setInputValue] = useState('');
    
    // Convert comma-separated string to array
    const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

    const addTag = (tag: string) => {
        const cleanTag = tag.trim();
        if (!cleanTag || tags.includes(cleanTag)) return;
        
        const newTags = [...tags, cleanTag];
        onChange(newTags.join(', '));
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        onChange(newTags.join(', '));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>}
            <div 
                className="min-h-[48px] bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300"
            >
                {tags.map((tag) => (
                    <span 
                        key={tag} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in-up"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-400/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors focus:outline-none"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => addTag(inputValue)}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0 text-sm"
                />
            </div>
            <p className="text-xs text-slate-500 mt-1.5 ml-1">Eklemek için Enter veya Virgül (,) basın</p>
        </div>
    );
};
