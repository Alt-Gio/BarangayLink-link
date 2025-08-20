"use client";

import { Trophy, CheckCircle, Users, Building, Calendar, Award, Star, Heart } from 'lucide-react';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

const achievements = [
  {
    id: 1,
    title: "New Health Center Construction",
    description: "Completed state-of-the-art health facility serving 5,000+ residents",
    date: "December 2023",
    status: "completed",
    impact: "5,234 residents served",
    category: "Healthcare",
    featuredImage: "/images/projects/health-center/health-center-featured.jpg",
    galleryImages: [
      "/images/projects/health-center/health-center-before.jpg",
      "/images/projects/health-center/health-center-progress-1.jpg",
      "/images/projects/health-center/health-center-progress-2.jpg",
      "/images/projects/health-center/health-center-after.jpg",
      "/images/projects/health-center/health-center-impact.jpg"
    ],
    icon: Heart,
    stats: {
      budget: "₱2.5M",
      beneficiaries: "5,234",
      duration: "8 months"
    }
  },
  {
    id: 2,
    title: "Road Infrastructure Improvement",
    description: "Paved 2.5km of barangay roads improving connectivity",
    date: "November 2023",
    status: "completed",
    impact: "85% faster transportation",
    category: "Infrastructure",
    featuredImage: "/images/projects/road-improvement/road-featured.jpg",
    galleryImages: [
      "/images/projects/road-improvement/road-before.jpg",
      "/images/projects/road-improvement/road-progress-1.jpg",
      "/images/projects/road-improvement/road-progress-2.jpg",
      "/images/projects/road-improvement/road-after.jpg"
    ],
    icon: Building,
    stats: {
      budget: "₱1.8M",
      beneficiaries: "3,456",
      duration: "6 months"
    }
  },
  {
    id: 3,
    title: "Digital Literacy Program",
    description: "Trained 500+ senior citizens in basic computer skills",
    date: "October 2023",
    status: "completed",
    impact: "95% completion rate",
    category: "Education",
    featuredImage: "/images/projects/digital-literacy/digital-featured.jpg",
    galleryImages: [
      "/images/projects/digital-literacy/digital-training-1.jpg",
      "/images/projects/digital-literacy/digital-training-2.jpg",
      "/images/projects/digital-literacy/digital-graduation.jpg"
    ],
    icon: Users,
    stats: {
      budget: "₱350K",
      beneficiaries: "512",
      duration: "4 months"
    }
  },
  {
    id: 4,
    title: "Community Solar Street Lights",
    description: "Installed 75 solar-powered street lights for safety",
    date: "September 2023",
    status: "completed",
    impact: "90% crime reduction",
    category: "Safety",
    featuredImage: "/images/projects/street-lights/lights-featured.jpg",
    galleryImages: [
      "/images/projects/street-lights/lights-before.jpg",
      "/images/projects/street-lights/lights-installation.jpg",
      "/images/projects/street-lights/lights-night.jpg",
      "/images/projects/street-lights/lights-community.jpg"
    ],
    icon: Star,
    stats: {
      budget: "₱900K",
      beneficiaries: "15,234",
      duration: "3 months"
    }
  },
  {
    id: 5,
    title: "Waste Management Program",
    description: "Implemented comprehensive recycling and waste segregation",
    date: "August 2023",
    status: "completed",
    impact: "70% waste reduction",
    category: "Environment",
    featuredImage: "/images/projects/waste-management/waste-featured.jpg",
    galleryImages: [
      "/images/projects/waste-management/waste-before.jpg",
      "/images/projects/waste-management/waste-segregation.jpg",
      "/images/projects/waste-management/waste-recycling.jpg",
      "/images/projects/waste-management/waste-clean.jpg"
    ],
    icon: CheckCircle,
    stats: {
      budget: "₱450K",
      beneficiaries: "15,234",
      duration: "Ongoing"
    }
  },
  {
    id: 6,
    title: "Youth Sports Complex",
    description: "Built multipurpose sports facility for community activities",
    date: "July 2023",
    status: "completed",
    impact: "80% youth engagement",
    category: "Recreation",
    featuredImage: "/images/projects/sports-complex/sports-featured.jpg",
    galleryImages: [
      "/images/projects/sports-complex/sports-construction.jpg",
      "/images/projects/sports-complex/sports-facilities.jpg",
      "/images/projects/sports-complex/sports-opening.jpg",
      "/images/projects/sports-complex/sports-activities.jpg"
    ],
    icon: Trophy,
    stats: {
      budget: "₱1.2M",
      beneficiaries: "2,845",
      duration: "5 months"
    }
  }
];

const categoryColors = {
  Healthcare: "bg-red-100 text-red-800",
  Infrastructure: "bg-blue-100 text-blue-800",
  Education: "bg-green-100 text-green-800",
  Safety: "bg-yellow-100 text-yellow-800",
  Environment: "bg-emerald-100 text-emerald-800",
  Recreation: "bg-purple-100 text-purple-800"
};

const overallStats = [
  { label: "Projects Completed", value: "25+", icon: CheckCircle, color: "text-green-600" },
  { label: "Lives Improved", value: "15,234", icon: Users, color: "text-blue-600" },
  { label: "Budget Utilized", value: "₱8.2M", icon: Award, color: "text-purple-600" },
  { label: "Success Rate", value: "98%", icon: Trophy, color: "text-yellow-600" }
];

export function AchievementsSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6">
            <Trophy className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Proven Track Record</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 transition-colors duration-300">
            Our Recent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Achievements</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            See the real impact we've made in Barangay Bitano. These completed projects showcase our commitment 
            to transparent governance and community development.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
          {overallStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center transform hover:-translate-y-2 transition-all duration-300"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.id}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
            >
              {/* Project Image Carousel */}
              <div className="relative">
                <ImageCarousel 
                  images={achievement.galleryImages}
                  title={achievement.title}
                  className="h-48"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[achievement.category as keyof typeof categoryColors]}`}>
                    {achievement.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {achievement.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {achievement.description}
                </p>

                {/* Impact Badge */}
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="text-green-800 font-semibold text-sm">
                    Impact: {achievement.impact}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {achievement.stats.budget}
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {achievement.stats.beneficiaries}
                    </div>
                    <div className="text-xs text-gray-500">Beneficiaries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {achievement.stats.duration}
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{achievement.date}</span>
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Projects Coming Soon
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're continuously working on new initiatives to improve our community. 
              Stay updated with our upcoming projects and be part of the progress.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              View Project Timeline
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
