import React from 'react';
import { ShoppingCart, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-8 h-8 text-pink-500" />
              <h2 className="text-2xl font-bold text-white">KART</h2>
            </div>
            <p className="text-sm mb-4">Powering Your World with the Best in Electronics.</p>
            <p className="text-sm">123 Electronics St, Style City, NY 10001</p>
            <p className="text-sm">Email: support@2aptro.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <p className="text-sm mb-2">Contact Us</p>
            <p className="text-sm mb-2">Shipping & Returns</p>
            <p className="text-sm mb-2">FAQs</p>
            <p className="text-sm mb-2">Order Tracking</p>
            <p className="text-sm">Size Guide</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Facebook className="w-6 h-6" />
              <Instagram className="w-6 h-6" />
              <Twitter className="w-6 h-6" />
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0a12 12 0 0 0-4.37 23.17c-.2-.81-.38-2.07.08-2.96.42-.81 2.7-11.44 2.7-11.44s-.69-1.38-.69-3.42c0-3.2 1.86-5.6 4.17-5.6 1.97 0 2.92 1.48 2.92 3.25 0 1.98-1.26 4.94-1.91 7.68-.54 2.29 1.15 4.15 3.42 4.15 4.1 0 7.25-4.32 7.25-10.56 0-5.52-3.97-9.38-9.64-9.38-6.57 0-10.43 4.93-10.43 10.03 0 1.98.77 4.11 1.72 5.27.19.23.22.43.16.67-.17.71-.56 2.29-.64 2.61-.1.42-.35.51-.8.31-2.81-1.31-4.57-5.42-4.57-8.72 0-7.11 5.16-13.64 14.88-13.64 7.81 0 13.89 5.57 13.89 13.01 0 7.76-4.89 14.01-11.67 14.01-2.28 0-4.42-1.18-5.15-2.58 0 0-1.13 4.3-1.4 5.35-.51 1.95-1.88 4.39-2.8 5.88A12 12 0 1 0 12 0z"/>
              </svg>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay in the Loop</h3>
            <p className="text-sm mb-4">Subscribe to get special offers, free giveaways, and more</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded bg-gray-800 text-white text-sm"
              />
              <button className="px-6 py-2 bg-pink-500 text-white rounded">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm">
        © 2025 <span className="text-pink-500">Kart</span>. All rights reserved
      </div>
    </footer>
  );
}