// Metodo GET

export const get = async () => {
    const url = "http://localhost:27017/instagram";
    try {
      const response = await fetch(url);
      if (response.ok) {
        const payload = await response.json();
        return payload;
      } else {
        console.error("An error happened");
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Metodo POST
  export const add = async (newDish) => {
    const response = await fetch("http://localhost:27017/instagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDish),
    });
    const data = await response.json();
    return data;
  };
  
  // Metodo DELETE
  export const deletee = async (id) => {
    await fetch("http://localhost:27017/instagram", {
      method: "DELETE",
    });
  };
  
  // Metodo PUT /*
  export const edit = async (id) => {
    const response = await fetch("http://localhost:27017/instagram", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });
    const data = await response.json();
    return data;
  }