export const resetPassword = async (formData) => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      
  
      const finalData = await response.json();
  
      return finalData;
    } catch (e) {
      console.log("error", e);
      
    }
  };