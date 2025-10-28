import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import WebsiteLayout from '../../Layouts/WebsiteLayout.jsx';
import { Autocomplete, TextField } from '@mui/material';

const Destinations = ({ destinations: initialDestinations, pagination: initialPagination, filters: initialFilters = {}, countries: initialCountries = [] }) => {
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [pagination, setPagination] = useState(initialPagination || {});
  const [countries] = useState(initialCountries);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isAppendingRef = useRef(false);
  const [filters, setFilters] = useState({
    country_id: initialFilters.country_id || '',
    region: '',
    style: ''
  });

  // Define region options with "All" option
  const regionOptions = [
    { id: 'all', name: 'All Regions' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia', name: 'Asia' },
    { id: 'africa', name: 'Africa' },
    { id: 'americas', name: 'Americas' }
  ];

  // Define activity options with "All" option
  const activityOptions = [
    { id: 'all', name: 'All Activities' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'relaxation', name: 'Relaxation' },
    { id: 'luxury', name: 'Luxury' }
  ];

  // Add "All Countries" option to the beginning of countries array
  const countriesWithAll = [
    { id: 'all', name: 'All Countries' },
    ...countries
  ];

  // Update destinations when props change (but not when appending more)
  useEffect(() => {
    if (!isAppendingRef.current) {
      setDestinations(initialDestinations || []);
      setPagination(initialPagination || {});
      setFilters(prev => ({
        ...prev,
        country_id: initialFilters.country_id || ''
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDestinations?.length, initialPagination?.current_page, initialFilters.country_id]);

  const handleFilterChange = (filterType, value) => {
    // If "all" is selected, set to empty string to clear the filter
    const filterValue = value === 'all' ? '' : (value || '');
    
    setFilters(prev => ({
      ...prev,
      [filterType]: filterValue
    }));

    // If country filter is changed, reload page with filter to maintain URL state
    if (filterType === 'country_id') {
      const filters = { country_id: filterValue || undefined };
      router.get('/destinations', filters, {
        preserveScroll: true,
        replace: true
      });
    }
  };

  const loadMoreDestinations = () => {
    if (!pagination.has_more_pages || isLoadingMore) return;

    setIsLoadingMore(true);
    isAppendingRef.current = true;

    const params = {
      page: pagination.current_page + 1
    };

    if (filters.country_id) {
      params.country_id = filters.country_id;
    }

    // Use partial reload with onSuccess to append data instead of replace
    router.get('/destinations', params, {
      preserveState: true,
      preserveScroll: true,
      only: ['destinations', 'pagination'],
      onSuccess: (page) => {
        // Append new destinations to existing ones
        const newDestinations = page.props.destinations || [];
        setDestinations(prev => [...prev, ...newDestinations]);
        setPagination(page.props.pagination);
        setIsLoadingMore(false);
        isAppendingRef.current = false;
      },
      onError: () => {
        setIsLoadingMore(false);
        isAppendingRef.current = false;
      }
    });
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
                              <Autocomplete
                                  options={countriesWithAll}
                                  value={(() => {
                                    const countryId = filters.country_id;
                                    if (!countryId || countryId === '') {
                                      return countriesWithAll.find(c => c.id === 'all') || countriesWithAll[0];
                                    }
                                    return countriesWithAll.find(c => String(c.id) === String(countryId)) || countriesWithAll[0];
                                  })()}
                                  onChange={(event, country) => {
                                    if (country === null) {
                                      handleFilterChange('country_id', 'all');
                                    } else {
                                      handleFilterChange('country_id', country.id);
                                    }
                                  }}
                                  getOptionLabel={(option) => option?.name || ''}
                                  isOptionEqualToValue={(option, value) => {
                                    if (!option || !value) return false;
                                    return String(option.id) === String(value.id);
                                  }}
                                  filterOptions={(options, state) => {
                                    const filtered = options.filter(option => {
                                      if (option.id === 'all') return true;
                                      return option.name.toLowerCase().includes(state.inputValue.toLowerCase());
                                    });
                                    return filtered;
                                  }}
                                  renderInput={(params) => (
                                      <TextField
                                          {...params}
                                          label="Country"
                                          variant="outlined"
                                          size="small"
                                          disabled={isLoadingMore}
                                      />
                                  )}
                              />
                          </div>

                          {/* Region Filter */}
                          <div>
                              <Autocomplete
                                  options={regionOptions}
                                  value={(() => {
                                    const regionId = filters.region;
                                    if (!regionId || regionId === '') {
                                      return regionOptions.find(r => r.id === 'all') || regionOptions[0];
                                    }
                                    return regionOptions.find(r => String(r.id) === String(regionId)) || regionOptions[0];
                                  })()}
                                  onChange={(event, region) => {
                                    if (region === null) {
                                      handleFilterChange('region', 'all');
                                    } else {
                                      handleFilterChange('region', region.id);
                                    }
                                  }}
                                  getOptionLabel={(option) => option?.name || ''}
                                  isOptionEqualToValue={(option, value) => {
                                    if (!option || !value) return false;
                                    return String(option.id) === String(value.id);
                                  }}
                                  filterOptions={(options, state) => {
                                    const filtered = options.filter(option => {
                                      if (option.id === 'all') return true;
                                      return option.name.toLowerCase().includes(state.inputValue.toLowerCase());
                                    });
                                    return filtered;
                                  }}
                                  renderInput={(params) => (
                                      <TextField
                                          {...params}
                                          label="Region"
                                          variant="outlined"
                                          size="small"
                                      />
                                  )}
                              />
                          </div>

                          {/* Activities Filter */}
                          <div>
                              <Autocomplete
                                  options={activityOptions}
                                  value={(() => {
                                    const activityId = filters.style;
                                    if (!activityId || activityId === '') {
                                      return activityOptions.find(a => a.id === 'all') || activityOptions[0];
                                    }
                                    return activityOptions.find(a => String(a.id) === String(activityId)) || activityOptions[0];
                                  })()}
                                  onChange={(event, activity) => {
                                    if (activity === null) {
                                      handleFilterChange('style', 'all');
                                    } else {
                                      handleFilterChange('style', activity.id);
                                    }
                                  }}
                                  getOptionLabel={(option) => option?.name || ''}
                                  isOptionEqualToValue={(option, value) => {
                                    if (!option || !value) return false;
                                    return String(option.id) === String(value.id);
                                  }}
                                  filterOptions={(options, state) => {
                                    const filtered = options.filter(option => {
                                      if (option.id === 'all') return true;
                                      return option.name.toLowerCase().includes(state.inputValue.toLowerCase());
                                    });
                                    return filtered;
                                  }}
                                  renderInput={(params) => (
                                      <TextField
                                          {...params}
                                          label="Activities"
                                          variant="outlined"
                                          size="small"
                                      />
                                  )}
                              />
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
                              disabled={isLoadingMore}
                              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {isLoadingMore ? 'Loading...' : 'Load more'}
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
