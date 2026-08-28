// app/page.js
'use client';

import HomeClient from '@/components/HomeClient';
import { gallery, members } from '@/data/siteData';

export default function HomePage() {
  return <HomeClient members={members} gallery={gallery} />;
}
