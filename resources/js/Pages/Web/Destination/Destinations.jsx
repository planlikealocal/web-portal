import React, { useState, useEffect, useRef } from 'react';
import { router, Link } from '@inertiajs/react';
import WebsiteLayout from '../../../Layouts/WebsiteLayout.jsx';
import { Autocomplete, TextField } from '@mui/material';

const Destinations = ({ destinations: initialDestinations, pagination: initialPagination, filters: initialFilters = {}, countries: initialCountries = [], regions: initialRegions = [], activities: initialActivities = [] }) => {
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [pagination, setPagination] = useState(initialPagination || {});
  const [countries] = useState(initialCountries);
  const [regions, setRegions] = useState(initialRegions);
  const [activities, setActivities] = useState(initialActivities);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isAppendingRef = useRef(false);
  const [filters, setFilters] = useState({
    country_id: initialFilters.country_id || '',
    region: '',
    activity: ''
  });

  // Add "All Countries" option to the beginning of countries array
  const countriesWithAll = [
    { id: 'all', name: 'All Countries' },
    ...countries
  ];

  // Add "All Regions" option to the beginning of regions array
  const regionsWithAll = [
    { id: 'all', name: 'All Regions' },
    ...regions
  ];

  // Add "All Activities" option to the beginning of activities array
  const activitiesWithAll = [
    { id: 'all', name: 'All Activities' },
    ...activities
  ];

  // Update regions and activities when country changes
  useEffect(() => {
    if (filters.country_id && filters.country_id !== 'all') {
      // Clear filters when country changes
      setFilters(prev => ({ ...prev, region: '', activity: '' }));
    } else {
      setRegions([]);
      setActivities([]);
      setFilters(prev => ({ ...prev, region: '', activity: '' }));
    }
  }, [filters.country_id]);

  // Update regions when prop changes (from Inertia)
  useEffect(() => {
    setRegions(initialRegions);
  }, [initialRegions]);

  // Update activities when prop changes (from Inertia)
  useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  // Initialize destinations on mount
  useEffect(() => {
    if (destinations.length === 0 && initialDestinations && initialDestinations.length > 0) {
      setDestinations(initialDestinations);
      setPagination(initialPagination || {});
    }
  }, []);

  // Update destinations when filters change (but not when appending more pages)
  useEffect(() => {
    // Only reset destinations when filters actually change, not when page changes
    if (!isAppendingRef.current) {
      const currentCountryId = filters.country_id || '';
      const newCountryId = initialFilters.country_id || '';
      const currentRegion = filters.region || '';
      const newRegion = initialFilters.region || '';
      const currentActivity = filters.activity || '';
      const newActivity = initialFilters.activity || '';
      
      // Only reset if filters changed
      if (currentCountryId !== newCountryId || 
          currentRegion !== newRegion || 
          currentActivity !== newActivity) {
        setDestinations(initialDestinations || []);
        setPagination(initialPagination || {});
        setFilters({
          country_id: newCountryId,
          region: newRegion,
          activity: newActivity
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters.country_id, initialFilters.region, initialFilters.activity]);

  const handleFilterChange = (filterType, value) => {
    // If "all" is selected, set to empty string to clear the filter
    const filterValue = value === 'all' ? '' : (value || '');
    
    setFilters(prev => ({
      ...prev,
      [filterType]: filterValue
    }));

    // Build filter params
    const filterParams = {};
    if (filters.country_id && filterType !== 'country_id') {
      filterParams.country_id = filters.country_id;
    } else {
      filterParams.country_id = filterType === 'country_id' ? filterValue : filters.country_id || undefined;
    }
    
    if (filterType === 'region') {
      // For region, we need to find the actual region name from the regions list
      const selectedRegion = regions.find(r => r.id === filterValue);
      filterParams.region = selectedRegion ? selectedRegion.name : filterValue;
    } else if (filters.region) {
      const currentRegion = regions.find(r => r.id === filters.region);
      filterParams.region = currentRegion ? currentRegion.name : filters.region;
    }
    
    if (filterType === 'activity') {
      // For activity, we need to find the actual activity name from the activities list
      const selectedActivity = activities.find(a => a.id === filterValue);
      filterParams.activity = selectedActivity ? selectedActivity.name : filterValue;
    } else if (filters.activity) {
      const currentActivity = activities.find(a => a.id === filters.activity);
      filterParams.activity = currentActivity ? currentActivity.name : filters.activity;
    }

    // Reload page with filters
    router.get('/destinations', filterParams, {
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        if (filterType === 'country_id') {
          // Clear filters when country changes
          setFilters(prev => ({ ...prev, region: '', activity: '' }));
        }
      }
    });
  };

  const loadMoreDestinations = () => {
    if (!pagination.has_more_pages || isLoadingMore) return;

    setIsLoadingMore(true);
    isAppendingRef.current = true;

    const params = {
      page: pagination.current_page + 1
    };

    // Include all active filters
    if (filters.country_id && filters.country_id !== 'all') {
      params.country_id = filters.country_id;
    }
    
    if (filters.region && filters.region !== 'all') {
      const currentRegion = regions.find(r => r.id === filters.region);
      if (currentRegion) {
        params.region = currentRegion.name;
      }
    }
    
    if (filters.activity && filters.activity !== 'all') {
      const currentActivity = activities.find(a => a.id === filters.activity);
      if (currentActivity) {
        params.activity = currentActivity.name;
      }
    }

    // Use partial reload with onSuccess to append data instead of replace
    router.get('/destinations', params, {
      preserveState: true,
      preserveScroll: true,
      only: ['destinations', 'pagination'],
      onSuccess: (page) => {
        // Append new destinations to existing ones at the bottom
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
                                  options={regionsWithAll}
                                  value={(() => {
                                    const regionId = filters.region;
                                    if (!regionId || regionId === '') {
                                      return regionsWithAll.find(r => r.id === 'all') || regionsWithAll[0];
                                    }
                                    return regionsWithAll.find(r => String(r.id) === String(regionId)) || regionsWithAll[0];
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
                                  disabled={!filters.country_id || filters.country_id === 'all'}
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
                                  options={activitiesWithAll}
                                  value={(() => {
                                    const activityId = filters.activity;
                                    if (!activityId || activityId === '') {
                                      return activitiesWithAll.find(a => a.id === 'all') || activitiesWithAll[0];
                                    }
                                    return activitiesWithAll.find(a => String(a.id) === String(activityId)) || activitiesWithAll[0];
                                  })()}
                                  onChange={(event, activity) => {
                                    if (activity === null) {
                                      handleFilterChange('activity', 'all');
                                    } else {
                                      handleFilterChange('activity', activity.id);
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
                                  disabled={!filters.country_id || filters.country_id === 'all'}
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
                          <Link key={destination.id} href={`/destinations/${destination.id}`} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer block">
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
                          </Link>
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
                          <Link key={destination.id} href={`/destinations/${destination.id}`} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer block">
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
                          </Link>
                      ))}
                  </div>
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
                                  <Link key={destination.id} href={`/destinations/${destination.id}`} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer block">
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
                                  </Link>
                              ))}
                          </div>
                      </div>
                  </section>
              </>
          )}

          {/* Load More Button - Always at the bottom after all destinations */}
          {pagination.has_more_pages && (
              <section className="bg-white py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center">
                          <button
                              onClick={loadMoreDestinations}
                              disabled={isLoadingMore}
                              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {isLoadingMore ? 'Loading...' : 'Load more'}
                          </button>
                      </div>
                  </div>
              </section>
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
