let jsonArticles;
let mapListeIdArticles = new Map();
let isPagePanier = false;
let panierHtml = `<h1>Panier</h1>

<article class="articlePanier">
  <section class="imgArticle">
  <p id="img_article" class="intitule" style="color: transparent;">Image</p>
  </section>

  <section class="titreArticle">
    <p id="nomArticle" class="intitule">Article</p>

  </section>
  <section class="quantiteArticle">
    <p id="quantite" class="intitule">Quantité</p>

  </section>
  <section class="prixArticle">
    <p id="prix" class="intitule">Prix</p>

  </section>

  <section class="totalArticle">
    <p id="soustotal" class="intitule">Subtotal</p>
  </section>

  <section class="logoSup">
    <p id="supp" class = "intitule">Supprimer</p>
  </section>

</article>

<div class="viderPanier">
  <p onclick="viderPanier()">Vider Panier</p>
</div>

<article class="validationPanier">
  <section class="totalPanier">
    <p class="texte_total">Total: </p>
    <p id="total"> </p><p class="euro">€</p>
  </section>
  
  <section class="prixPanier">
  </section>

  <section class="payerPanier">
    <p class="payerBtn">Acheter maintenant </p>
  </section>
</article>`;

chargerArticlesJson();

//    Ajoute la clase active dans le boutons de la liste du menu //
const boutonsCategories = document.querySelectorAll(".bouton_cat");
const boutonPanier = document.querySelectorAll(".bouton_panier");

boutonsCategories.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    boutonsCategories.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");
  });
});

//     OPen close menu responsive  //
const openMenu = document.querySelector("#open_menu");
const closeMenu = document.querySelector("#close_menu");
const aside = document.querySelector("aside");
//     OPen close menu responsive  //

openMenu.addEventListener("click", () => {
  aside.classList.add("aside_visible");
});

closeMenu.addEventListener("click", () => {
  aside.classList.remove("aside_visible");
});

boutonsCategories.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside_visible");
  })
);
boutonPanier.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside_visible");
  })
);

function chargerArticlesJson() {
  getJSON("articles.json").then((data) => {
    jsonArticles = data;
    chargerArticles();
  });
}

function chargerArticles() {
  let idArticleIncrement = 0;
  document.getElementById("main").innerHTML = `
    <div class="searchTittle">
      <div class="search" >
        <input id="search" type="text" placeholder="Chercher...">
        <button onclick="rechercher(document.getElementById('search').value)" type="submit"><i class="fa fa-search"></i></button> 
      </div>
      <h2 id="titre" class="titre_principal">Tous les articles</h2>
    </div>
    <div id="card" class="valise_items"></div>
    
    `;
  document.getElementById("card").innerHTML = jsonArticles.articles
    .map(
      (article) =>
        ` 
                <div class="card-body">
                  <img  src="images/${
                    article.image
                  }" class="img_item" alt="...">
                    <div class="valise_contenu_card">
                      <div class="contenu_card">
                          <h5>${article.nom}</h5>
                                <p class="descr_article">${
                                  article.designation
                                }</p>
                                <p class="prix"> ${article.prix} €</p>
                                <p class="categorie">${article.categorie}</p>
                                <button id="${idArticleIncrement++}" onclick="ajouterArticle(this.id)" class="btn btn-primary">Ajouter</button>
                      </div>
                    </div>
                </div>
                
                `
    )
    .join("");
}

function getJSON(path) {
  return fetch(path).then((response) => response.json());
}

function displayOneArticle(categorie) {
  //Si on vient de panier on doit de nouveau récupérer la data
  if (isPagePanier) {
    chargerArticles();
  }

  let titreHtml = "Tous les articles";
  //On met le titre de la categorie de l'article
  switch (categorie) {
    case "costume":
      titreHtml = "Costumes";
      break;
    case "robe":
      titreHtml = "Robes";
      break;
    case "chemise":
      titreHtml = "Chemises";
      break;
    case "jupe":
      titreHtml = "Jupes";
      break;
    case "manteau":
      titreHtml = "Manteaux";
      break;
    case "pantalon":
      titreHtml = "Pantalons";
      break;
    case "blouse":
      titreHtml = "Blouses";
      break;
    case "cravate":
      titreHtml = "Cravates";
      break;
    case "chaussure":
      titreHtml = "Chaussures";
      break;
  }
  document.getElementById("titre").innerHTML = titreHtml;

  //On recupere toutes les cards et on boucle dessus
  document.querySelectorAll(".card-body").forEach((elem) => {
    //On boucle sur les categorie de chaque card pour obtenir sa valeur
    let isCategorie = false;
    elem.querySelectorAll(".categorie").forEach((elem2) => {
      isCategorie = elem2.childNodes[0].nodeValue == categorie;
    });

    //Si c'est la bonne categorie on l'affiche, sinon on la cache
    if (isCategorie) {
      elem.style.display = "flex";
    } else {
      elem.style.display = "none";
    }
  });

  isPagePanier = false;
}

