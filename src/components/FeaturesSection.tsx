import { motion } from "framer-motion";
import { Gem, Ruler, ShieldCheck, Palette } from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Exquisite Materials",
    description: "Premium Italian velvet, hand-selected hardwoods, and imported silk brocade — only the finest.",
  },
  {
    icon: Ruler,
    title: "Bespoke Tailoring",
    description: "Every piece custom-made to your exact specifications, space, and aesthetic vision.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Last",
    description: "Kiln-dried hardwood frames and high-resilience foam ensure decades of uncompromising comfort.",
  },
  {
    icon: Palette,
    title: "Cultural Artistry",
    description: "Authentic Arabian geometric patterns meet contemporary Ethiopian design sensibility.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-accent text-base tracking-[0.3em] uppercase text-primary mb-4 block">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            The Art of <span className="text-gold-gradient">Living Well</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
