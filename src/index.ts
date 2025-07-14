export default {
  async fetch(request: Request, env: Env) {
    try {
      // Step 1: Parse the URL to get query parameters
      const url = new URL(request.url);
      const promptParam = url.searchParams.get('prompt');  // Get the 'prompt' query parameter

      // Step 2: Validate and set the prompt
      const prompt = typeof promptParam === 'string' && promptParam.trim() !== '' 
        ? promptParam.trim()  // Use the provided prompt if valid
        : 'cyberpunk cat';    // Default to your original prompt

      const inputs = {
        prompt: prompt,  // Now dynamically set
      };

      // Step 3: Run the AI model
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs,
      );

      // Step 4: Get the Origin from the request and set CORS header dynamically
      const origin = request.headers.get('Origin');  // Get the Origin header from the request
      const allowedOrigin = 'https://cruzferreira.com.br';  // Your trusted origin - adjust if needed

      // Only set the header if the request's Origin matches your allowed origin
      const headers = new Headers({
        "content-type": "image/png",
      });

      if (origin === allowedOrigin) {
        headers.set("Access-Control-Allow-Origin", origin);  // Set to the request's Origin if it matches
      } else {
        // Optionally log or handle unauthorized origins
        console.warn(`Unauthorized origin: ${origin}`);
      }

      // Step 5: Return the response
      return new Response(response, {
        headers: headers,
      });
    } catch (error) {
      // Step 6: Handle errors gracefully, and add CORS header
      console.error('Error in fetch handler:', error);  // Log for debugging
      const headers = new Headers({
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": 'https://cruzferreira.com.br',  // Set to your trusted origin
      });
      return new Response('Error: Something went wrong. Please provide a valid prompt.', {
        status: 500,  // Internal Server Error
        headers: headers,
      });
    }
  },
} satisfies ExportedHandler<Env>;
