import React from 'react'

export const Footer = () => {
  return (
    <div>
      <footer className="bg-secondary text-white text-center p-4 mt-8">
        &copy; {new Date().getFullYear()} VinceNet Solutions. All rights reserved.
      </footer>
    </div>
  )
}
