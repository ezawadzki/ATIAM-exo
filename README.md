# ATIAM - Web Audio / Midi

Nous verrons les bases du Web Audio et Web Midi sur 12h de cours.
Un projet à réaliser à deux/trois personnes ou seul sera à rendre

## Pré-requis

###  Navigateur

Pour ce cours, nous travaillerons principalement avec le navigateur Chrome qui présentent les dernières avancées en matière de Web Audio / Midi.

### Debug

Les navigateurs présentent un outil de débugging. Pour y accéder : touche ```F12``` ou clique droit et ```inspecter```.
Pour voir vos erreurs ou les messages que vous logguez, aller dans l'onglet ```console```.

## HTML

Le **HyperText Markup Language**, généralement abrégé HTML ou dans sa dernière version HTML5, est le langage de balisage conçu pour représenter les pages web.

Ce langage permet :

- d’écrire de l’hypertexte, d’où son nom
- de structurer sémantiquement la page
- de mettre en forme le contenu
- de créer des formulaires de saisie
- d’inclure des ressources multimédias dont des images, des vidéos et de l'audio

https://developer.mozilla.org/fr/docs/Apprendre/HTML

## CSS

Les feuilles de style en cascade, généralement appelées CSS de l'anglais **Cascading Style Sheets**, permet de styliser le rendu des fichiers HTML.

https://developer.mozilla.org/fr/docs/Apprendre/CSS

## Javascript

**JavaScript** est un langage de programmation de scripts principalement employé dans les pages web interactives. La majorité des navigateurs web disposent d'un moteur JavaScript dédié pour l'interpréter.

https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference

### Gestion des dépendances

#### Balise script

On peut faire appel directement à un script externe de cette manière :

Script local :

```<script src="script.js"></script>```

Script externe, situé sur un CDN (Content Delivery Network) :

```<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.73/Tone.js"></script>```

Cette manière d'importer les dépendances est possible pour de petit projet. Si vous avez à faire des projets plus conséquent, il vaut mieux gérer les dépendances avec un package manager décrit comme ci-dessous.

ref : https://developer.mozilla.org/fr/docs/Web/HTML/Element/script

#### Package manager


```npm install``` : installe toutes les dépendances situé dans un fichier ```package.json```situé à la racine d'un projet.

```npm install [nom_de_la_dépendance]```: écrit dans le fichier package.json pour vous et installe la dépendance.

Ces dépendances sont importables avec l'instruction ```import```.
Malheureusement, tous les navigateurs ne supportent pas encore cette instruction, alors nous avons besoin de **transpiler** notre code à l'aide d'un utilitaire type [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/guide/en/) ou [parcels](https://parceljs.org/).
Liste des navigateurs qui supportent l'instruction ```import```: https://caniuse.com/?search=import


npm : https://www.npmjs.com/


### Librairies

https://github.com/wavesjs

https://tonejs.github.io

### Web Audio / Midi

#### Documents de références

Web Audio : https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

Web Midi : https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess

#### Démos

##### Art

https://tonejs.github.io/demos


##### Industrie

Editeur pour la drum machine Novation Circuit : https://components.novationmusic.com/circuit/editor

DAW: https://ampedstudio.com/

Ableton tutorials: https://learningmusic.ableton.com/

Pédale Owl : https://www.rebeltech.org/ (onglet patches)

Electro groove : https://electrogroove.fr/


## Articles

https://www.html5rocks.com/en/tutorials/audio/scheduling/



