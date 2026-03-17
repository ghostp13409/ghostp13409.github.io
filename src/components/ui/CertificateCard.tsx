import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Certificate } from "../../types/portfolio";

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
}

const CertificateCard = ({ certificate, index }: CertificateCardProps) => {
  return (
    <motion.a
      href={certificate.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group block py-6 border-b border-black/5 last:border-0"
    >
      <div className="flex justify-between items-baseline gap-4 mb-2">
        <h3 className="text-sm font-black text-text-main group-hover:text-accent-peach transition-colors tracking-tight">
          {certificate.title}
        </h3>
        <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-accent-peach transition-colors shrink-0" />
      </div>
      <div className="flex justify-between items-baseline gap-4">
        <p className="text-[10px] font-bold text-text-muted tracking-tight leading-none">
          {certificate.issuer} / {certificate.date}
        </p>
        <div className="flex gap-2">
           {certificate.skills.slice(0, 1).map((skill) => (
             <span key={skill} className="text-[9px] font-bold tracking-tight text-text-main/40">
               {skill}
             </span>
           ))}
        </div>
      </div>
    </motion.a>
  );
};

export default CertificateCard;
