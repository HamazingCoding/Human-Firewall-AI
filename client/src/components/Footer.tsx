import { Link } from "wouter";
import { Shield, Globe, MessageSquare, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent-teal flex items-center justify-center mr-2">
                <Shield className="text-white w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Human Firewall AI</h3>
            </div>
            <p className="text-gray-400 text-sm">Protecting humans from digital deception through advanced AI detection.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features"><a className="text-gray-400 hover:text-accent-teal transition">Features</a></Link></li>
              <li><Link href="/pricing"><a className="text-gray-400 hover:text-accent-teal transition">Pricing</a></Link></li>
              <li><Link href="/enterprise"><a className="text-gray-400 hover:text-accent-teal transition">Enterprise</a></Link></li>
              <li><Link href="/api-docs"><a className="text-gray-400 hover:text-accent-teal transition">API Documentation</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog"><a className="text-gray-400 hover:text-accent-teal transition">Blog</a></Link></li>
              <li><Link href="/knowledge-base"><a className="text-gray-400 hover:text-accent-teal transition">Knowledge Base</a></Link></li>
              <li><Link href="/community"><a className="text-gray-400 hover:text-accent-teal transition">Community Forum</a></Link></li>
              <li><Link href="/webinars"><a className="text-gray-400 hover:text-accent-teal transition">Webinars</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about"><a className="text-gray-400 hover:text-accent-teal transition">About Us</a></Link></li>
              <li><Link href="/careers"><a className="text-gray-400 hover:text-accent-teal transition">Careers</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-accent-teal transition">Contact</a></Link></li>
              <li><Link href="/privacy"><a className="text-gray-400 hover:text-accent-teal transition">Privacy Policy</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Human Firewall AI. All rights reserved.</p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-accent-teal transition">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-accent-teal transition">
              <MessageSquare className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-accent-teal transition">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
