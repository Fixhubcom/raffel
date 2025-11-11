import React from 'react';

// A starship or a planet with a ring
export const StarshipIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.71 5.25a.75.75 0 01.47.68v1.36l3.38-2.54a.75.75 0 01.94 0l3.38 2.54v-1.36a.75.75 0 01.47-.68l1.49-.49a.75.75 0 01.93.93l-.49 1.49a.75.75 0 01-.68.47h-1.36l-2.54 3.38a.75.75 0 01-.94 0L9.03 7.55H7.67a.75.75 0 01-.68-.47l-.49-1.49a.75.75 0 01.93-.93l1.49.49z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM12 11.25a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 00-6-6H4.5a.75.75 0 000 1.5h1.5a4.5 4.5 0 014.5 4.5v.75a.75.75 0 001.5 0v-.75zm0 0a6 6 0 016-6h1.5a.75.75 0 010 1.5h-1.5a4.5 4.5 0 00-4.5 4.5v.75a.75.75 0 01-1.5 0v-.75z" />
  </svg>
);

// A spiral galaxy
export const GalaxyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5a4.5 4.5 0 11-4.5 4.5A4.5 4.5 0 0112 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v-1.5m0 1.5a4.5 4.5 0 00-4.5 4.5h-1.5m6-4.5a4.5 4.5 0 014.5 4.5h1.5m-6 4.5v1.5m0-1.5a4.5 4.5 0 01-4.5-4.5H7.5m6 4.5a4.5 4.5 0 004.5-4.5h1.5M12 21a9 9 0 110-18 9 9 0 010 18z" />
  </svg>
);

// A futuristic data chip
export const CreditChipIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 014.5 3.75h15a.75.75 0 01.75.75v15a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75v-15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h3v3h-3v-3zM7.5 13.5h3v3h-3v-3zM13.5 7.5h3v3h-3v-3zM13.5 13.5h3v3h-3v-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M12 3.75v16.5" />
  </svg>
);

// A retro-futuristic joystick
export const JoystickIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l-3.125 3.125a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 010-1.06l3.125-3.125m5.625 0l3.125 3.125a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06 0l-3.125-3.125M12 3.75v4.5m0 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 0l-1.5-1.5m1.5 1.5l1.5-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 15.75h13.5c.621 0 1.125-.504 1.125-1.125V10.5a1.125 1.125 0 00-1.125-1.125H5.25A1.125 1.125 0 004.125 10.5v4.125c0 .621.504 1.125 1.125 1.125z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 18.75h10.5" />
  </svg>
);

// An astronaut helmet
export const AstronautIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 01-8.25-8.25V12a8.25 8.25 0 0116.5 0v.75A8.25 8.25 0 0112 21z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75a7.5 7.5 0 0115 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14.25a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H8.25z" />
  </svg>
);

// A futuristic control panel or server rack
export const ControlPanelIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h.01M7.5 12h.01m0 4.5h.01M12 7.5h4.5M12 12h4.5m-4.5 4.5h4.5" />
  </svg>
);