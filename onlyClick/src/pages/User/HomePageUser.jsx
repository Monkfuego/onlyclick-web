import React, { useState, useContext, useEffect } from 'react';
import { IoFilterSharp } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { FaCircleUser } from 'react-icons/fa6';
import cookie from "js-cookie"
// Components
import SlideableCards from '../../components/SlideableCards';
import CategoryCards from '../../components/CategoryCards';
import ServicesCard from '../../components/ServicesCard';
import Header from './Components/Header';
import Footer from './Components/Footer';

// Context
import { AuthContext } from '../../utils/context/Context';

// // API Services
// import {
//   fetchPopularServices,
//   fetchCategories,
//   fetchSlideableCards
// } from '../../services/apiServices';

function HomePageUser() {
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);
  const [user,setUser]=useState(cookie?.get('userProfile'))
  // State Management
  const [username, setUsername] = useState('User');
  const [address, setAddress] = useState('');
  const [search, setSearch] = useState('');

  // Data States
  const [popularServices, setPopularServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slideableCards, setSlideableCards] = useState([]);

  // Loading and Error States
  const [loading, setLoading] = useState({
    services: false,
    categories: false,
    slides: false,
  });
  const [error, setError] = useState('');

  // Fetch Data on Component Mount
  useEffect(() => {
    // Set user details
    if (user) {
      setUsername(user.name || 'User');
      setAddress(user.address || '');
    }

    // Fetch data
    fetchData();
  }, [user]);

  
  // Fetch Data Function
  const fetchData = async () => {
    try {
      // Set loading states
      setLoading((prev) => ({
        services: true,
        categories: true,
        slides: true,
      }));

      // Parallel data fetching


      // Update states
      // setPopularServices(servicesResponse.data || []);
      // setCategories(categoriesResponse.data || []);
      // setSlideableCards(slidesResponse.data || []);
    } catch (err) {
      console.log('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      // Reset loading states
      setLoading((prev) => ({
        services: false,
        categories: false,
        slides: false,
      }));
    }
  };

  // Search Handler
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (e.key === 'Enter') {
      // Navigate to search results page
      navigate(`/search?query=${searchTerm}`);
    }
  };

  // Render Loading or Error States
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col gap-5">
      {/* Header */}
      <Header username={username} address={address} />

      {/* Logo and Profile */}
      <div className="w-full h-[7vh] flex justify-between items-center px-4">
        <div className="w-[60vw] flex gap-4 justify-center items-center">
          <img
            src="/assets/image.png"
            className="h-full w-[10vw] object-cover"
            alt="Only Click Logo"
          />
          <p className="text-[#0099B5] font-extrabold text-3xl">Only Click</p>
        </div>
        <Link to="/user/profile">
          <FaCircleUser className="h-full w-[9.9vw] text-slate-400" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex w-full h-[5vh] px-4">
        <div className="relative flex items-center flex-grow">
          <CiSearch className="absolute left-3 w-[6vw] h-[5vh]" />
          <input
            type="text"
            placeholder="Search services"
            value={search}
            className="h-full w-full placeholder:text-slate-400 px-14 bg-gray-200 rounded-lg"
            onChange={handleSearch}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="h-full w-[20vw] pl-2">
          <IoFilterSharp
            className="h-full w-[9vw] bg-gray-200 px-2 rounded-lg cursor-pointer"
            onClick={() => navigate('/filters')}
          />
        </div>
      </div>

      {/* Slideable Cards */}
      <div className="h-[18vh] w-full bg-red-200 flex overflow-x-auto space-x-4 p-2">
        {loading.slides ? (
          <p>Loading slides...</p>
        ) : (
          slideableCards.map((slide, index) => (
            <SlideableCards
              key={index}
              name={slide.name}
              image={slide.image}
              route={slide.route}
              text={slide.text}
            />
          ))
        )}
      </div>

      {/* Category Cards */}
      <div className="w-full h-max flex gap-5 flex-wrap justify-center p-2 mt-5">
        {loading.categories ? (
          <p>Loading categories...</p>
        ) : (
          categories.map((category, index) => (
            <CategoryCards
              key={index}
              name={category.name}
              image={category.image}
            />
          ))
        )}
      </div>

      {/* Popular Services */}
      <div className="w-full px-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Popular Services</p>
          <Link to="/services" className="text-blue-500">
            See all {'>'}
          </Link>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-4">
          {loading.services ? (
            <p>Loading services...</p>
          ) : (
            popularServices.map((service, index) => (
              <ServicesCard key={index} data={service} />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePageUser;
