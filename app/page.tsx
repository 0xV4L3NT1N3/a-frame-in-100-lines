import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({

  // cover image 

  image: {
    src: `${NEXT_PUBLIC_URL}/cover.png`,
    aspectRatio: '1:1',
  },

  // list available buttons

  buttons: [
    {
      label: 'Scan 🔍',
    },
  ],

  // post url to call
  
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,

});

// no fucking clue where this appears

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: [`https://zizzamia.xyz/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Don't open this via a browser you silly goose, use Warpcast</h1>
    </>
  );
}
