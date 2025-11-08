'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025)
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentYear(new Date().getFullYear())
  }, [])

  const footerLinks = {
    product: {
      title: 'Product',
      links: [
        { name: 'Echo Garden', href: '/garden' },
        { name: 'Wellness Activities', href: '/activities' },
        { name: 'Mood Tracking', href: '/garden' },
        { name: 'AI Companion', href: '/garden' },
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/#pricing' },
      ]
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Learning Center', href: '/learn' },
        { name: 'Community', href: '/community' },
        { name: 'Blog', href: '/blog' },
        { name: 'Research', href: '/research' },
        { name: 'Careers', href: '/careers' },
      ]
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Crisis Resources', href: '/crisis' },
        { name: 'Feedback', href: '/feedback' },
        { name: 'Status', href: '/status' },
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Mission', href: '/mission' },
        { name: 'Team', href: '/team' },
        { name: 'Press', href: '/press' },
        { name: 'Partners', href: '/partners' },
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms and Conditions', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Community Guidelines', href: '/guidelines' },
        { name: 'Data Protection', href: '/data-protection' },
      ]
    }
  }

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/echobloom', color: 'hover:text-[#0A66C2]' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/echobloom', color: 'hover:text-[#1DA1F2]' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/echobloom', color: 'hover:text-[#E4405F]' },
    { name: 'Youtube', icon: Youtube, href: 'https://youtube.com/@echobloom', color: 'hover:text-[#FF0000]' },
  ]

  return (
    <footer className="bg-navy border-t border-moss/20">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-moss/20">
        <div className="max-w-xl">
          <h3 className="text-2xl font-bold font-quicksand text-white mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-sky/80 font-quicksand mb-6">
            Stay up to date with the latest wellness tips, features, and mental health insights.
          </p>
          <div className="flex gap-3" suppressHydrationWarning>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-moss/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset text-white placeholder:text-sky/50 font-quicksand"
              suppressHydrationWarning
            />
            <button 
              className="px-6 py-3 bg-gradient-to-r from-sunset to-petal text-white font-medium font-quicksand rounded-lg hover:from-petal hover:to-sunset transition-all shadow-lg flex items-center gap-2"
              suppressHydrationWarning
            >
              Subscribe
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Product */}
          <div>
            <h4 className="text-white font-bold font-quicksand mb-4">{footerLinks.product.title}</h4>
            <ul className="space-y-3">
              {footerLinks.product.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sky/70 hover:text-sunset font-quicksand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold font-quicksand mb-4">{footerLinks.resources.title}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sky/70 hover:text-sunset font-quicksand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold font-quicksand mb-4">{footerLinks.support.title}</h4>
            <ul className="space-y-3">
              {footerLinks.support.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sky/70 hover:text-sunset font-quicksand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold font-quicksand mb-4">{footerLinks.company.title}</h4>
            <ul className="space-y-3">
              {footerLinks.company.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sky/70 hover:text-sunset font-quicksand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold font-quicksand mb-4">{footerLinks.legal.title}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sky/70 hover:text-sunset font-quicksand text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-moss/20">
          <div className="mb-6">
            <h4 className="text-white font-bold font-quicksand mb-2">Contact</h4>
            <p className="text-sky/70 font-quicksand text-sm mb-1">
              📞 +1 (555) 123-4567
            </p>
            <a 
              href="mailto:support@echobloom.com"
              className="text-sky/70 hover:text-sunset font-quicksand text-sm transition-colors"
            >
              📧 support@echobloom.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-moss/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left: Made with love */}
            <div className="flex items-center gap-2 text-sky/70 font-quicksand text-sm">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-sunset fill-sunset" />
              <span>for mental wellness</span>
            </div>

            {/* Center: Copyright */}
            <div className="text-sky/70 font-quicksand text-sm" suppressHydrationWarning>
              Copyright © {currentYear} EchoBloom. All rights reserved
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sky/70 ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Helpline Banner (Optional - can be shown conditionally) */}
      <div className="bg-sunset/10 border-t border-sunset/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-sm font-quicksand text-white">
            <span className="font-bold">Crisis Support:</span> If you're in crisis, please call{' '}
            <a href="tel:988" className="underline hover:text-sunset transition-colors">
              988 (Suicide & Crisis Lifeline)
            </a>
            {' '}or{' '}
            <a href="tel:1-800-273-8255" className="underline hover:text-sunset transition-colors">
              1-800-273-8255
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
