import { useState } from "react";
import { Link } from "wouter";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary py-4 px-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-lg bg-accent-teal flex items-center justify-center mr-3">
            <Shield className="text-white w-6 h-6" />
          </div>
          <Link href="/">
            <h1 className="text-2xl font-bold text-white cursor-pointer">Human Firewall AI</h1>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-accent-teal/20"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/">
            <a className="text-white hover:text-accent-teal transition">Home</a>
          </Link>
          <Link href="/documentation">
            <a className="text-white hover:text-accent-teal transition">Documentation</a>
          </Link>
          <Link href="/about">
            <a className="text-white hover:text-accent-teal transition">About</a>
          </Link>
          <Button className="bg-accent-teal text-white hover:bg-accent-teal/90">
            Get Started
          </Button>
        </nav>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col w-full space-y-4 mt-4">
            <Link href="/">
              <a className="text-white hover:text-accent-teal transition text-center py-2">Home</a>
            </Link>
            <Link href="/documentation">
              <a className="text-white hover:text-accent-teal transition text-center py-2">Documentation</a>
            </Link>
            <Link href="/about">
              <a className="text-white hover:text-accent-teal transition text-center py-2">About</a>
            </Link>
            <Button className="bg-accent-teal text-white w-full">
              Get Started
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
