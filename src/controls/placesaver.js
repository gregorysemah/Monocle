Monocle.Controls.PlaceSaver = function (bookId) {
  if (Monocle.Controls == this) {
    return new Monocle.Controls.PlaceSaver(bookId);
  }

  var k = {
    COOKIE_NAMESPACE: "monocle.controls.placesaver.",
    COOKIE_EXPIRES_IN_DAYS: 7 // Set to 0 for session-based expiry.
  }

  // Properties.
  var p = {
  }

  // Public methods and properties.
  var API = {
    constructor: Monocle.Controls.PlaceSaver,
    constants: k,
    properties: p
  }


  function initialize() {
    applyToBook(bookId);
  }

  function assignToReader(reader) {
    p.reader = reader;
    p.reader.addListener('monocle:turn', savePlaceToCookie);
    p.reader.addListener('monocle:bookChange', applyToBook);
  }


  function applyToBook(bookId) {
    p.bkTitle = bookId.toLowerCase().replace(/[^a-z0-9]/g, '');
    p.prefix = k.COOKIE_NAMESPACE + p.bkTitle + ".";
  }


  function setCookie(key, value, days) {
    var expires = "";
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires="+d.toGMTString();
    }
    var path = "; path=/";
    document.cookie = p.prefix + key + " = " + value + expires + path;
    return value;
  }


  function getCookie(key) {
    if (!document.cookie) {
      return null;
    }
    var regex = new RegExp(p.prefix + key + "=(.+?)(;|$)");
    var matches = document.cookie.match(regex);
    if (matches) {
      return matches[1];
    } else {
      return null;
    }
  }


  function savePlaceToCookie() {
    var place = p.reader.getPlace();
    setCookie(
      "component",
      encodeURIComponent(place.componentId()),
      k.COOKIE_EXPIRES_IN_DAYS
    );
    setCookie(
      "percent",
      place.percentageThrough(),
      k.COOKIE_EXPIRES_IN_DAYS
    );
  }


  function savedPlace() {
    var locus = {
      componentId: getCookie('component'),
      percent: getCookie('percent')
    }
    if (locus.componentId && locus.percent) {
      locus.componentId = decodeURIComponent(locus.componentId);
      locus.percent = parseFloat(locus.percent);
      return locus;
    } else {
      return null;
    }
  }


  function restorePlace() {
    var locus = savedPlace();
    if (locus) {
      p.reader.moveTo(locus);
    }
  }


  API.assignToReader = assignToReader;
  API.savedPlace = savedPlace;
  API.restorePlace = restorePlace;

  initialize();

  return API;
}


Monocle.pieceLoaded('controls/placesaver');
