const gallery = document.querySelector(`.gallery`);
const btnFilter = document.querySelector(`.btn-filter-container`);

//-- Récuparation des projet dans l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

//-- Récupération des catégories dans l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const category = await response.json();
  const btnAll = { id: 0, name: `Tous`};
  category.unshift(btnAll);
  return category;
}
//-- Création et affichage des boutons filtres
async function displayCategoriesBtn() {
  const category = await getCategories();
  for (let i = 0; i < category.length; i += 1) {
    const btn = document.createElement('button');
    btn.classList.add(`btn-filter`);
    btn.innerText = category[i].name;
    btn.setAttribute(`id`, category[i].id);
    btnFilter.appendChild(btn);

    if (category[i].id === 0) {
      btn.classList.add(`btn-filter:focus`);
    }
    btn.addEventListener(`click`, function() {
      const allbtnFilter = document.querySelectorAll(`.btn-filter`);
      allbtnFilter.forEach(btn => {
        btn.classList.remove(`btn-filter:focus`);
      });
      btn.classList.toggle(`btn-filter:focus`);
      showWorksByCategory(category[i].id);
    });
  }
}
displayCategoriesBtn();

//-- Filtrage des projets
async function showWorksByCategory(categoryId) {
  if (!gallery) {
    return;
  }
  gallery.innerHTML = "";
  let itemWorks = await getWorks();
  if (categoryId !== 0) {
    itemWorks = itemWorks.filter(work => work.categoryId === categoryId);
  }

  itemWorks.forEach(work => {
    const figureGallery = document.createElement(`figure`);
    const figureImgGallery = document.createElement(`img`);
    const figureFigCaptionGallery = document.createElement(`figcaption`);
    figureImgGallery.src = work.imageUrl;
    figureImgGallery.alt = work.title;
    figureFigCaptionGallery.innerText = work.title;
    gallery.appendChild(figureGallery);
    figureGallery.append(figureImgGallery, figureFigCaptionGallery);
  });
}
showWorksByCategory(0);
