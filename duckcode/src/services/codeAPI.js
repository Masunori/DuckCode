export const executeCode = async (language, source) => {
    const apiUrl = "http://localhost:5000/api/code/run";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, source }),
      });
      return await response.json();
    } catch (error) {
      console.error("Code execution failed:", error);
      throw error;
    }
  };
  