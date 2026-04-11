import React from "react";
import Link from "next/link";
import { Branding } from "@/types/branding";

import packageJson from '../../package.json';

interface FooterProps {
  branding: Branding;
}

const Footer: React.FC<FooterProps> = ({ branding }) => {
  const version = packageJson.version;
    
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="mb-3">{branding.name}</h5>
            <p className="mb-3">{branding.description}</p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-sm btn-outline-light rounded-circle">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-light rounded-circle">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-light rounded-circle">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> {branding.address.line1}, {branding.address.line2}, {branding.address.postTown}, {branding.address.county}, {branding.address.postCode}
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i> {branding.contact.phone} 
              </li>
              <li>
                <i className="bi bi-envelope me-2"></i> {branding.contact.email}
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">Home</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">Rooms</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">Booking</a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <small>restful-booker-platform v{version} Created by <a href="http://www.mwtestconsultancy.co.uk">Mark Winteringham</a> - &copy; 2019-26 <Link href="/cookie">Cookie-Policy</Link> - <Link href="/privacy">Privacy-Policy</Link> - <Link href="/admin">Admin panel</Link> </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
