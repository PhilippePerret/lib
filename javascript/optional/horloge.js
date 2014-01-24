/**
  * @module horloge.js
  * 
  * Une horloge qui affiche en temps réel le temps.
  *
  * @usage : cf. le mode d'emploi
  *
  */

/**
  * @module UI_chrono
  */

/**
  * @class Chrono
  * @constructor
  * @param  {jQuerySelector} jid  Le sélecteur de l'élément dans lequel il faut
  *                               placer le sélecteur.
  */
window.Chrono = function(suffix)
{
  /**
    * Suffix de l'horloge, qui permet de construire l'ID
    * de son identifiant DOM
    * @property {String} suffix
    */
  this.suffix = suffix || ""
  
  /**
    * Timer du set interval
    * @property {Number} timer
    */
  this.timer  = null
  /**
    * Temps de démarrage du chronomètre
    * Notes
    *   * C'est la méthode run qui le définit, quand cette propriété
    *     est === null
    * @property {Number} start_time
    * @default null
    */
  this.start_time = null
  /**
    * Temps écoulé avant la dernière pause
    * @property {Number} elapsed_time_before_pause
    * @default 0
    */
  this.elapsed_time_before_pause = 0

  /**
    * Temps total écoulé (en tenant compte de toutes les pauses)
    * @property {Number} elapsed_time
    * @default 0
    */
  this.elapsed_time = 0
  
  /**
    * Dernier temps de départ du chronomètre
    * Utile pour tenir compte des pauses
    * Notes
    *   * C'est la méthode `run` qui le (re)définit chaque fois.
    * @property {Number} last_start_time
    * @default 0
    */
  this.last_start_time = 0
  
  // Il faut construire l'horloge
  this.build()
}
$.extend(Chrono.prototype,{
  /**
    * Ré-initialise le chronomètre au départ. Remets toutes les
    * valeurs à zéro et affiche l'horloge de départ
    * @method do_reset
    */
  do_reset:function()
  {
    this.start_time       = 0
    this.elapsed_time     = 0
    this.last_start_time  = 0
    this.change()
  },
  /**
    * Lance le chronomètre
    * Utilise la méthode setInterval pour appeler toutes les demi-secondes
    * la méthode `change` qui va afficher le temps courant.
    * @method run
    */
  run:function(){
    var justnow = (new Date()).getTime()
    if(this.start_time === null) this.start_time = justnow
    this.last_start_time = justnow
    this.timer = setInterval($.proxy(this.change, this), 500);
  },
  /**
    * Met le chrono en pause
    * La méthode se charge aussi de mettre de côté le temps déjà écoulé
    * pour pouvoir tenir compte des pauses.
    *
    * @method pause
    */
  do_pause:function()
  {
    this.unrun()
    this.calcule_elapsed_time()
    this.elapsed_time_before_pause = parseInt(this.elapsed_time,10)
    this.last_start_time = null // inutile, mais bon
  },

  /**
    * Sort le chrono de la pause (le remet en route)
    * @method unpause
    */
  unpause:function()
  {
    this.run()
  },
  
  /**
    * Change l'affichage du chronomètre
    * @method change
    * @protected
    */
  change:function(){
    this.calcule_elapsed_time()
    this.decompose()
    this.obj_hours    .html(this.hours)
    this.obj_minutes  .html(this.minutes)
    this.obj_seconds  .html(this.seconds)
    if(this.with_frames) this.obj_microseconds.html(this.microseconds)
  },
  /**
    * Méthode qui décompose l'horloge pour définir les propriétés
    * `hours`, `minutes`, `seconds` et `microseconds` du temps
    * courant.
    * @method decompose
    */
  decompose:function()
  {
    var dh = Time.s2h(this.elapsed_time, true).split(':')
    this.hours        = dh[0]
    this.minutes      = dh[1]
    var ds = dh[2].split(',')
    this.seconds      = ds[0]
    this.microseconds = ds[1]
  },
  /**
    * Calcule la durée chronométrée.
    * La méthode tient compte des arrêts. Elle se sert principalement de :
    *   * this.time             Pour connaitre le temps écoulé lors d'une
    *                           précédente pause (if any)
    *   * this.last_start_time  Le nombre de millisecondes lors de la mise en
    *                           route du chronomètre au départ ou à la fin de
    *                           la dernière pause.
    * @method calcule_elapsed_time
    */
  calcule_elapsed_time:function()
  {
    var laps  = (new Date()).getTime() - this.last_start_time 
        // => Nombre de millisecondes écoulées
    laps = parseInt(laps / 1000, 10)
    this.elapsed_time = this.elapsed_time_before_pause + laps
  },
  
  /**
    * Arrête (définitivement) le chronomètre
    * Ie détruit le setInterval
    * @method unrun
    */
  unrun:function(){
    if(this.timer)
    {
      clearInterval(this.timer)
      delete this.timer
    }
  },
  
  /**
    * Construire l'horloge
    * @method build
    */
  build:function()
  {
    this.obj.addClass('horloge')
    this.obj.append(
      '<span class="hlg-unit hlg-hrs"></span>:'+
      '<span class="hlg-unit hlg-mns"></span>:'+
      '<span class="hlg-unit hlg-scs"></span>'+
      (this.with_frames ? ':<span class="hlg-unit-mic"></span>' : "")
    )
  }
})
/*
  * Les méthodes d'action du chronomètre
  * (Méthodes utilisateur)
  */
