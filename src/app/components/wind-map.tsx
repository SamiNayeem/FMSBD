// pages/windMap.js
import React from 'react';

const WindMap = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <iframe
        src="https://embed.windy.com/embed2.html?lat=23.6850&lon=90.3563&detailLat=23.6850&detailLon=90.3563&width=650&height=450&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1&contour=true"
        width="100%"
        height="100%"
        className="w-full h-full rounded-md"
        style={{ minHeight: '500px', border: 'none' }}
        title="Bangladesh Wind Map"
      ></iframe>
    </div>
  );
};

export default WindMap;
