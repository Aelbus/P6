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
  const btnAll = { id: 0, name: `Tous` };
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
      btn.classList.add(`btn-filter-focus`);
    }
    btn.addEventListener(`click`, function () {
      const allbtnFilter = document.querySelectorAll(`.btn-filter`);
      allbtnFilter.forEach(btn => {
        btn.classList.remove(`btn-filter-focus`);
      });
      btn.classList.toggle(`btn-filter-focus`);
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

//-- Gestion de la connexion 
window.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login");
  const logoutLink = document.getElementById("logout");

  if (localStorage.getItem("token")) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline-block"
    logoutLink.addEventListener("click", function () {
      localStorage.removeItem("token");
    });
    //-- Afficher la div "container-edit"
    const containerEdit = document.querySelector(".container-edit");
    containerEdit.style.display = "flex";

    //-- Afficher les boutons "btn-modifier"
    const btnModifier = document.querySelectorAll(".btn-modifier");
    btnModifier.forEach(function (button) {
      button.style.display = "inline-block";
    });
  }
});

const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modalContainer");
const modalGalery = document.getElementById("modalGalery");
const modalAdd = document.getElementById("modalAdd");


//----MODAL----//

//-- Afficher La Modal
const modalTrigger = document.getElementById("modal-trigger");
modalTrigger.addEventListener("click", function () {
  modal.style.display = "block";
})

//-- Fermer la Modal
const exitModal = document.querySelectorAll(".btn-exit");
exitModal.forEach(exitButton =>
  exitButton.addEventListener("click", function () {
    modalAdd.style.display = "none";
    modalGalery.style.display = "flex";
    modal.style.display = "none";
  })
)
window.addEventListener("click", function (event) {
  if (event.target === modalContainer) {
    modalGalery.style.display = "flex"
    modalAdd.style.display = "none";
    modal.style.display = "none";
  }
});

//-- Passage sur la modal "ModalAdd"
const addPicture = document.querySelector(".btn-addWork");
addPicture.addEventListener("click", function () {
  modalGalery.style.display = "none";
  modalAdd.style.display = "block";
})

//-- Retour sur la modal "ModalGalery"
const returnModal = document.querySelector(".btn-back");
returnModal.addEventListener("click", function () {
  modalAdd.style.display = "none";
  modalGalery.style.display = "flex";
})


//----MODALGALERY----//
//-- Affichage des éléments works dans la Modal "ModalGalery"
function displayWorks(works) {
  works.forEach(work => {
    addFigureToGaleryContainer(work);
  });
}

function addFigureToGaleryContainer(work) {
  const galeryContainer = document.querySelector('.galeryContainer');
  const figure = document.createElement('figure');
  const img = document.createElement('img');

  img.src = work.imageUrl;
  img.alt = work.title;

  figure.appendChild(img);

  const iconsContainer = document.createElement('div');
  iconsContainer.classList.add('icons-container');

  const resizeIcon = document.createElement('i');
  resizeIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'resize-ico');
  iconsContainer.appendChild(resizeIcon);

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fa-solid', 'fa-trash-can');
  iconsContainer.appendChild(deleteIcon);

  figure.appendChild(iconsContainer);

  const editLink = document.createElement('a');
  editLink.textContent = 'Éditer';
  figure.appendChild(editLink);

  // Gestionnaire d'événement pour la suppression d'un élément
  deleteIcon.addEventListener('click', async () => {
    await deleteWork(work.id);
    figure.remove();
  });
  galeryContainer.appendChild(figure);
}
async function deleteWork(workId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      showWorksByCategory(0);
      console.log('Supprimer avec succès');
    }
    else {
      console.log('Une erreur s\'est produite lors de la suppression');
    }
  }
  catch (error) {
    console.log('Une erreur s\'est produite lors de la suppression', error);
  }
}
async function displayWorksInModal() {
  const works = await getWorks();
  displayWorks(works);
}

displayWorksInModal();

//----MODALADD----//

//-- Gestion de l'image Upload ModalAdd
const changeFiles = document.getElementById("returnPreview")
const addImgElements = document.querySelectorAll(".addImg i, .addImg label, .addImg input, .addImg p");
let image = document.getElementById("imagePreview");

let previewPicture = function (e) {
  const [picture] = e.files;
  if (picture) {
    //-- Affichage du preview
    image.src = URL.createObjectURL(picture);
    changeFiles.style.display = "flex";
    //-- Cache les elements de la div
    addImgElements.forEach(element => {
      element.style.display = "none";
    });
  }
};
//-- Bouton bonus pour retirer le preview et pouvoir changer d'image upload
let deletePreviewPicture = function () {
  image.src = "";
  changeFiles.style.display = "none";
  addImgElements.forEach(element => {
    element.style.display = "inline-block";
  const inputUploadImg = document.getElementById("uploadImg");
  inputUploadImg.value = "";
  });
};
changeFiles.addEventListener("click", deletePreviewPicture);

//-- Gestion du label des catégories dans ModalAdd
const selectCategories = document.getElementById("categorie");

async function getCategoriesforLabel() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categoriesForLabel = await response.json();
  // Réinitialiser le contenu du select
  selectCategories.innerHTML = "";
  // Ajouter un champ vide
  const champVide = document.createElement("option");
  champVide.value = "";
  champVide.text = "";
  selectCategories.appendChild(champVide);
  // Parcourir les catégories et les ajouter au select
  categoriesForLabel.forEach(category => {
    if (category !== "tous") {
      const optionnalCategories = document.createElement("option");
      optionnalCategories.value = category.id;
      optionnalCategories.text = category.name;
      selectCategories.appendChild(optionnalCategories);
    }
  });
}
getCategoriesforLabel();

const formUploadWorks = document.getElementById("sendImg");
const submitBtnWorks = document.getElementById("btnSubmit");

formUploadWorks.addEventListener("submit", submitWork);

function submitWork(e) {
  e.preventDefault();
  var token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  var title = document.getElementById("titre").value;
  var category = document.getElementById("categorie").value;
  var image = document.getElementById("uploadImg").files[0];

  if (!title || !category || !image) {
    return;
  }

  var formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);


  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    },
    body: formData
  })
  .then(async (work) => {
    console.log("Image envoyée avec succès !");
    addFigureToGaleryContainer(await work.json());
    showWorksByCategory(0);
    modalAdd.style.display = "none";
    modalGalery.style.display = "flex";
    modal.style.display = "none";
    document.getElementById("titre").value = "";
    document.getElementById("categorie").value = "";
    image = document.getElementById("uploadImg").innerHTML = "";
    deletePreviewPicture();
  })
  .catch(error => {
    console.log("Erreur lors de l'envoi de l'image :", error);
  });
}

function checkSubmitButton() {
  const errorMsgModal = document.querySelector(".errorModal");
  var title = document.getElementById("titre").value;
  var category = document.getElementById("categorie").value;
  var image = document.getElementById("uploadImg").files[0];

  if (title && category && image) {
    submitBtnWorks.removeAttribute("disabled");
    submitBtnWorks.classList.add("active");
    errorMsgModal.textContent= "";
  }
  else {
    submitBtnWorks.setAttribute("disabled", "disabled");
    submitBtnWorks.classList.remove("active");
    errorMsgModal.textContent= "Tout les champs doivent être rempli !";
  }
}

