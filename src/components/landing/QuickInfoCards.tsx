"use client";

import { Users, Building2, Phone, Calendar, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const quickInfo = [
  {
    icon: Users,
    title: "Population",
    value: "15,234",
    description: "Active community members",
    color: "border-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Building2,
    title: "Establishments", 
    value: "342",
    description: "Registered businesses",
    color: "border-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Phone,
    title: "Emergency Hotline",
    value: "(052) 742-0123",
    description: "24/7 Response ready",
    color: "border-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400"
  },
  {
    icon: Calendar,
    title: "Office Hours",
    value: "8AM - 5PM",
    description: "Monday to Friday", 
    color: "border-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400"
  }
];

export function QuickInfoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
      {quickInfo.map((info, index) => (
        <div 
          key={index} 
          className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/20"
          style={{animationDelay: `${0.6 + index * 0.1}s`}}
        >
          <div className={cn(
            "w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
            info.bgColor
          )}>
            <info.icon className={cn("w-8 h-8 lg:w-10 lg:h-10", info.textColor)} />
          </div>
          <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            {info.value}
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">
            {info.title}
          </h3>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {info.description}
          </p>
        </div>
      ))}
    </div>
  );
}
