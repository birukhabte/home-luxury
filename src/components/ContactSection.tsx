import { motion } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-charcoal-gradient relative overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-accent text-base tracking-[0.3em] uppercase text-primary mb-4 block">
              Visit Our Showroom
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Experience Luxury <span className="text-gold-gradient">In Person</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
              Words can only do so much. Visit our Atlas showroom and let the craftsmanship speak for itself.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 border border-border hover:border-primary/40 transition-colors duration-300"
            >
              <MapPin className="w-6 h-6 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Location</h3>
              <p className="font-body text-sm text-muted-foreground">
                Atlas, Addis Ababa 2001
                <br />
                Ethiopia
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 border border-border hover:border-primary/40 transition-colors duration-300"
            >
              <Phone className="w-6 h-6 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Call Us</h3>
              <a
                href="tel:0995871152"
                className="font-body text-sm text-primary hover:text-gold-light transition-colors"
              >
                0995871152
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-8 border border-border hover:border-primary/40 transition-colors duration-300"
            >
              <Clock className="w-6 h-6 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Hours</h3>
              <p className="font-body text-sm text-muted-foreground">
                Mon–Sat: 8:30 AM – 8:30 PM
                <br />
                Sunday: Closed
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <a
              href="tel:0995871152"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-body font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              <Phone className="w-4 h-4" />
              Schedule Your Private Consultation
            </a>
            <p className="font-accent text-sm text-muted-foreground mt-4 italic">
              Limited collections available — exclusive pieces crafted on demand
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
