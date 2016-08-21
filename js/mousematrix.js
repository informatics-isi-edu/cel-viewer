var anatFeatures = [
  "headDiv", "Auditory Vesicle", "Ear", "Embryonic Limb", "Eye", "Facial Epithelium", "Facial Mesenchyme", "Forebrain",
  "Frontal Suture", "Frontonasal Process", "Frontonasal Process, Ectoderm (Ts19)", "Frontonasal Process, Ectoderm (Ts21)",
  "Frontonasal Process, Mesenchyme", "Genital Tubercle", "Head", "Hindbrain", "Lateral Nasal Eminence Epithelium",
  "Lateral Nasal Process", "Mandible", "Mandibular Part of First Pharyngeal Arch, Ectoderm",
  "Mandibular Part of First Pharyngeal Arch, Mesenchyme", "Mandibular Process", "Maxilla", "Maxillary Process",
  "Maxillary Process, Ectoderm", "Maxillary Process, Mesenchyme", "Medial Nasal Eminence Epithelium", "Medial Nasal Process",
  "Medial Neuroepithelium", "Midbrain", "Nasal Pit", "Neural Crest", "Neural Tube", "Neuroepithelium", "Nose", "Olfactory Placode",
  "Palatal Shelves", "Palate", "Palate, Secondary", "Paraxial Mesodem", "Pharyngeal Arch", "Rathke Pouch", "Skull", "Tongue", "Trigeminal Nerve"
]; // Used to determine name of next and previous anatomical features.

var ageStages = [
  "headDiv", "E8.5", "E9.5", "E10.5", "E11.5", "E12.5", "E13.5", "E14.5",
  "E15.5", "E16.5", "E17.5", "E18.5", "P0", "P90"
]; // Used to determine name of next and previous age stages.

var listenToArrowKeys = false; // Used to determine whether listen to arrow keys or not.