function displayAllArticle() {
  //Si page panier on doit recharger les elements
  if (isPagePanier) {
    chargerArticles();
  } else {
    //Sinon on peut juste les rendre visible et afficher le titre correspondant
    document.getElementById("titre").innerHTML = "Tous les articles";
    document.querySelectorAll(".card-body").forEach((elem) => {
      elem.style.display = "flex";
    });
  }
  isPagePanier = false;
}

function chargerPanier() {
  let total = 0;
  document.getElementById("main").innerHTML = panierHtml;
  mapListeIdArticles.forEach((value, key) => {
    document
      .getElementById("img_article")
      .insertAdjacentHTML(
        "beforeend",
        '<p><img class="imageResize" src="images/' +
          jsonArticles.articles[key].image +
          '"></p>'
      );
    document
      .getElementById("nomArticle")
      .insertAdjacentHTML(
        "beforeend",
        "<p>" + jsonArticles.articles[key].nom + "</p>"
      );
    document
      .getElementById("quantite")
      .insertAdjacentHTML("beforeend", "<p>" + value + "</p>");
    document
      .getElementById("prix")
      .insertAdjacentHTML(
        "beforeend",
        "<p>" + jsonArticles.articles[key].prix + " € </p>"
      );
    document
      .getElementById("soustotal")
      .insertAdjacentHTML(
        "beforeend",
        "<p>" + (jsonArticles.articles[key].prix * value).toFixed(2) + " € </p>"
      );
    document
      .getElementById("supp")
      .insertAdjacentHTML(
        "beforeend",
        '<p> <i onclick="supprimerArticle(' +
          key +
          ')" class="fa-regular fa-trash-can"></i> </p>'
      );
    total += jsonArticles.articles[key].prix * value;
  });
  document
    .getElementById("total")
    .insertAdjacentHTML("beforeend", total.toFixed(2));
  isPagePanier = true;
}

function ajouterArticle(id) {
  let idNumeric = Number(id);

  if (mapListeIdArticles.has(idNumeric)) {
    mapListeIdArticles.set(idNumeric, mapListeIdArticles.get(idNumeric) + 1);
  } else {
    mapListeIdArticles.set(idNumeric, 1);
  }

  actualiserCompteur();
  
}

function viderPanier() {
  // Réinitialise la carte du panier (panierHtml) à son état initial
  document.getElementById("main").innerHTML = panierHtml;

  // Efface la carte du panier et réinitialise la map des articles du panier
  mapListeIdArticles.clear();

  // Réinitialise le compteur du panier à zéro
  document.getElementById("compteur").innerHTML = 0;
}

function supprimerArticle(id) {
  if (mapListeIdArticles.has(id)) {
    const quantity = mapListeIdArticles.get(id);
    if (quantity > 1) {
      mapListeIdArticles.set(id, quantity - 1);
    } else {
      mapListeIdArticles.delete(id);
    }
    chargerPanier();
  }
  actualiserCompteur();
}

function rechercher(toSearch) {
  //On désactive les boutons
  boutonsCategories.forEach((boton) => {
    boutonsCategories.forEach((boton) => boton.classList.remove("active"));
  });

  document.getElementById("titre").innerHTML =
    'Articles trouvés pour la recherche "' + toSearch + '"';

  document.querySelectorAll(".card-body").forEach((elem) => {
    let isSearch = false;
    elem.querySelectorAll(".descr_article").forEach((elem2) => {
      isSearch = elem2.childNodes[0].nodeValue
        .toUpperCase()
        .includes(toSearch.toUpperCase());
    });
    if (isSearch) {
      elem.style.display = "flex";
    } else {
      elem.style.display = "none";
    }
  });
}

function actualiserCompteur(){
  let nbOfArticles = 0;
  mapListeIdArticles.forEach((value, key) => {
    nbOfArticles += value;
  });
  document.getElementById("compteur").innerHTML = nbOfArticles;
}