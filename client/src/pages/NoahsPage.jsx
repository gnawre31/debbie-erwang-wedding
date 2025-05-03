import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Font Awesome Map Marker Icon
import { useNavigate } from 'react-router-dom';

const NoahsPage = () => {

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = DateTime.fromISO('2026-03-28T18:00:00', {
      zone: 'America/Toronto',
    });

    const updateCountdown = () => {
      const now = DateTime.now().setZone('America/Toronto');
      const diff = targetDate.diff(now, [
        'days',
        'hours',
        'minutes',
        'seconds',
      ]).toObject();

      setCountdown({
        days: Math.floor(diff.days),
        hours: Math.floor(diff.hours),
        minutes: Math.floor(diff.minutes),
        seconds: Math.floor(diff.seconds),
      });
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Left side - Fullscreen Image with Bottom Text and Gradient Mask */}
      <div className="relative w-full md:w-[60%] h-screen overflow-hidden">
        <img
          src="/picture-1.JPG"
          alt="Sample"
          className="w-full h-full object-cover"
        />

        {/* Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Bottom Centered Text using Flex */}
        <div className='flex justify-center w-full'>
          <div className="absolute bottom-24 flex justify-center text-white antialiased flex-col">
            <h1 className="text-7xl" style={{ fontFamily: 'Great Vibes, cursive' }}>
              Debbie & Erwang
            </h1>
            <p className='text-2xl'>We're getting married!</p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-[40%] max-h-screen overflow-y-auto flex flex-col items-center">
        {/* Light brown section - fills vertical screen */}
        <div
          className="w-full flex flex-col items-center p-6"
          style={{ backgroundColor: '#f5efe7', color: '#4A2A05', minHeight: '100vh' }}
        >
          <div className="max-w-2xl w-full text-center flex flex-col justify-between h-full">
            <div>
              <h1 className="text-4xl mt-24 font-bold" style={{ fontFamily: 'Mono' }}>
                Saturday, March 28, 2026
              </h1>
              <div className="text-lg">
                <p className='mb-12 mt-4'>Toronto, Canada</p>
                <p className='pl-8 pr-8 text-xl'>Please join us as we tie the knot</p>

                {/* Countdown */}
                <div className="mt-10 mb-6 px-6 py-4 bg-white shadow-sm rounded-xl inline-flex flex-wrap justify-center gap-4">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                  ].map((unit, index) => (
                    <div key={index} className="flex flex-col items-center w-20">
                      <span className="text-2xl font-bold" style={{ fontFamily: 'Mono' }}>
                        {unit.value.toString().padStart(2, '0')}
                      </span>
                      <span className="text-sm text-gray-600 uppercase tracking-wide mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <div className="border mt-4 pt-2 pb-2 px-12 rounded-full cursor-pointer hover:bg-[#e9dfd6] transition" onClick={() => navigate('/rsvp')}>
                    RSVP
                  </div>
                </div>
                <p className="mt-12">View details</p>
              </div>
            </div>
          </div>
        </div>

        {/* White background scrollable section below */}
        <div className="w-full bg-white py-24 px-24">
          <p className='text-center text-5xl mb-8' style={{ fontFamily: 'Great Vibes, cursive' }}>Location</p>
          <p className='font-bold'>Cluny Bistro & Boulangerie</p>
          <p>Downtown Toronto, Distillery District</p>
          <a className="text-blue-500 flex items-center" href='https://maps.app.goo.gl/gnK5vUik4XRvjsry6'>
            <FaMapMarkerAlt className="mr-2 text-xl" />
            35 Tank House Lane, Toronto, ON M5A 3C4
          </a>
          <p className='text-center text-5xl mb-4 mt-24' style={{ fontFamily: 'Great Vibes, cursive' }}>Schedule</p>
          <p>Saturday, March 28, 2026</p>
          <p>6pm...</p>

          <p className='text-center text-5xl mb-4 mt-24' style={{ fontFamily: 'Great Vibes, cursive' }}>Frequently Asked Questions</p>
          <p>Saturday, March 28, 2026</p>
          <p>6pm...</p>
        </div>
      </div>
    </div>
  );
};

export default NoahsPage;
