import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FooterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-[#161118] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1f1821] rounded-t-2xl">
              <h3 className="text-xl font-bold text-white tracking-wide">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-gray-300 leading-relaxed text-sm space-y-4">
              {children}
            </div>
            <div className="p-6 border-t border-white/10 bg-[#1f1821] rounded-b-2xl flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-black font-bold uppercase text-xs rounded hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Footer: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="relative z-10 border-t border-white/10 bg-[#020202] py-20 mt-auto">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">
                school
              </span>
              <span className="text-2xl font-bold tracking-widest text-white">
                CLUB369
              </span>
            </div>
            <p className="text-gray-500 max-w-xs mb-8 text-base uppercase tracking-tighter">
              Learning Today • Leading Tomorrow
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
              >
                <svg
                  className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
              >
                <svg
                  className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 5.48-4.515 5.48 0v8.306h5v-10.5c0-5.352-5.19-5.039-8-2.675v-2.825z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
              >
                <svg
                  className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                </svg>
              </a>
              <Link
                to="/contact"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">call</span>
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-4 text-gray-500">
              <li>
                <Link
                  to="https://theclub369.com/#/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="https://theclub369.com/#/manifesto"
                  className="hover:text-primary transition-colors"
                >
                  Our Manifesto
                </Link>
              </li>
              <li>
                <Link
                  to="https://theclub369.com/#/#vision"
                  className="hover:text-primary transition-colors"
                >
                  Our Vision
                </Link>
              </li>
              <li>
                <Link
                  to="https://theclub369.com/#/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-4 text-gray-500">
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-primary transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="hover:text-primary transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-gray-600">
          © 2026 CLUB369. All rights reserved.
        </div>
      </footer>

      {/* ─── Privacy Policy Modal ─────────────────────────────────── */}
      <FooterModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <p className="font-bold text-white">1. Information We Collect</p>
        <p>
          CLUB369 collects personal information when you register for
          membership, enrol in courses, or interact with our educational support
          team. This may include your name, contact details, and payment
          information for enrolment processing.
        </p>

        <p className="font-bold text-white mt-4">
          2. How We Use Your Information
        </p>
        <p>
          Your data is used to deliver personalised learning experiences,
          facilitate access to course materials, process membership fees, and
          send relevant educational updates. We use industry-standard encryption
          to keep your information secure.
        </p>

        <p className="font-bold text-white mt-4">3. Data Sharing</p>
        <p>
          We do not sell your personal information to third parties. Data may be
          shared with trusted educational partners solely to fulfil specific
          learning services you have enrolled in or requested.
        </p>

        <p className="font-bold text-white mt-4">4. Data Security</p>
        <p>
          We implement multi-layered security protocols to protect your personal
          and payment information. You may request access to, correction of, or
          deletion of your data at any time by contacting our support team.
        </p>

        <p className="font-bold text-white mt-4">5. Cookies & Analytics</p>
        <p>
          We use cookies to improve your learning experience on our platform,
          track course progress, and understand how members engage with our
          content. You can manage cookie preferences through your browser
          settings.
        </p>
      </FooterModal>

      {/* ─── Terms of Service Modal ───────────────────────────────── */}
      <FooterModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
      >
        <p className="font-bold text-white">1. Acceptance of Terms</p>
        <p>
          By enrolling in CLUB369, you agree to be bound by these Terms of
          Service and our Learner Code of Conduct. Membership grants access to
          our educational programs and community resources.
        </p>

        <p className="font-bold text-white mt-4">2. Membership & Enrolment</p>
        <p>
          Members are responsible for maintaining the confidentiality of their
          account credentials. Access to learning materials, live sessions, and
          community forums is strictly for enrolled members and may not be
          shared with third parties.
        </p>

        <p className="font-bold text-white mt-4">3. Fees & Payments</p>
        <p>
          Monthly membership fees are non-refundable once a billing cycle has
          commenced. CLUB369 reserves the right to revise fees for future
          renewal periods with at least 14 days' prior written notice to
          members.
        </p>

        <p className="font-bold text-white mt-4">4. Learner Code of Conduct</p>
        <p>
          All members are expected to engage respectfully with instructors,
          mentors, and fellow learners. Harassment, plagiarism, sharing of
          proprietary course content, or any conduct that disrupts the learning
          environment will result in immediate suspension or termination of
          membership.
        </p>

        <p className="font-bold text-white mt-4">5. Intellectual Property</p>
        <p>
          All course materials, videos, guides, and resources provided through
          CLUB369 are the intellectual property of CLUB369 and its educators.
          Members may not reproduce, distribute, or commercially exploit any
          content without prior written permission.
        </p>
      </FooterModal>
    </>
  );
};

export default Footer;