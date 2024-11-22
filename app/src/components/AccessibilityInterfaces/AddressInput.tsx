import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onGeolocation?: () => void;
  placeholder: string;
}

export function AddressInput({ value, onChange, onGeolocation, placeholder }: AddressInputProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        aria-label={placeholder}
      />
      {onGeolocation && (
        <button
          onClick={onGeolocation}
          className="px-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          aria-label="Utiliser ma position actuelle"
        >
          <MapPin className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
