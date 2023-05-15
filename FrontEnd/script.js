// --- Récupération des projets de l'API ---
async function getWorks() {
  const response = await fetch("http://http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}
// --- Récupération des catégories de l'API ---
async function getCategory() {
  const response = await fetch("http://http://localhost:5678/api/categories");
  const worksCategory = await response.json();
  return worksCategory;
}
