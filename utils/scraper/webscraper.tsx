import { Builder, By, WebDriver } from 'selenium-webdriver';
import fs from 'fs';
import readlineSync from 'readline-sync';
import { URL } from 'url';

// Function to scrape links from a given URL
async function scrapeLinks(url: string): Promise<void> {
    // Set up the WebDriver
    let driver: WebDriver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the page
        await driver.get(url);

        // Allow some time for the page to load
        await driver.sleep(5000); // Adjust this time as needed

        // Find all <a> tags with 'Download' text
        let downloadLinks = await driver.findElements(By.xpath("//td[contains(@class, 'DownloadCell')]//a[contains(text(), 'Download')]"));

        // Base URL of the site
        const baseUrl = new URL(url).origin;

        // Extract the full URLs
        let fullUrls: string[] = [];
        for (let link of downloadLinks) {
            let href = await link.getAttribute('href');
            if (href || href.endsWith('.pdf')) {
                let fullUrl = new URL(href, baseUrl).href;
                fullUrls.push(fullUrl);
            }
        }

        // Save the links to a file
        fs.writeFileSync('urls.txt', fullUrls.join('\n'));

        console.log("All download links have been saved to urls.txt");

    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Get URL from user input
const url: string = readlineSync.question('Enter the URL to scrape: ');

// Call the scrape function
scrapeLinks(url).catch(console.error);
