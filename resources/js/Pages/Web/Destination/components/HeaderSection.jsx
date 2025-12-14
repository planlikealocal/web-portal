import React from 'react';
import { Link } from '@inertiajs/react';
import { LocationOn as LocationIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const HeaderSection = ({ destination }) => {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/destinations"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowBackIcon sx={{ mr: 1 }} />
                    Back to Destinations
                </Link>
            </div>

            {destination.banner_image && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <img
                            src={destination.banner_image}
                            alt={destination.name}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h1 className="gold-title text-4xl md:text-5xl mb-4">
                    {destination.name}
                </h1>

                {(destination.country || destination.state_province || destination.city) && (
                    <div className="flex items-center text-gray-600 mb-4">
                        <LocationIcon sx={{ mr: 1 }} />
                        <span>
                            {[destination.city, destination.state_province, destination.country?.name]
                                .filter(Boolean)
                                .join(', ') || destination.full_location}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default HeaderSection;


