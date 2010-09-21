Monocle.Flippers.Instant = function (reader) {

  var API = { constructor: Monocle.Flippers.Instant }
  var k = API.constants = API.constructor;
  var p = API.properties = {
    pageCount: 1
  }


  function initialize() {
    p.reader = reader;
  }


  function page() {
    return p.reader.dom.find('page');
  }


  function listenForInteraction(panelClass) {
    if (typeof panelClass != "function") {
      panelClass = k.DEFAULT_PANELS_CLASS;
    }
    p.panels = new panelClass(
      API,
      {
        'end': function (panel) { turn(panel.properties.direction); }
      }
    );
  }


  function turn(dir) {
    moveTo({ page: getPlace().pageNumber() + dir});
  }


  function getPlace() {
    return page().m.place;
  }


  function moveTo(locus) {
    p.reader.getBook().setOrLoadPageAt(page(), locus, frameToLocus);
  }


  function frameToLocus(locus) {
    var mult = locus.page - 1;
    var pw = page().m.sheafDiv.clientWidth;
    var x = 0 - pw * mult;
    var bdy = page().m.activeFrame.contentDocument.body;
    Monocle.Styles.affix(bdy, "transform", "translateX("+x+"px)");
  }


  // THIS IS THE CORE API THAT ALL FLIPPERS MUST PROVIDE.
  API.pageCount = p.pageCount;
  API.getPlace = getPlace;
  API.moveTo = moveTo;
  API.listenForInteraction = listenForInteraction;

  initialize();

  return API;
}

Monocle.Flippers.Instant.FORWARDS = 1;
Monocle.Flippers.Instant.BACKWARDS = -1;
Monocle.Flippers.Instant.DEFAULT_PANELS_CLASS = Monocle.Panels.TwoPane;



Monocle.pieceLoaded('flippers/instant');
