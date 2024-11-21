import React, { useState } from 'react';
import { Accessibility, Map, AlertCircle, GalleryVertical, MapPin, Loader2, Volume2, Ear, Mic } from 'lucide-react';
import { ItineraryView } from './ItineraryView';
import { MapView } from './MapView';
import { AccessibilityStatusBar } from './AccessibilityStatusBar';
import { usePreferences } from '../../store/preferences';

export function MobilityInterface() {
  const { disabilities, hasDisability } = usePreferences();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const mockMapData = {
    startPoint: [48.8584, 2.2945] as [number, number],
    endPoint: [48.8738, 2.2950] as [number, number],
    waypoints: [
      [48.8634, 2.2947],
      [48.8684, 2.2948],
    ] as [number, number][],
    accessiblePoints: [
      {
        position: [48.8634, 2.2947] as [number, number],
        type: 'elevator' as const,
        status: 'operational' as const,
      },
      {
        position: [48.8684, 2.2948] as [number, number],
        type: 'ramp' as const,
        status: 'maintenance' as const,
      },
    ],
  };

  const handleGeolocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeparture(`${latitude}, ${longitude}`);
          setIsLocating(false);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  };

  const mockItinerary = {
    from: departure,
    to: arrival,
    duration: "35 minutes",
    steps: [
      {
        instruction: "Depuis votre position, prenez l'ascenseur jusqu'au niveau -1",
        duration: "2 min",
        hasElevator: true,
        hasStairs: false
      },
      {
        instruction: "Dirigez-vous vers le quai 3 en suivant le chemin accessible",
        duration: "5 min",
        hasElevator: false,
        hasStairs: false
      },
      {
        instruction: "Prenez le métro ligne 4 direction Gare du Nord",
        duration: "15 min",
        hasElevator: false,
        hasStairs: false
      },
      {
        instruction: "À la station Gare du Nord, prenez l'ascenseur pour sortir",
        duration: "3 min",
        hasElevator: true,
        hasStairs: true,
        alert: "L'ascenseur principal est en maintenance. Utilisez l'ascenseur secondaire près du quai 2."
      },
      {
        instruction: "Suivez le parcours accessible jusqu'à votre destination",
        duration: "10 min",
        hasElevator: false,
        hasStairs: false
      }
    ]
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Itinéraire accessible</h2>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="Point de départ"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                aria-label="Point de départ"
              />
              <button
                onClick={handleGeolocation}
                disabled={isLocating}
                className="px-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                aria-label="Utiliser ma position actuelle"
              >
                {isLocating ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <MapPin className="h-6 w-6" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              placeholder="Point d'arrivée"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Point d'arrivée"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowItinerary(true)}
              className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!departure || !arrival}
            >
              <Map className="h-6 w-6" />
              Calculer l'itinéraire
            </button>
            {hasDisability('visual') && (
              <button
                onClick={() => setIsReading(!isReading)}
                className={`px-4 rounded-lg transition-colors ${
                  isReading ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white`}
                aria-label={isReading ? "Arrêter la lecture" : "Lire à haute voix"}
              >
                <Volume2 className="h-6 w-6" />
              </button>
            )}
            {hasDisability('hearing') && (
              <button
                onClick={() => setIsListening(!isListening)}
                className={`px-4 rounded-lg transition-colors ${
                  isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white`}
                aria-label={isListening ? "Arrêter la transcription" : "Démarrer la transcription"}
              >
                <Mic className={`h-6 w-6 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <MapView {...mockMapData} />

      {hasDisability('hearing') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Ear className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Alertes textuelles</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-900 dark:text-blue-100">
              "Le prochain train arrive dans 3 minutes"
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-900 dark:text-yellow-100">
              "Attention à la marche en descendant du train"
            </div>
          </div>
        </div>
      )}

      {hasDisability('visual') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Paramètres de lecture</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="speed" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Vitesse de lecture
              </label>
              <input
                type="range"
                id="speed"
                min="0.5"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full accent-blue-600 dark:accent-blue-400"
              />
            </div>
            <div>
              <label htmlFor="pitch" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Hauteur de la voix
              </label>
              <input
                type="range"
                id="pitch"
                min="0.5"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full accent-blue-600 dark:accent-blue-400"
              />
            </div>
          </div>
        </div>
      )}

      {hasDisability('mobility') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">État des équipements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <GalleryVertical className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-green-900 dark:text-green-100">Ascenseur Quai 1</span>
              </div>
              <span className="text-green-600 dark:text-green-400">En service</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <GalleryVertical className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-900 dark:text-red-100">Ascenseur Quai 2</span>
              </div>
              <span className="text-red-600 dark:text-red-400">Hors service</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Assistance</h3>
        <button className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors">
          <Accessibility className="h-6 w-6" />
          Demander une assistance
        </button>
      </div>

      {showItinerary && (
        <ItineraryView
          {...mockItinerary}
          onClose={() => setShowItinerary(false)}
        />
      )}

      <AccessibilityStatusBar activeFeatures={disabilities} />
    </div>
  );
}