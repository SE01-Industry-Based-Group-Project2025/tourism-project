// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-700">
            SL Tour Pal
          </h1>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary-500">Home</Link>
            <Link to="/login" className="text-gray-600 hover:text-primary-500">Login</Link>
            <Link to="/register" className="text-gray-600 hover:text-primary-500">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/hero-bg.jpg')" }}
      >
        <div className="h-full bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Discover Sri Lanka
            </h2>
            <p className="mb-6 text-lg md:text-xl">
              Your adventure begins here
            </p>
            <Link
              to="/register"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow">
              <h4 className="text-xl font-semibold mb-2">Hand-picked Tours</h4>
              <p className="text-gray-600">
                We curate the best local experiences just for you.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h4 className="text-xl font-semibold mb-2">Secure Payments</h4>
              <p className="text-gray-600">
                PCI-compliant gateway keeps your data safe.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
              <p className="text-gray-600">
                We’re here to help, any time of day or night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          © {new Date().getFullYear()} SL Tour Pal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
