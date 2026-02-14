import React from "react";
import { Truck, Shield, Headphones } from "lucide-react";
export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="w-full bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`${feature.bgColor} rounded-full p-4 flex-shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
