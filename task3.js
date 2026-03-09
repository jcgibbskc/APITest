// Load environment variables from .env file
require('dotenv').config();

// Import https module (built-in, works with all Node.js versions)
const https = require('https');

// Function to make GET request
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      // Receive data chunks
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // All data received
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP error! Status: ${response.statusCode}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to fetch posts from the API
async function fetchPosts() {
  try {
    // Get the base URL from environment variable
    const baseUrl = process.env.API_BASE_URL;
    
    // Check if the environment variable is set
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not defined in .env file');
    }
    
    // Construct the full endpoint URL (just add /posts, not /posts/posts)
    const endpoint = `${baseUrl}/posts`;
    
    console.log(`Fetching data from: ${endpoint}`);
    
    // Make GET request to the API
    const posts = await httpsGet(endpoint);
    
    console.log(`Successfully retrieved ${posts.length} posts\n`);
    
    // Extract and display titles
    console.log('Titles:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
    });
    
  } catch (error) {
    // Error handling
    console.log('Error occurred while fetching posts:');
    console.log(`Error Type: ${error.name}`);
    console.log(`Error Message: ${error.message}`);
    
    // Additional error details if available
    if (error.cause) {
      console.log(`Error Cause: ${error.cause}`);
    }
  }
}

// Execute the function
fetchPosts();