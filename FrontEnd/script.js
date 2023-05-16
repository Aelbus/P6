const gallery = document.querySelector(`.gallery`);
const btnFilter = document.querySelector(`.btn-filter-container`);

//--- Récuparation des projet dans l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

//--- Récupération des catégories dans l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const arrCategories = await response.json();
//--- Insertion du bouton "Tous"
  const btnAll = { id: 0, name: `Tous`};
  arrCategories.unshift(btnAll);
  return arrCategories;
}
//--- Création et affichage des boutons filtres
async function displayCategoriesBtn() {
  const arrCategories = await getCategories();
  for (let i = 0; i < arrCategories.length; i += 1) {
    const btn = document.createElement('button');
    btn.classList.add(`btn-filter`);
    btn.innerText = arrCategories[i].name;
    btn.setAttribute(`id`, arrCategories[i].id);
    btnFilter.appendChild(btn);

    if (arrCategories[i].id === 0) {
      btn.classList.add(`btn-filter:focus`);
    }
    btn.addEventListener(`click`, function() {
      const allbtnFilter = document.querySelectorAll(`.btn-filter`);
      allbtnFilter.forEach(btn => {
        btn.classList.remove(`btn-filter:focus`);
      });
      btn.classList.toggle(`btn-filter:focus`);
      showWorksByCategory(arrCategories[i].id);
    });
  }
}
displayCategoriesBtn();

// --- Filtrage des projets ---
async function showWorksByCategory(categoryId) {
  if (!gallery) {
    return;
  }
  gallery.innerHTML = "";
  let arrWorks = await getWorks();
  if (categoryId !== 0) {
    arrWorks = arrWorks.filter(work => work.categoryId === categoryId);
  }

  arrWorks.forEach(work => {
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
