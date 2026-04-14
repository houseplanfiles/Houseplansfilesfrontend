import {
  Home,
  Ruler,
  Palette,
  Shield,
  Wrench,
  Star,
  Globe,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Custom House Plans",
      description:
        "Tailored architectural designs for your unique vision and needs.",
      link: "/customize/floor-plans",
    },
    {
      icon: Ruler,
      title: "Structural Engineering",
      description:
        "Professional structural analysis and engineering solutions.",
      link: "/contact",
    },
    {
      icon: Palette,
      title: "Interior Design",
      description: "Beautiful interior layouts and design consultations.",
      link: "/customize/interior-designs",
    },
    {
      icon: Shield,
      title: "Building Permits",
      description: "Complete assistance with building permits and approvals.",
      link: "/services",
    },
    {
      icon: Wrench,
      title: "Construction Support",
      description: "Ongoing support throughout your construction journey.",
      link: "/contact",
    },
    {
      icon: Star,
      title: "3D Visualization",
      description: "Stunning 3D renders to visualize your future home.",
      link: "/customize/3d-elevation",
    },
    {
      icon: Globe,
      title: "Site Planning",
      description: "Comprehensive site analysis and planning services.",
      link: "/contact",
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support and consultation.",
      link: "/contact",
    },
  ];

  return (
    <section className="py-20 bg-soft-teal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-gray mb-4">
            Our Expert Services
          </h2>
          <p className="text-xl text-secondary-gray max-w-2xl mx-auto">
            From concept to completion, we provide comprehensive architectural
            solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="card-service group cursor-pointer block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-orange transition-all duration-300 animate-float"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <service.icon className="w-8 h-8 text-white group-hover:animate-pulse-glow" />
              </div>
              <h3 className="text-lg font-semibold text-primary-gray mb-3 group-hover:text-primary transition-colors duration-300 text-center">
                {service.title}
              </h3>
              <p className="text-secondary-gray text-sm leading-relaxed text-center">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
