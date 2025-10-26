import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import WebsiteLayout from '../../Layouts/WebsiteLayout.jsx';

const Destinations = ({ destinations: initialDestinations, pagination: initialPagination }) => {
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [pagination, setPagination] = useState(initialPagination || {});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    region: '',
    style: ''
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const loadMoreDestinations = async () => {
    if (loading || !pagination.has_more_pages) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/destinations?page=${pagination.current_page + 1}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDestinations(prev => [...prev, ...data.destinations]);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading more destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WebsiteLayout>
      <div>
          {/* Hero Section */}
          <section className="relative bg-white" style={{minHeight: "800px"}}>
              {/* Curved Background */}
              <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                  <svg className="relative block w-full h-200" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
                      <path d="M0,0 L1,20 Q600,120 1400,20 L1200,0 Z" className="fill-cambridge-blue"></path>
                  </svg>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-50">
                  <h1 className={"gold-title"}>Destinations</h1>
                  <p className="text-description-lg">
                      <span className={"text-gray-50"}>as dui class suspendisse cum nec platea, nam dictum dis placerat risus suscipit etiam nullam purus id, nisl conubia nascetur primis venenatis penatibus integer praesent. Parturient id montes dis pharetra nibh tempus, commodo nullam cubilia facilisi pretium. Iaculis ornare donec auctor mi aenean inceptos lobortis dictum placerat, vehicula commodo per libero tincidunt suspendisse nec nisi,</span>
                  </p>
              </div>
          </section>

          {/* Filter Section */}
          <section className="bg-gray-100 py-8 -mt-12 relative z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Country Filter */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                              <select
                                  value={filters.country}
                                  onChange={(e) => handleFilterChange('country', e.target.value)}
                                  className="input-field"
                              >
                                  <option value="">Select Country</option>
                                  <option value="france">France</option>
                                  <option value="italy">Italy</option>
                                  <option value="spain">Spain</option>
                                  <option value="japan">Japan</option>
                                  <option value="thailand">Thailand</option>
                                  <option value="greece">Greece</option>
                              </select>
                          </div>

                          {/* Region Filter */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                              <select
                                  value={filters.region}
                                  onChange={(e) => handleFilterChange('region', e.target.value)}
                                  className="input-field"
                              >
                                  <option value="">Select Region</option>
                                  <option value="europe">Europe</option>
                                  <option value="asia">Asia</option>
                                  <option value="africa">Africa</option>
                                  <option value="americas">Americas</option>
                              </select>
                          </div>

                          {/* Style Filter */}
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                              <select
                                  value={filters.style}
                                  onChange={(e) => handleFilterChange('style', e.target.value)}
                                  className="input-field"
                              >
                                  <option value="">Select Style</option>
                                  <option value="adventure">Adventure</option>
                                  <option value="cultural">Cultural</option>
                                  <option value="relaxation">Relaxation</option>
                                  <option value="luxury">Luxury</option>
                              </select>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* Destinations Grid - First Row */}
          <section className="bg-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {destinations.slice(0, 3).map((destination) => (
                          <div key={destination.id} className="card p-6">
                              <div className="flex items-center mb-4">
                                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm text-gray-600">{destination.country || destination.full_location}</span>
                              </div>
                              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                  {destination.grid_image ? (
                                      <img
                                          src={destination.grid_image}
                                          alt={destination.name}
                                          className="w-full h-full object-cover"
                                      />
                                  ) : (
                                      <span className="text-gray-500">Image Placeholder</span>
                                  )}
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{destination.name}</h3>
                              <p className="text-sm text-gray-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{destination.description}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </section>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Destinations Grid - Second Row */}
          <section className="bg-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {destinations.slice(3, 6).map((destination) => (
                          <div key={destination.id} className="card p-6">
                              <div className="flex items-center mb-4">
                                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm text-gray-600">{destination.country || destination.full_location}</span>
                              </div>
                              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                  {destination.main_image ? (
                                      <img
                                          src={destination.main_image}
                                          alt={destination.name}
                                          className="w-full h-full object-cover"
                                      />
                                  ) : (
                                      <span className="text-gray-500">Image Placeholder</span>
                                  )}
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{destination.name}</h3>
                              <p className="text-sm text-gray-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{destination.description}</p>
                          </div>
                      ))}
                  </div>

                  {/* Load More Button */}
                  {pagination.has_more_pages && (
                      <div className="text-center">
                          <button
                              onClick={loadMoreDestinations}
                              disabled={loading}
                              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {loading ? 'Loading...' : 'Load more'}
                          </button>
                      </div>
                  )}
              </div>
          </section>

          {/* Additional Destinations Grid - For loaded destinations */}
          {destinations.length > 6 && (
              <>
                  <div className="border-t border-gray-200"></div>
                  <section className="bg-gray-100 py-12">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {destinations.slice(6).map((destination, index) => (
                                  <div key={destination.id} className="card p-6">
                                      <div className="flex items-center mb-4">
                                          <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-sm text-gray-600">{destination.country || destination.full_location}</span>
                                      </div>
                                      <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                          {destination.main_image ? (
                                              <img
                                                  src={destination.main_image}
                                                  alt={destination.name}
                                                  className="w-full h-full object-cover"
                                              />
                                          ) : (
                                              <span className="text-gray-500">Image Placeholder</span>
                                          )}
                                      </div>
                                      <h3 className="text-lg font-medium text-gray-900 mb-2">{destination.name}</h3>
                                      <p className="text-sm text-gray-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{destination.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </section>
              </>
          )}

          {/* Call to Action Section */}
          <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">Sub header</p>
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to Plan Like a Local?</h2>
                  <a href="/book-appointment" className="btn-primary">
                      Plan a Trip
                  </a>
              </div>
          </section>
      </div>
    </WebsiteLayout>
  );
};

export default Destinations;
