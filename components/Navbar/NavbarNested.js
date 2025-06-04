// "use client";
// import {
//   IconAdjustments,
//   IconCalendarStats,
//   IconFileAnalytics,
//   IconGauge,
//   IconLock,
//   IconNotes,
//   IconPresentationAnalytics,
// } from '@tabler/icons-react';
// import { Group, ScrollArea } from '@mantine/core';
// import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
// import { UserButton } from '../UserButton/UserButton';
// import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
// import Link from 'next/link'; // Import Link from Next.js
// import classes from './NavbarNested.module.css';

// const mockdata = [
//   { label: 'Dashboard', icon: IconGauge, link: '/' },
//   {
//     label: 'Venue',
//     icon: IconNotes,
//     initiallyOpened: true,
//     links: [
//       { label: 'Book Venue', link: '/bookvenue' },
//       { label: 'Venue Requests', link: '/booked' },
//     ],
//   },
//   {
//     label: 'Hall',
//     icon: IconPresentationAnalytics,
//     initiallyOpened: true,
//     links: [
//       { label: 'Create Hall', link: '/createHall' },
//       { label: 'Hall List', link: '/hallList' },
//     ],
//   },
//   {
//     label: 'Terms',
//     icon: IconPresentationAnalytics,
//     initiallyOpened: true,
//     links: [
//       { label: 'Create Term', link: '/termCreate' },
//       { label: 'Term List', link: '/stat' },
//     ],
//   },
//   {
//     label: 'Analytics',
//     icon: IconPresentationAnalytics,
//     initiallyOpened: true,
//     links: [
//       { label: 'Overall Stat', link: '/stat' },
//       { label: 'Monthly Stat', link: '/stat' },
//       { label: 'Yearly Stat', link: '/stat' },
//     ],
//   },
//   {
//     label: 'Register',
//     icon: IconFileAnalytics,
//     initiallyOpened: true,
//     links: [
//       { label: 'Register Admin', link: '/registerAdmin' },
//       { label: 'Admins List', link: '/adminList' },
//     ],
//   },
//   {
//     label: 'Settings',
//     icon: IconLock,
//     initiallyOpened: true,
//     links: [
//       { label: 'Set Price', link: '/mapDaysPrice' },
//       { label: 'Members Discount', link: '/membersDiscount' },
//     ],
//   },
//   {
//     label: 'Reports',
//     icon: IconPresentationAnalytics,
//     initiallyOpened: true,
//     links: [
//       { label: 'Overall Report', link: '/reportOverall' },
//       { label: 'Monthly Report', link: '/reportMonthly' },
//       { label: 'Customer Report', link: '/reportCustomer' },
//     ],
//   },
//   {
//     label: 'Security',
//     icon: IconLock,
//     initiallyOpened: true,
//     links: [
//       { label: 'Change password', link: '/forgetpass' },
//       { label: 'Recovery codes', link: '/' },
//     ],
//   },
// ];

// export function NavbarNested() {
//   return (
//     <nav className={classes.navbar}>
//       <div className={classes.header}>
//         <Group justify="space-between">
//           <div>Book Dashboard</div>
//           <ColorSchemeToggle />
//         </Group>
//       </div>

//       <ScrollArea className={classes.links}>
//         <div className={classes.linksInner}>
//           {mockdata.map((item) => (
//             <div key={item.label}>
//               <div className={classes.linkHeader}>
//                 <item.icon />
//                 {item.label}
//               </div>
//               {item.links && item.links.map((link) => (
//                 <Link href={link.link} key={link.label} passHref>
//                   <div className={classes.linkItem}>
//                     {link.label}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ))}
//         </div>
//       </ScrollArea>

//       <div className={classes.footer}>
//         <UserButton />
//       </div>
//     </nav>
//   );
// }


"use client";
import {
  IconAdjustments,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
} from '@tabler/icons-react';
import { Group, ScrollArea, Collapse } from '@mantine/core';
import { UserButton } from '../UserButton/UserButton';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import Link from 'next/link'; // Import Link from Next.js
import { useState } from 'react';
import classes from './NavbarNested.module.css';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge, 
    links: [
      { label: 'Home', link: '/stat' },
      { label: 'Log Out', link: '/' },
    ],
   },
  {
    label: 'Father',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Father Registration', link: '/fatherReg' },
      { label: 'Father List', link: '/fatherList' },
    ],
  },
  {
    label: 'Children',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Children Registartion', link: '/childrenReg' },
      { label: 'Children List', link: '/childrenList' },
    ],
  },

  {
    label: 'Generate Certeficate',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Certeficate', link: '/generateCerteficate' },
     
    ],
  },


  {
        label: 'Link',
        icon: IconPresentationAnalytics,
        initiallyOpened: true,
        links: [
          { label: 'Link', link: '/link' },
          // { label: 'Term List', link: '/termList' },
        ],
      },


      {
        label: 'Resource',
        icon: IconPresentationAnalytics,
        initiallyOpened: true,
        links: [
          { label: 'Register Resource', link: '/registerResource' },
          // { label: 'Schedule List', link: '/scheduleList' },
        ],
      },

      // {
      //   label: 'Promo',
      //   icon: IconPresentationAnalytics,
      //   initiallyOpened: true,
      //   links: [
      //     { label: 'Create Promo', link: '/promoCreate' },
      //     { label: 'Promo List', link: '/promoList' },
      //   ],
      // },

      {
        label: 'Analytics',
        icon: IconPresentationAnalytics,
        initiallyOpened: true,
        links: [
          { label: 'Overall Stat', link: '/stat' },
          { label: 'Monthly Stat', link: '/stat' },
          { label: 'Yearly Stat', link: '/stat' },
        ],
      },
      // {
      //   label: 'Register',
      //   icon: IconFileAnalytics,
      //   initiallyOpened: true,
      //   links: [
      //     { label: 'Register Admin', link: '/registerAdmin' },
      //     { label: 'Admins List', link: '/adminList' },
      //   ],
      // },
      // {
      //   label: 'Settings',
      //   icon: IconLock,
      //   initiallyOpened: true,
      //   links: [
      //     { label: 'Set Price', link: '/mapDaysPrice' },
      //     // { label: 'Members Discount', link: '/membersDiscount' },
      //   ],
      // },
      {
        label: 'Reports',
        icon: IconPresentationAnalytics,
        initiallyOpened: true,
        links: [
          { label: 'Overall Report', link: '/reportOverall' },
          { label: 'Monthly Report', link: '/reportMonthly' },
          { label: 'Customer Report', link: '/reportCustomer' },
        ],
      },
      {
        label: 'Security',
        icon: IconLock,
        initiallyOpened: true,
        links: [
          { label: 'Change password', link: '/changePass' },
          { label: 'Recovery codes', link: '/' },
        ],
      },
  // Add other sections as needed...
];

export function NavbarNested() {
  const [opened, setOpened] = useState({});

  const toggleLink = (label) => {
    setOpened((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <div className={classes.dashboardTitle}>Certeficate</div>
          <ColorSchemeToggle />
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {mockdata.map((item) => (
            <div key={item.label}>
              <div
                className={classes.linkHeader}
                onClick={() => toggleLink(item.label)}
              >
                <item.icon color="#00ffcc" size={20} style={{marginRight:15,marginTop:5}}/> {/* Neon color for icons */}
                {item.label}
              </div>
              {item.links && (
                <Collapse in={opened[item.label]}>
                  {item.links.map((link) => (
                    <Link href={link.link} key={link.label} passHref>
                      <div className={classes.linkItem}>
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </Collapse>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}