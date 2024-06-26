const customFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Handle HTTP errors by navigating to the error page
      window.location.href = '/error';
    }

    return response.json();
  } catch (error) {
    // Handle fetch errors (e.g., network issues)
    console.error('Fetch Error:', error);
    window.location.href = '/error';
  }
};

export default customFetch;