Object.defineProperties(Chrono.prototype,{
  /**
    * L'objet DOM du chronomètre
    * @property {jQuerySet} obj
    */
  "obj":{get:function(){return $(this.jid)}},
  /**
    * L'objet DOM des heures
    * @property {jQuerySet} obj_hours
    */
  "obj_hours":{
    get:function(){
      if(undefined == this._obj_hours)
      {
        this._obj_hours = this.obj.find('> span.hlg-hrs')
        if(this._obj_hours.length == 0) this._obj_hours = null
      }
      return this._obj_hours
    }
  },
  /**
    * L'objet DOM des minutes
    * @property {jQuerySet} obj_minutes
    */
  "obj_minutes":{
    get:function(){
      if(undefined == this._obj_minutes)
      {
        this._obj_minutes = this.obj.find('> span.hlg-mns')
        if(this._obj_minutes.length == 0) this._obj_minutes = null
      }
      return this._obj_minutes
    }
  },
  /**
    * L'objet DOM des secondes
    * @property {jQuerySet} obj_seconds
    */
  "obj_seconds":{
    get:function(){
      if(undefined == this._obj_seconds)
      {
        this._obj_seconds = this.obj.find('> span.hlg-scs')
        if(this._obj_seconds.length == 0) this._obj_seconds = null
      }
      return this._obj_seconds
    }
  },
  /**
    * L'objet DOM des micro-secondes
    * @property {jQuerySet} obj_microseconds
    */
  "obj_microseconds":{
    get:function(){
      if(undefined == this._obj_microseconds)
      {
        this._obj_microseconds = this.obj.find('> span.hlg-mic')
        if(this._obj_microseconds.length == 0) this._obj_microseconds = null
      }
      return this._obj_microseconds
    }
  },
  /**
    * Selector jQuery du chronomètre
    * @property {String} jid
    */
  "jid":{get:function(){
    if(undefined == this._jid) this._jid = "div#horloge"+this.suffix
    return this._jid
  }},
  /**
    * Propriété indiquant si l'horloge a des frames
    * Si true, il faut tenir compte des frames, false otherwise
    * @property {Boolean} with_frames
    */
  "with_frames":{
    get:function(){return false} // pour le moment
  },
  /* ---------------------------------------------------------------------
   *  Méthodes utilisateur
   *  
   */
  /**
    * Démarrage du chronomètre
    * @method start
    * @return {Chrono} L'instance du chronomètre (pour chainage…)
    */
  "start":{get:function(){this.run(); return this}},
  /**
    * Arrêt du chronomètre
    * @method stop
    * @return {Chrono} L'instance du chronomètre (pour chainage…)
    */
  "stop":{get:function(){this.unrun();return this}},
  /**
    * Mise en pause du chronomètre
    * @method pause
    * @return {Chrono} L'instance du chronomètre (pour chainage…)
    */
  "pause":{get:function(){this.do_pause();return this}},
  /**
    * Redémarre le chronomètre après une pause
    * @method restart
    * @return {Chrono} L'instance du chronomètre (pour chainage…)
    */
  "restart":{get:function(){this.unpause();return this}},
  /**
    * Ré-initialisation du chronomètre
    * @method reset
    * @return {Chrono} L'instance du chronomètre (pour chainage…)
    */
  "reset":{get:function(){this.do_reset();return this}}
  
})
/**
  * Object qui gère tous les chronomètres (instances {Chrono})
  *
  * @class Horloge
  * @static
  *
  */
window.Horloge = {
  /**
    * Table contenant tous les chronos courants
    * Notes
    *   * En général, il y a un seul chronomètre à la fois, ou
    *     maximum deux quand un exercice est en route.
    *
    * @property {Object} CHRONOS
    * @static
    * @final
    */
  CHRONOS:{},
  
  /**
    * Instancie un nouveau chronomètre dans l'élément +jid+
    * @method create
    * @param {String} suffix Suffixe à ajouter à "horloge" pour composer l'id de l'horloge
    * @return {Chrono} L'instance chronomètre initiée
    */
  create:function(suffix){
    this.CHRONOS[suffix || 0] = new Chrono(suffix)
    // dlog("chrono:");dlog()
    return this.CHRONOS[suffix||0]
  },
  /**
    * Exécuter l'action +action+ sur le chronomètre de suffixe +suffix+
    * @method action
    * @protected
    * @param {String} suffix    Le suffixe de l'horloge
    * @param {String} action    L'action à exécuter ('start', 'stop', etc.)
    * @return {Chrono} L'instance Chrono de l'horloge
    */
  action:function(suffix, action)
  {
    this.CHRONOS[suffix || 0][action]
    return this.CHRONOS[suffix || 0]
  },
  /**
    * Démarrer le chronomètre de suffixe +suffix+
    * @method start
    * @param {String} suffix Le suffixe de l'horloge
    * @return {Chrono} L'instance de l'horloge
    */
  start   :function(suffix){return this.action(suffix, 'start'  )},
  /**
    * Stopper le chronomètre de suffixe +suffix+
    * @method stop
    * @param {String} suffix Le suffixe de l'horloge
    * @return {Chrono} L'instance de l'horloge
    */
  stop    :function(suffix){return this.action(suffix, 'stop'   )},
  /**
    * Met en pause le chronomètre de suffixe +suffix+
    * @method pause
    * @param {String} suffix Le suffixe de l'horloge
    * @return {Chrono} L'instance de l'horloge
    */
  pause   :function(suffix){return this.action(suffix, 'pause'  )},
  /**
    * Redémarre le chronomètre de suffixe +suffix+ après une pause
    * @method pause
    * @param {String} suffix Le suffixe de l'horloge
    * @return {Chrono} L'instance de l'horloge
    */
  restart :function(suffix){return this.action(suffix, 'restart')}
  
  
}
