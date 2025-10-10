import React from 'react';
// import { Button } from '@/components/ui/button';
import { ArrowRight, Book, Users, Star } from 'lucide-react';

const Banner = () => {
  return (
    <div className="rbt-banner-area rbt-banner-1 variation-2 min-h-[750px] bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          
          {/* Left Content */}
          <div className="lg:w-2/3">
            <div className="content">
              <div className="inner">
                {/* Badge */}
                <div className="rbt-new-badge rbt-new-badge-one mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    🏆 The Leader in Online Learning
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  The Largest{' '}
                  <span className="text-blue-600">Online Learning</span>{' '}
                  Platform for Drive Your Career.
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                  This template includes all the necessary pages of the online learning platform. 
                  And you can build an{' '}
                  <strong className="text-gray-900">education template easily</strong>.
                </p>

                {/* CTA Button */}
                <div className="slider-btn">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group"
                  >
                    <span className="flex items-center">
                      View Course
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Course Card */}
          <div className="lg:w-1/3">
            <div className="content">
              <div className="banner-card pb-16">
                {/* Course Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  {/* Course Image */}
                  <div className="relative">
                    <img 
                      src="/images/course/classic-lms-01.jpg" 
                      alt="React Course" 
                      className="w-full h-48 object-cover"
                    />
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-md">
                      <span className="text-red-500 font-bold text-sm">-40%</span>
                      <span className="text-gray-600 text-sm ml-1">Off</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Meta Information */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Book className="w-4 h-4 mr-1" />
                        <span>12 Lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>50 Students</span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      <a href="course-details.html" className="hover:text-blue-600 transition-colors">
                        React
                      </a>
                    </h4>

                    {/* Course Description */}
                    <p className="text-gray-600 mb-4">
                      It is a long established fact that a reader will be distracted.
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">(15 Reviews)</span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">$70</span>
                        <span className="text-lg text-gray-400 line-through">$120</span>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium group"
                      >
                        Learn More
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Course Cards (for slider effect) */}
                <div className="mt-6 space-y-4">
                  {/* Pagination dots */}
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

