"use client";

import { Star, Award, Heart, Shield, Users, Building, CheckCircle, Clock } from 'lucide-react';

const stats = [
  { 
    icon: Star, 
    value: "5,000+", 
    label: "Happy Residents", 
    description: "Satisfied with our services",
    color: "text-yellow-500"
  },
  { 
    icon: Award, 
    value: "25+", 
    label: "Active Programs", 
    description: "Community initiatives running",
    color: "text-purple-500"
  },
  { 
    icon: Heart, 
    value: "100%", 
    label: "Service Commitment", 
    description: "Dedicated to excellence",
    color: "text-red-500"
  },
  { 
    icon: Shield, 
    value: "24/7", 
    label: "Security Coverage", 
    description: "Round-the-clock protection",
    color: "text-blue-500"
  }
];

const additionalStats = [
  {
    icon: Users,
    value: "98%",
    label: "Community Engagement",
    description: "Active participation rate"
  },
  {
    icon: Building,
    value: "15",
    label: "Public Facilities",
    description: "Schools, clinics, and centers"
  },
  {
    icon: CheckCircle,
    value: "99.5%",
    label: "Service Uptime",
    description: "Digital platform availability"
  },
  {
    icon: Clock,
    value: "< 24hrs",
    label: "Response Time",
    description: "Average request processing"
  }
];

export function StatsSection() {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl lg:rounded-[2rem] p-8 lg:p-12 shadow-2xl border border-white/20 dark:border-gray-700/20 transition-colors duration-300">
      <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-8 lg:mb-12 text-center transition-colors duration-300">
        Community at a Glance
      </h3>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center group">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-all duration-300">
              <stat.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${stat.color}`} />
            </div>
            <div className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 lg:mb-3 transition-colors duration-300">
              {stat.value}
            </div>
            <div className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">
              {stat.label}
            </div>
            <div className="text-sm lg:text-base text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h4 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Performance Metrics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalStats.map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
              <stat.icon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
