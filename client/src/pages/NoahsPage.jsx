import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Wine, HelpCircle, Utensils } from 'lucide-react'; // Added Utensils icon here
import Cookies from 'js-cookie';

// Constant must match the one used in FormPage.jsx
const COOKIE_NAME = "rsvpData";
const AUTOPLAY_DELAY = 3000; // 3 seconds

// --- Home Page Component ---
const NoahsPage = () => {
  const navigate = useNavigate();
  const carouselImages = [
    "picture-1-min.JPG",
    "picture-2-min.JPG",
    "picture-3-min.JPG",
    "picture-4-min.JPG",
    "picture-5-min.JPG",
  ];

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [hasRSVPd, setHasRSVPd] = useState(false);

  // Ref to hold the auto-play timer ID
  const autoplayTimeoutRef = useRef(null);

  // Function to move to the next slide (used by auto-play and swipe logic)
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  }, [carouselImages.length]);

  // Function to reset the auto-play timer
  const resetAutoplayTimer = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    // Set a new timeout
    autoplayTimeoutRef.current = setTimeout(goToNextSlide, AUTOPLAY_DELAY);
  }, [goToNextSlide]);

  // --- Carousel Auto-Rotation Effect ---
  useEffect(() => {
    resetAutoplayTimer();
    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [resetAutoplayTimer]);

  // --- Manual Slide Control (Dot Click) ---
  const handleManualSlideChange = (index) => {
    setCurrentSlide(index);
    resetAutoplayTimer();
  };

  // --- Swiping Handlers ---
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    resetAutoplayTimer();
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      goToPrevSlide();
    } else if (swipeDistance < -minSwipeDistance) {
      goToNextSlide();
      resetAutoplayTimer();
    }
    setTouchStartX(0);
  };

  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown Logic
  useEffect(() => {
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
    if (savedData) {
      setHasRSVPd(true);
    } else {
      setHasRSVPd(false);
    }
  }, []);

  // Shared Styles
  const sectionTitle = "text-3xl md:text-4xl text-[#4A2A05] mb-6 font-serif italic";
  const bodyText = "text-stone-600 font-light leading-relaxed";

  // Navigation function using react-router-dom
  const handleRSVPClick = () => {
    navigate('/rsvp');
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FDFBF7] font-serif md:min-h-screen">

      {/* Left side - Carousel Hero */}
      <div
        className="relative w-full md:w-[55%] h-96 md:h-screen overflow-hidden group bg-stone-200 cursor-grab"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((img, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
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

        <div className="absolute inset-0 bg-gradient-to-t from-[#2c1a03]/60 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-12 md:bottom-20 left-0 right-0 text-center text-white px-4 z-10 pointer-events-none">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 opacity-90 font-sans">
            The Wedding Of
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
            Debbie & Erwang
          </h1>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualSlideChange(index)}
              className={`w-3 h-3 rounded-full border border-white transition-all duration-300 ${currentSlide === index ? 'bg-white scale-110' : 'bg-transparent hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Content Scroll */}
      <div className="w-full md:w-[45%] md:h-screen md:overflow-y-auto bg-[#FDFBF7] relative">
        <div className="min-h-full p-6 md:p-12 relative">
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

            {/* --- RSVP Button --- */}
            <div className="mb-16 w-full max-w-xs mx-auto">
              <button
                onClick={handleRSVPClick}
                className="w-full py-4 px-8 border border-[#4A2A05] text-[#4A2A05] uppercase tracking-[0.2em] text-xs hover:bg-[#4A2A05] hover:text-white transition-all duration-500 ease-in-out font-sans rounded-full"
              >
                {hasRSVPd ? "Edit RSVP" : "RSVP Online"}
              </button>
            </div>

            <div className="w-12 h-px bg-[#4A2A05] opacity-30 mb-16"></div>

            {/* --- Details Sections --- */}
            <div className="w-full max-w-md space-y-16 text-center px-4">

              {/* Location */}
              <section>
                <div className="flex justify-center mb-4 opacity-80">
                  <MapPin className="text-[#4A2A05] w-6 h-6" />
                </div>
                <h3 className={sectionTitle}>The Ceremony and Reception</h3>
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

              {/* Schedule */}
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

              {/* Menu */}
              <section>
                <div className="flex justify-center mb-4 opacity-80">
                  <Utensils className="text-[#4A2A05] w-6 h-6" />
                </div>
                <h3 className={sectionTitle}>The Menu</h3>
                <div className="text-left">
                  <p className={`${bodyText} text-center italic mb-4`}>
                    You do not need to pre-select your meal. You will be able to choose your preferred dish for each course right at your table.
                  </p>
                  <p className={`${bodyText} text-center italic mb-10`}>
                    Wine, beer, liquor, and non-alcoholic beverages will be available for you to enjoy throughout the evening.
                  </p>

                  {/* Appetizers */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline border-b border-[#4A2A05] border-opacity-20 pb-1 mb-4">
                      <p className="font-bold text-[#4A2A05] uppercase tracking-wide font-sans text-sm">Appetizers</p>
                      <p className="text-[#4A2A05] text-xs font-sans tracking-widest">8:30 PM</p>
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Beef Tartare</p>
                        <p className="text-stone-500 text-sm italic font-light">Traditional garnishes, crostini, and horseradish crème fraîche (Nut free)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Sea Bream Ceviche</p>
                        <p className="text-stone-500 text-sm italic font-light">Orange segments, chili, and olive oil (Dairy free, gluten free, nut free)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Baby Gem Salad</p>
                        <p className="text-stone-500 text-sm italic font-light">Buttermilk ranch dressing, cucumber, dill, radish, and pickled pearl onion (Gluten free, nut free, vegetarian)</p>
                      </li>
                    </ul>
                  </div>

                  {/* Entrées */}
                  <div className="mb-8">
                    <div className="flex justify-between items-baseline border-b border-[#4A2A05] border-opacity-20 pb-1 mb-4">
                      <p className="font-bold text-[#4A2A05] uppercase tracking-wide font-sans text-sm">Entrées</p>
                      <p className="text-[#4A2A05] text-xs font-sans tracking-widest">9:05 PM</p>
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Seared Black Cod</p>
                        <p className="text-stone-500 text-sm italic font-light">Haricot verts, celeriac and apple velouté, hazelnuts, and brown butter (Gluten free, contains nuts)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">6oz Seared Beef Tenderloin</p>
                        <p className="text-stone-500 text-sm italic font-light">Duck fat potato pavé, braised mushrooms, wilted spinach, and demi glace (Gluten free, nut free, dairy free)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Duck Leg Confit</p>
                        <p className="text-stone-500 text-sm italic font-light">Braised lentils, carrot, and tonka bean purée (Gluten free, dairy free, nut free)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Roasted Ratatouille</p>
                        <p className="text-stone-500 text-sm italic font-light">Chickpea panisse, roasted eggplant, peppers, tomatoes, and zucchini (Vegan, gluten free, nut free, dairy free)</p>
                      </li>
                    </ul>
                  </div>

                  {/* Dessert */}
                  <div>
                    <div className="flex justify-between items-baseline border-b border-[#4A2A05] border-opacity-20 pb-1 mb-4">
                      <p className="font-bold text-[#4A2A05] uppercase tracking-wide font-sans text-sm">Dessert</p>
                      <p className="text-[#4A2A05] text-xs font-sans tracking-widest">9:55 PM</p>
                    </div>
                    <ul className="space-y-4">
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Dark Chocolate Mousse</p>
                        <p className="text-stone-500 text-sm italic font-light">Hazelnut croquant, sponge cake, and orange crème (Vegetarian, contains nuts)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Strawberry Matcha Profiterole</p>
                        <p className="text-stone-500 text-sm italic font-light">Fresh strawberries and buckwheat crumble (Nut free, vegetarian)</p>
                      </li>
                      <li>
                        <p className="font-bold text-stone-700 font-sans text-sm">Mango Coconut Cake</p>
                        <p className="text-stone-500 text-sm italic font-light">Passion fruit glaze, almond tuile, and mango gel (Contains nuts)</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQ */}
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
                      For a visual guide, please consult the official
                      <a
                        href="https://www.thedistillerydistrict.com/directions-parking/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A2A05] underline hover:opacity-75 transition"
                      >
                        DISTILLERY DISTRICT PARKING MAP
                      </a>.
                      <br />
                      For current rates and other options, you can check the
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
                    <p className="font-bold text-[#4A2A05] text-sm mb-1 font-sans">Do I need to choose my meal ahead of time?</p>
                    <p className={bodyText}>No! You can browse the menu above and place your order directly at your table during the reception.</p>
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
                    <p className={bodyText}>Semi-formal. We kindly ask that you please avoid wearing navy blue suits or white dresses!</p>
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

export default NoahsPage;