import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
 
  // validate & decode frame message

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  // get calling address & input message

  let accountAddress: string | undefined = '';
  let text: string | undefined = '';
  
  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  // check Etherscan gas

  const gasPrice = await fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=36RCTB2YVWFPQ2P1IY7V353PSVPYK7E4DT").then((res => res.json()))
  console.log(gasPrice)

  // return next frame

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'View on Etherscan',
          target: 'https://etherscan.io/gastracker',
        }
      ],
      image: {
        src: `https://zizzamia.xyz/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
