import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LocationMap: React.FC = () => {
  const { colors } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState(0);

  const locations = [
    {
      name: 'Sede Principal',
      address: 'Cra. 21 #5 - 116, Madrid, Cundinamarca',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8!2d-74.26!3d4.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCra.%2021%20%235%20-%20116%2C%20Madrid%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v1!5m2!1ses!2sco'
    },

    {
      name: 'Punto de Venta',
      address: 'Cra. 21 #5 - 43, Madrid, Cundinamarca',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7!2d-74.27!3d4.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCra.%2021%20%235%20-%2043%2C%20Madrid%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v3!5m2!1ses!2sco'
    },
    {
      name: 'Tienda Sur',
      address: 'Cl. 3 Sur #22a-24, Madrid, Cundinamarca',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.6!2d-74.28!3d4.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCl.%203%20Sur%20%2322a-24%2C%20Madrid%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v4!5m2!1ses!2sco'
    }
  ];

  const openInGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Location Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {locations.map((location, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedLocation(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-2 sm:p-3 rounded-lg text-left transition-all ${
              selectedLocation === index
                ? 'text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={selectedLocation === index ? { backgroundColor: colors.primary } : {}}
          >
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-semibold text-xs sm:text-sm">{location.name}</span>
            </div>
            <p className="text-xs opacity-90 hidden sm:block">{location.address}</p>
          </motion.button>
        ))}
      </div>

      {/* Selected Map */}
      <motion.div
        key={selectedLocation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        <iframe
          src={locations[selectedLocation].mapUrl}
          width="100%"
          height="250"
          className="sm:h-80 lg:h-96"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${locations[selectedLocation].name}`}
        />
      </motion.div>

      {/* Navigation Button */}
      <motion.button
        onClick={() => openInGoogleMaps(locations[selectedLocation].address)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base"
        style={{ backgroundColor: colors.primary }}
      >
        <Navigation className="w-5 h-5" />
        Cómo llegar a {locations[selectedLocation].name}
      </motion.button>
    </div>
  );
};

export default LocationMap;