export default {
  async fetch(request: Request, env: Env) {
    try {
      // Step 1: Parse the URL to get query parameters
      const url = new URL(request.url);
      const promptParam = url.searchParams.get('prompt');  // Get the 'prompt' query parameter

      // Step 2: Validate and set the prompt
      // Use a default if no prompt is provided, and ensure it's a non-empty string
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

      // Step 4: Return the response as an image
      return new Response(response, {
        headers: {
          "content-type": "image/png",
        },
      });
    } catch (error) {
      // Step 5: Handle errors gracefully
      console.error('Error in fetch handler:', error);  // Log for debugging
      return new Response('Error: Something went wrong. Please provide a valid prompt.', {
        status: 500,  // Internal Server Error
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  },
} satisfies ExportedHandler<Env>;
