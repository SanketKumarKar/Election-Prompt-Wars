import React, { useState } from 'react';
import { Loader2, MapPin, List } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useTranslation, useTranslations } from '../hooks/useTranslation';

export default function PollingLocator() {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const mockPollingPlaces = [
    { name: 'City Hall', address: '100 Main St, Cityville, CA 90210', distance: '0.8 miles', lat: 34.0522, lng: -118.2437 },
    { name: 'Community Center', address: '400 Oak Ave, Cityville, CA 90210', distance: '1.2 miles', lat: 34.0622, lng: -118.2537 },
    { name: 'Library Branch 4', address: '850 Pine Ln, Cityville, CA 90210', distance: '2.5 miles', lat: 34.0422, lng: -118.2637 }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setIsLoading(true);
    // Simulate API call to Google Maps / Civic Info API
    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
    }, 1500);
  };

  const [mapError, setMapError] = useState(false);
  const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || '';

  const titleText = useTranslation('Polling Locator');
  const subtitleText = useTranslation('Find your nearest polling places');
  const placeholderText = useTranslation('Enter your street address...');
  const searchText = useTranslation('Search');
  const listTitleText = useTranslation('List of Polling Places');

  return (
    <section aria-label="Polling Locator" className="col-span-1 lg:col-span-4 lg:row-span-3 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="p-3 bg-white/80 backdrop-blur-sm border-b border-slate-100 flex items-center space-x-2 shrink-0">
        <MapPin size={16} className="text-slate-400" />
        <div>
          <h2 className="text-xs font-bold uppercase text-slate-500">{titleText}</h2>
          <p className="text-[10px] text-slate-400 leading-tight">{subtitleText}</p>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 overflow-y-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
          <div className="flex-1">
            <label htmlFor="address-input" className="sr-only">Enter your address</label>
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={placeholderText}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 sm:py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !address.trim()}
            className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300 transition-colors whitespace-nowrap flex-shrink-0 flex justify-center items-center text-sm shadow-md"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : searchText}
          </button>
        </form>

        <div aria-live="polite">
          {hasSearched && (
            <div className="space-y-6">
              {API_KEY && !mapError ? (
                <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                  <APIProvider apiKey={API_KEY} onLoad={() => setMapError(false)} onError={() => setMapError(true)}>
                    <Map
                      defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
                      defaultZoom={12}
                      gestureHandling={'greedy'}
                      disableDefaultUI={true}
                      mapId="DEMO_MAP_ID"
                    >
                      {mockPollingPlaces.map((place, idx) => (
                        <AdvancedMarker key={idx} position={{ lat: place.lat, lng: place.lng }}>
                          <Pin background={'#0d6efd'} borderColor={'#0d6efd'} glyphColor={'#fff'} />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                </div>
              ) : (
                <div 
                  className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 px-4 text-center"
                  aria-label="Interactive map showing polling locations"
                  role="img"
                >
                  <MapPin size={32} className="mb-2 opacity-50" />
                  {mapError ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-sm font-medium mb-2 text-red-600">Failed to load Google Maps</span>
                      <span className="text-xs text-slate-600 max-w-sm mb-3">
                        Your API key works, but the "Maps JavaScript API" service is not enabled for it, or the API key has domain restrictions blocking this site.
                      </span>
                      <a 
                        href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Enable Maps JavaScript API
                      </a>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium mb-1">Add Google Maps API Key to VITE_GOOGLE_CLOUD_API_KEY in .env</span>
                      <span className="text-xs text-slate-500 text-center px-4">Make sure to enable "Maps JavaScript API" in your Google Cloud Console for the key.</span>
                    </>
                  )}
                </div>
              )}

              {/* Accessible Text List Fallback */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center mb-3">
                  <List size={18} className="mr-2 text-slate-500" />
                  {listTitleText}
                </h3>
                <ul className="space-y-3">
                  {mockPollingPlaces.map((place, idx) => (
                    <li key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors bg-white">
                      <h4 className="font-semibold text-slate-900 text-sm">{place.name}</h4>
                      <p className="text-xs text-slate-600 my-1">{place.address}</p>
                      <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">
                        {place.distance}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
