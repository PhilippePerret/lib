#Module Horloge

Permet d'afficher une ou des horloges dans l'application

##À implémenter

* Pouvoir déterminer le style de l'horloge parmi plusieurs styles
* Pouvoir déterminer la taille de l'horloge (<horloge>.size(<taille>))

##Requis

Charger les modules suivants dans l'application&nbsp;:

* lib/javascript/optional/module.js
* lib/css/module.css

Placer dans le code de l'application&nbsp;:

    <div id="horloge$SUFFIX$"></div>
    
… où `$SUFFIX$` est le suffixe qui sera envoyé au premier argument de la méthode `create`.

*Noter que s'il n'y a qu'une seule horloge, ce suffixe peut être omis.*

##Création de l'horloge

Appeler la méthode : 

    Horloge.create(<suffix>)
    
… où `<suffix>` est le `$SUFFIX$` utilisé dans le code HTML de l'horloge.

La méthode retourne l'instance de l'horloge, donc on peut faire&nbsp;:
  
    monHorloge = Horloge.create(<suffix>)
    
###Déterminer le style de l'horloge

Utiliser la méthode `design`

    Horloge.design(<suffix>, <id design>)
  
Ou
  
    monHorloge.design(<id design>)
    
… où <id design> est un style parmi les suivants&nbsp;:
  
    TODO
    'modern'
    'video'
    'discret'
    
##Démarrer l'horloge

Si l'horloge a été placée dans une variable, on peut faire&nbsp;:

    monHorloge.start // sans parenthèses
    
Sinon, utiliser&nbsp;:

    Horloge.start(<suffix>)

##Arrêter l'horloge

Si l'horloge a été placée dans une variable, utiliser&nbsp;:

    monHorloge.stop // sans parenthèses

Sinon, utiliser&nbsp;:

    Horloge.stop(<suffix>)
  
##Mettre l'horloge en pause
  
Si l'horloge a été placée dans une variable, utiliser&nbsp;:

    monHorloge.pause

Sinon&nbsp;:

    Horloge.pause(suffix)

##Redémarrer l'horloge

Si l'horloge a été placée dans une variable, utiliser&nbsp;:

    monHorloge.restart // sans parenthèses

Sinon&nbsp;:

    Horloge.restart(<suffix>)
    
##Ré-initialiser l'horloge

Si l'horloge a été placée dans une variable&nbsp;:

    monHorloge.reset // sans parenthèses

Sinon&nbsp;:

    Horloge.reset(<suffix>)
    
##Définir le style d'une horloge