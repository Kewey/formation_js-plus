'use strict';


function getJson(url) {
  return  fetch(url)
            .then(resp => resp.json())
}

document.addEventListener(
  'DOMContentLoaded',
  function () {

    
    const tweets1 = getJson('https://raw.githubusercontent.com/iOiurson/data/master/data/tweets.json')
    const tweets2 = getJson('https://raw.githubusercontent.com/iOiurson/data/master/data/tweets2.json')

    Promise.all([tweets1, tweets2])
      .then(function (Alltweets) {
        const tweets = Alltweets[0].concat(Alltweets[1])
        console.log('Le tableau de tweet', tweets);

        
        // ### Projet Touitter ###
        // Attention: toucher au DOM coûte cher, utiliser le moins possible les APIs du DOM
        /* [5] créer une fonction createOl(), qui pour un tableau tweets en entrée, crée et retourne un <ol> rempli de <li>
    et l'utiliser à [2], [3], [4] */

        function createEl(type, text = null) {
          const el = document.createElement(type)
          const content = document.createTextNode(text)
          text ? el.append(content) : null
          return el
        }
        
        function createOl(Lis) {
          const ol = createEl('ol')
          Lis.forEach(li => ol.append(li))
          return ol
        }
    
        // [1] créer une fonction createLi(), qui pour un tweet en entrée, crée et retourne un <li> contenant le texte du tweet

        function createLi(tweet) {
          const li = createEl('li')
          const p = document.createElement('p')
          let para = tweet.full_text
          para = para.replace(/\bhttps?:\/\/\S+/gi, hashtag => {
            return '<a href="https://www.twitter.com/' + hashtag + '">' + hashtag + '</a>'
          })
          para = para.replace(/\B\@\w\w+\b/g, hashtag => {
            return '<a href="https://www.twitter.com/">' + hashtag + '</a>'
          })
          para = para.replace(/\B\#\w\w+\b/g, hashtag => {
            return '<a href="https://www.twitter.com/">' + hashtag + '</a>'
          })
          p.innerHTML = para
          li.append(p)
          const users = tweet.full_text.match(/\B\@\w\w+\b/g)
          li.append(p)
          li.classList.add('tweet')
          const btn = createEl('a', 'fav')
          btn.classList.add('fav')
          if (localStorage.getItem(tweet.id_str)) {
            btn.classList.add('active')
          }
          btn.addEventListener("click", () => {
            if (localStorage.getItem(tweet.id_str)) {
              console.log("remove")
              localStorage.removeItem(tweet.id_str)
            } else {
              localStorage.setItem(tweet.id_str, true)
            }
            btn.classList.toggle('active')
          })
          li.append(btn)
          return li
        }


        // [2] créer et ajouter un <ol> à la page, puis y ajouter les <li> de tweets en utilisant [1]
        const tweetsLi = tweets.map(tweet => createLi(tweet))
        let ol = createOl(tweetsLi)
        document.body.append(ol)
        
        // [3] créer un <bouton> de filtre pour que quand on clique dessus, ne garde que les tweets en français à l'écran
        // [4] modifier le bouton de filtre pour pouvoir réafficher tous les tweets quand on reclique dessus
        const tweetsFR = tweets.filter(tweet => tweet.lang === "fr")
        const tweetsFRLi = tweetsFR.map(tweet => createLi(tweet))
        
        let isFilterFR = false

        createFilterBtn()

        /* [6] Créer un bouton qui, quand on clique dessus:
            - active le tracking de la souris: la console affiche position de la souris (event.clientX, event.clientY) quand la souris bouge
            - désactive le tracking quand on reclique dessus
        */

        const trackerBtn = createEl('button', 'Tracker')
        document.body.prepend(trackerBtn)
        
        function trackMouse(e) {
          console.log(e.clientX, e.clientY)
        }

        let isTracking = false
        trackerBtn.addEventListener("click", () => {
          isTracking = !isTracking
          if (isTracking) {
            window.addEventListener("mousemove", trackMouse)
          } else {
            window.removeEventListener("mousemove", trackMouse)
          }
        })


        /* [7] créer une fonction qui crée et renvoie le bouton de filtre.
          Cette fonction doit contenir toute la logique liée au filtre.
          Utiliser cette fonction pour remplacer le code de création du bouton de filtre.
        */

        function createFilterBtn() {
          const btn = createEl('button', 'Filtrer en FR')
          document.body.prepend(btn)

          btn.addEventListener("click", () => {
            const list = document.getElementsByTagName('ol')[0]
            isFilterFR = !isFilterFR
            if (isFilterFR) {
              ol = createOl(tweetsFRLi)
            } else {
              ol = createOl(tweetsLi)
            }
            btn.innerHTML = isFilterFR ? "Supprimer le filtre" : "Filtrer en FR"
            list.replaceWith(ol)
          })
        }

        // [8] Utiliser la fonction getJson() pour charger les tweets à la place des lignes 6 à 11

        /* [9] Utiliser Promise.all() pour charger également les tweets de cette url :
          'https://raw.githubusercontent.com/iOiurson/formation/correction/data/tweets2.json'
        */

        // ### BONUS : LOCALSTORAGE ###

        // [1] Rajouter un bouton "fav" à chaque li

        /* [2] quand le bouton est cliqué, changer le style du li (rajouter une classe 'fav')
      + et stocker l'ensemble des id_str fav dans le localStorage */

        // [3] au chargement de la page, lire le localStorage pour favoriser les favoris.
      })
      .catch(function (e) {
        console.error(e);
      });
  },
  { once: true },
);