$(function () {

  var modal = $("#exp-modal");

  // Change the background of column on hover.
  var allCells = $(".experiment-table .mousematrix td, .experiment-table .mousematrix th.row-header, .experiment-table .mousematrix th.rotate div");
  allCells.not(".row-header")
  .on("mouseover", function () {
    var el = $(this);
    var pos;
    if(el.hasClass("col-head")){
      pos = el.parent().index();
    }else{
      pos = el.index();
    }
    allCells.filter(":nth-child(" + (pos + 1) + ")").addClass("hover"); // rows
    allCells.parent("th").filter(":nth-child(" + (pos + 1) + ")").find(".head-div").addClass("hover"); // head-div
  })
  .on("mouseout", function () {
    allCells.removeClass("hover");
  });


  // Click listeners
  $('.exp-div,.head-div,.type-div').on('click', function () {
    changeModalContent($(this));
  });
  $('#next-feature').on('click', function () {
    changeModalContent(getNextAnatFeature());
  });
  $('#prev-feature').on('click', function () {
    changeModalContent(getPrevAnatFeature());
  });
  $('#next-age').on('click', function () {
    changeModalContent(getNextAgeStage());
  });
  $('#prev-age').on('click', function () {
    changeModalContent(getPrevAgeStage());
  });

  // Changing modal height when modal is about to be shwon to the user.
  modal.on('show.bs.modal', function () {
    $(this).show();
    setModalMaxHeight(this);
  });

  modal.on('hidden.bs.modal', function (e) {
    listenToArrowKeys = false;
  });

  // Changing modal height on window resize.
  var modal_in = $('.modal.in');
  $(window).resize(function () {
    if (modal_in.length != 0) {
      setModalMaxHeight(modal_in);
    }
  });

  // Arrow and Escape key listeners.
  $(document).keyup(function (e) {
    if (e.which == 27){ //escape, close modal
      modal.modal("hide");
    }
    if (!listenToArrowKeys) return;

    var temp;
    if (e.which == 37) { //left arrow, prev-feature
      temp = getPrevAnatFeature();
      if (temp)changeModalContent(temp);
    } else if (e.which == 38) { //up arrow, prev-age
      temp = getPrevAgeStage();
      if (temp)changeModalContent(temp);
    } else if (e.which == 39) { //right arrow, next-feature
      temp = getNextAnatFeature();
      if (temp)changeModalContent(temp);
    } else if (e.which == 40) { //down arrow, next-age
      temp = getNextAgeStage();
      if (temp)changeModalContent(temp);
    }

  })

  /**
  * Change content of modal based on the input.
  * @param {jQueryElement} $this: the content of modal will be created based on this element.
  **/
  function changeModalContent($this) {
    if (!$this || typeof $this === 'undefined') return;
    if($this.hasClass('head-div')){
      var feature = $this.hasClass("col-head") ? $this.attr('title') : "headDiv";
      var age = $this.hasClass("row-header") ? $this.attr('title') : "headDiv";
      modal.data("feature", feature);
      modal.data("age", age);
    }else if($this.hasClass('exp-div')){
      var title = $this.attr('title').split(" + ");
      modal.data("feature", title[0]);
      modal.data("age", title[1]);
    }

    // Add title, link, and content of modal.
    modal.find(".modal-title a").attr('href', $this.data('url'));
//    modal.find(".modal-title a").html($this.attr('title') + " Datasets");
    modal.find(".modal-title a").html($this.attr('title') + " Plots");
    modal.find('.content-here').html($this.find(".modal-content").html());


    /* hide the navigation buttons if:
    1. It's type-div (experiment types)
    2. There's no next/previous.
    */
    modal.find(".modal-nav-btn").hide();
    if($this.hasClass('type-div')){
      console.log('has type div!');
      listenToArrowKeys = false;
      return;
    }
    listenToArrowKeys = true;
    if (getNextAnatFeature(modal)) {
      $('#next-feature').show();
    }
    if (getPrevAnatFeature(modal)) {
      $('#prev-feature').show();
    }
    if (getNextAgeStage(modal)) {
      $('#next-age').show();
    }
    if (getPrevAgeStage(modal)) {
      $('#prev-age').show();
    }

  }

  /**
  * Based on the window size, changes the modal height and adds scroll if it is needed.
  * @return {boolean|jQueryElement} the previous age stage. It will return false, if there's no next anatomical feature.
  **/
  function setModalMaxHeight(element) {
    this.$element = $(element);
    var dialogMargin = $(window).width() > 767 ? 62 : 22;
    var contentHeight = $(window).height() - dialogMargin;
    var headerHeight = this.$element.find('.modal-header').outerHeight() || 2;
    var footerHeight = this.$element.find('.modal-footer').outerHeight() || 2;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.$element
    .find('.modal-content').css({
      'overflow': 'hidden'
    });

    this.$element
    .find('.modal-body').css({
      'max-height': maxHeight,
      'overflow-y': 'auto'
    });
  }

  /**
  * Return the next anatomical feature, based on what is being shown in the modal.
  * @return {boolean|jQueryElement} the previous age stage. It will return false, if there's no next anatomical feature.
  **/
  function getNextAnatFeature() {
    var indexFeature = anatFeatures.indexOf(modal.data("feature"));
    if (indexFeature < 0 && indexFeature >= anatFeatures.length - 1) {
      return false;
    }
    for (var i = indexFeature + 1; i < anatFeatures.length; i++) {
      if(modal.data("age") == "headDiv"){
        var el = $(".col-head[title='" + anatFeatures[i] + "']");
      }else{
        var el = $(".exp-div[title='" + [anatFeatures[i], modal.data("age")].join(" + ") + "']");
      }
      if (el.length > 0) {
        return el;
      }
    }
    return false;
  }

  /**
  * Return the previous anatomical feature, based on what is being shown in the modal.
  * @return {boolean|jQueryElement} the previous age stage. It will return false, if there's no previous anatomical feature.
  **/
  function getPrevAnatFeature() {
    var indexFeature = anatFeatures.indexOf(modal.data("feature"));
    if (indexFeature <= 0) {
      return false;
    }
    for (var i = indexFeature - 1; i >= 0; i--) {
      if(modal.data("age") == "headDiv"){
        var el = $(".col-head[title='" + anatFeatures[i] + "']");
      }else if(i == 0){
        var el = $(".row-header[title='" + modal.data("age") + "']");
      }else{
        var el = $(".exp-div[title='" + [anatFeatures[i], modal.data("age")].join(" + ") + "']");
      }
      if (el.length > 0) {
        return el;
      }
    }
    return false;
  }

  /**
  * Return the next age stage, based on what is being shown in the modal.
  * @return {boolean|jQueryElement} the previous age stage. It will return false, if there's no next age stage.
  **/
  function getNextAgeStage() {
    var indexAge = ageStages.indexOf(modal.data("age"));
    if (indexAge < 0 && indexAge >= ageStages.length - 1) {
      return false;
    }
    for (var i = indexAge + 1; i < ageStages.length; i++) {
      if(modal.data("feature") == "headDiv"){
        var el = $(".row-header[title='" + ageStages[i]+ "']");
      }else{
        var el = $(".exp-div[title='" + [modal.data("feature"), ageStages[i]].join(" + ") + "']");
      }
      if (el.length > 0) {
        return el;
      }
    }
    return false;
  }

  /**
  * Return the previous age stage, based on what is being shown in the modal.
  * @return {boolean|jQueryElement} the previous age stage. It will return false, if there's no previous age stage.
  **/
  function getPrevAgeStage() {
    var indexAge = ageStages.indexOf(modal.data("age"));
    if (indexAge <= 0) {
      return false;
    }
    for (var i = indexAge - 1; i >= 0; i--) {
      if(modal.data("feature") == "headDiv"){
        var el = $(".row-header[title='" + ageStages[i] + "']");
      }else if(i == 0){
        var el = $(".col-head[title='" + modal.data("feature") + "']");
      }else{
        var el = $(".exp-div[title='" + [modal.data("feature"), ageStages[i]].join(" + ") + "']");
      }
      if (el.length > 0) {
        return el;
      }
    }
    return false;
  }

});


