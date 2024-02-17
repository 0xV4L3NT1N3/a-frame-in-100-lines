import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import satori from 'satori'
import sharp from 'sharp';
import { join } from 'path';
import * as fs from "fs";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

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

  // generate image 

  const price = gasPrice.result.ProposeGasPrice + " Gwei"
  const block = gasPrice.result.LastBlock

  const svg = await satori(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        fontSize: 80,
        fontWeight: 600,
      }}
    >
      <img src="https://etherscan.io/images/smile2.png" height={50} width={50} />
      <div style={{ marginTop: 40 }}>{price}</div>
    </div>,
    {
      width: 800,
      height: 800,
      fonts: [
        {
          name: 'Roboto',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  )

  // convert svg to png

  const pngBuffer = await sharp(Buffer.from(svg))
    .toFormat('png')
    .toBuffer();

  const png64 = pngBuffer.toString('base64')

  // return next frame

  const nextFrame = new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'View on Etherscan',
          target: 'https://etherscan.io/gastracker',
        }
      ],
      image: {
        src: `data:image/png;base64,${png64}`,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );

  return nextFrame

}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
