async function getWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) {
        throw new Error("La requête n'a pas abouti - " + response.status);
      }
      const data = await response.json();
      arrayData = data;
      populateGallery(data);
      populateGalleryModal(data);
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
    }
  }