import type { NextApiRequest, NextApiResponse } from 'next';
import scrapeWebsite from './../../../utils/scraper/scrape';

type Data = {
  urls?: string[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const urls = await scrapeWebsite(url);
    res.status(200).json({ urls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
