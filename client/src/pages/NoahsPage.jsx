import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { MapPin, Wine, HelpCircle } from 'lucide-react';
import Cookies from 'js-cookie'; // Import js-cookie to check RSVP status

// Constant must match the one used in FormPage.jsx
const COOKIE_NAME = "rsvpData";

// --- Home Page Component ---
// This component now receives no props and uses useNavigate internally
const NoahsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  // State to track the starting point of a touch for swiping logic
  const [touchStartX, setTouchStartX] = useState(0);

  // State to track if the user has already RSVP'd (by checking the cookie)
  const [hasRSVPd, setHasRSVPd] = useState(false);

  // Image Array - CORRECTED PATH to match uploaded file case
  const carouselImages = [
    "picture-1.JPG",
    "picture-2.JPG",
    "picture-3.JPG",
    "picture-4.JPG",
    "picture-5.JPG",
  ];

  // Logic to advance the carousel to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  // Logic to go to the previous slide
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  // --- Swiping Handlers ---
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50; // Minimum distance to register a swipe

    if (swipeDistance > minSwipeDistance) {
      // Swiped right (previous slide)
      goToPrevSlide();
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped left (next slide)
      goToNextSlide();
    }
    setTouchStartX(0); // Reset touch start
  };
  // --- End Swiping Handlers ---


  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown Logic (Using native Date object instead of unsupported Luxon)
  useEffect(() => {
    // Target Date: March 28, 2026 at 6:00 PM EST (UTC-4)
    const targetDate = new Date('2026-03-28T18:00:00-04:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, []);

  // Check RSVP status from cookie on load
  useEffect(() => {
    const savedData = Cookies.get(COOKIE_NAME);
    // If the cookie exists, assume the user has RSVP'd
    if (savedData) {
      setHasRSVPd(true);
    } else {
      setHasRSVPd(false);
    }
  }, []);

  // Carousel Auto-Rotation
  useEffect(() => {
    const slideInterval = setInterval(goToNextSlide, 3000);

    return () => clearInterval(slideInterval);
  }, [carouselImages.length]);

  // Shared Styles
  const sectionTitle = "text-3xl md:text-4xl text-[#4A2A05] mb-6 font-serif italic";
  const bodyText = "text-stone-600 font-light leading-relaxed";

  // Navigation function using react-router-dom
  const handleRSVPClick = () => {
    // Navigates to the /rsvp route, which is handled by FormPage.jsx in App.jsx
    navigate('/rsvp');
  };

  return (
    // FIX 1: Removed min-h-screen from mobile view (default) and added md:min-h-screen for desktop.
    <div className="flex flex-col md:flex-row bg-[#FDFBF7] font-serif md:min-h-screen">

      {/* Left side - Carousel Hero */}
      {/* FIX 2: Changed h-[50vh] to h-96 for mobile/small view, allowing it to scroll past. */}
      {/* Added touch handlers for swiping */}
      <div
        className="relative w-full md:w-[55%] h-96 md:h-screen overflow-hidden group bg-stone-200 cursor-grab"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Sliding Image Container */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((img, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                // Using object-contain to ensure the whole image fits without cropping
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#d6d3d1';
                  e.target.parentElement.innerHTML = `<div class="flex items-center justify-center h-full text-stone-500 italic p-4 text-center">Image not found<br/>Ensure image path is correct and case matches (e.g., picture-1.JPG).</div>`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c1a03]/60 via-transparent to-transparent pointer-events-none" />

        {/* Text Content */}
        <div className="absolute bottom-12 md:bottom-20 left-0 right-0 text-center text-white px-4 z-10 pointer-events-none">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 opacity-90 font-sans">
            The Wedding Of
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
            Debbie & Erwang
          </h1>
        </div>

        {/* Carousel Dots Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full border border-white transition-all duration-300 ${currentSlide === index ? 'bg-white scale-110' : 'bg-transparent hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Content Scroll */}
      <div className="w-full md:w-[45%] md:h-screen md:overflow-y-auto bg-[#FDFBF7] relative">

        {/* Decorative Inner Border Container */}
        <div className="min-h-full p-6 md:p-12 relative">
          {/* The "Paper" Border */}
          <div className="absolute inset-4 md:inset-6 border border-[#4A2A05] border-opacity-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center pt-12 md:pt-20 pb-12">

            {/* --- Date Header --- */}
            <div className="text-center mb-12">
              <p className="uppercase tracking-widest text-stone-500 text-sm font-sans mb-3">Save The Date</p>
              <h2 className="text-4xl md:text-5xl text-[#4A2A05] mb-4 font-serif">
                March 28, 2026
              </h2>
              <p className="text-xl text-stone-600 italic font-serif">Toronto, Canada</p>
            </div>

            {/* --- Elegant Countdown --- */}
            <div className="flex justify-center gap-4 md:gap-8 mb-12 text-[#4A2A05]">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds },
              ].map((unit, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-serif">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest mt-1 text-stone-500 font-sans">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* --- RSVP Button (Conditional Text) --- */}
            <div className="mb-16 w-full max-w-xs mx-auto">
              <button
                onClick={handleRSVPClick} // Use the routing function
                className="w-full py-4 px-8 border border-[#4A2A05] text-[#4A2A05] uppercase tracking-[0.2em] text-xs hover:bg-[#4A2A05] hover:text-white transition-all duration-500 ease-in-out font-sans rounded-full"
              >
                {hasRSVPd ? "Edit RSVP" : "RSVP Online"}
              </button>
            </div>

            {/* --- Divider --- */}
            <div className="w-12 h-px bg-[#4A2A05] opacity-30 mb-16"></div>

            {/* --- Details Sections --- */}
            <div className="w-full max-w-md space-y-16 text-center px-4">

              {/* Location (Using Lucide icon) */}
              <section>
                <div className="flex justify-center mb-4 opacity-80">
                  <MapPin className="text-[#4A2A05] w-6 h-6" />
                </div>
                <h3 className={sectionTitle}>The Ceremony</h3>
                <p className="font-bold text-[#4A2A05] uppercase tracking-wide text-sm mb-2 font-sans">Cluny Bistro & Boulangerie</p>
                <p className={bodyText}>35 Tank House Lane</p>
                <p className={bodyText}>Distillery District, Toronto</p>
                <a
                  href='https://maps.app.goo.gl/gnK5vUik4XRvjsry6'
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 border-b border-[#4A2A05] text-[#4A2A05] text-sm pb-1 hover:opacity-70 transition-opacity font-sans italic"
                >
                  View Map
                </a>
              </section>

              {/* Schedule (Using Lucide icon) */}
              <section>
                <div className="flex justify-center mb-4 opacity-80">
                  <Wine className="text-[#4A2A05] w-6 h-6" />
                </div>
                <h3 className={sectionTitle}>The Schedule</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">6:00 PM</p>
                    <p className={`${bodyText} italic`}>Guest arrival</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">6:15 PM</p>
                    <p className={`${bodyText} italic`}>Guests asked to be seated for ceremony</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">6:30 PM</p>
                    <p className={`${bodyText} italic`}>Ceremony</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">7:00 PM</p>
                    <p className={`${bodyText} italic`}>Cocktail hour</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">8:00 PM</p>
                    <p className={`${bodyText} italic`}>Dinner service</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">10:15 PM</p>
                    <p className={`${bodyText} italic`}>Dance floor opens</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm uppercase tracking-wide font-sans">12:00 AM</p>
                    <p className={`${bodyText} italic`}>Venue closes</p>
                  </div>
                </div>
              </section>

              {/* FAQ (Using Lucide icon) */}
              <section className="pb-8">
                <div className="flex justify-center mb-4 opacity-80">
                  <HelpCircle className="text-[#4A2A05] w-6 h-6" />
                </div>
                <h3 className={sectionTitle}>Q & A</h3>
                <div className="text-left space-y-6">
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">When is the RSVP deadline?</p>
                    <p className={bodyText}>Please RSVP by February 28th, so we can have an accurate headcount :)</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">Can I bring a plus one?</p>
                    <p className={bodyText}>To honor our venue's capacity, we kindly ask that you RSVP only for those invited. If you wish to bring a guest, please let us know via the 'Additional Notes' section on the RSVP form. While space is limited, we will do our best to accommodate your request. Thank you for your understanding.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">Will there be parking?</p>
                    <p className={bodyText}>Yes, there are several convenient options near the Distillery District.</p>
                    <ul className={`${bodyText} list-disc ml-5 mt-2 space-y-1`}>
                      <li>The underground lot beneath Cluny Bistro (access from Distillery Lane or Cherry Street).</li>
                      <li>The main surface lot that runs along the south side of the Distillery District on Distillery Lane.</li>
                      <li>An underground parking lot at 33 Mill Street.</li>
                      <li>A Green P parking lot on Distillery Lane.</li>
                    </ul>
                    <p className={`${bodyText} mt-4`}>
                      For a visual guide, please consult the official&nbsp;
                      <a
                        href="https://www.thedistillerydistrict.com/directions-parking/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A2A05] underline hover:opacity-75 transition"
                      >
                        DISTILLERY DISTRICT PARKING MAP
                      </a>.
                      <br />
                      For current rates and other options, you can check the&nbsp;
                      <a
                        href="https://parking.greenp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A2A05] underline hover:opacity-75 transition"
                      >
                        GREEN P WEBSITE
                      </a>.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">What will be served for dinner?</p>
                    <p className={bodyText}>More details will be shared closer to March 2026. Stay tuned!</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">I have allergies or dietary restrictions</p>
                    <p className={bodyText}>Let us know via the 'Additional Notes' section on the RSVP form.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">Is it okay to take pictures or videos during the wedding?</p>
                    <p className={bodyText}>Yes, we encourage it! We will have a professional photographer on-site, but we would love for you to capture your own memories and share them with us later.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">Is the wedding indoors or outdoors?</p>
                    <p className={bodyText}>The ceremony and reception will be held indoors at Cluny Bistro.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">What is the dress code?</p>
                    <p className={bodyText}>Semi-formal but comfortable!</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">I have more questions</p>
                    <p className={bodyText}>If you have any further questions, please contact us at debbie.erwang@gmail.com and we will be happy to assist you!</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// We export the component directly now that it's using router hooks.
export default NoahsPage;