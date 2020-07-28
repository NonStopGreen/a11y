class A11yError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "A11yError";
  }
}

class A11y {
  constructor(options) {
    this.color = options?.color || "#17384c";
    this.position = options?.position || "left";

    this.minScale = options?.minScale || -50;
    this.maxScale = options?.maxScale || +50;
    this.minFontSize = options?.minFontSize || -50;
    this.maxFontSize = options?.maxFontSize || +50;

    this.data = JSON.parse(localStorage.getItem("a11y_data")) || {
      scaling: 0,
      readableFont: false,
      fontScaling: 0
    };

    // Checking for types
    if (this.position !== "left" &&
        this.position !== "right") {
      throw new A11yError("Position is not one of the values: left, right");
    }
  }

  updateLocalStorage() {
    localStorage.setItem("a11y_data", JSON.stringify(this.data));
  }

  init() {
    var style = document.createElement("style");
    style.type = "text/css";

    style.textContent = `
      body.a11y-readable-font *:not([class*="fa-"]) {
        font-family: Arial,Helvetica,sans-serif !important;
      }

      .a11y-widget {
        font-size: 16px !important;
        bottom: 15px;
        position: fixed;
        border-radius: 15px;
        border: 0;
        z-index: 1111;
        opacity: 0;
        transition: opacity 300ms, transform 300ms;
        background: #d9d9d9;
        height: calc(100% - 10px - 20px);
        max-width: 500px;
        width: 100%;
        ${this.position}: 15px;
        display: none;
        flex-direction: column;
        transform: translateX(-100%);
        z-index: 1000000;
      }

      .a11y-widget * {
        font-family: Arial,Helvetica,sans-serif !important;
      }

      .a11y-widget.a11y-open {
          opacity: 1;
          transform: translateY(0);
      }

      section.a11y-body {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 1rem;
        padding: .5rem 1rem;
        background: #fff;
        overflow-y: auto;
        flex-grow: 1;
      }

      section.a11y-hero {
        padding: 1rem;
        text-align: center;
      }

      h2.a11y-hero-title {
        font-size: 1.2em;
      }

      footer.a11y-footer {
        background-color: ${this.color};
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        width: 100%;
      }

      footer.a11y-footer .a11y-close {
        color: #fff;
        background: #00000045;
        border-bottom-left-radius: 15px;
        width: 32px;
        height: 32px;
        border: 0;
        font-family: Lucida Sans Unicode, Arial Unicode MS;
      }

      footer.a11y-footer a {
        color: #fff;
        padding: .5rem;
        font-size: 14px;
      }

      .a11y-open-button {
        background-color: ${this.color};
        color: #fff;
        width: 32px;
        height: 32px;
        padding: .5rem;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 15px;
        border-radius: 50%;
        ${this.position}: 15px;
        z-index: 100000;
      }

      .a11y-actions-box {
        text-align: center;
      }

      .a11y-actions-group {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .a11y-actions-group .a11y-action-box {
        width: calc(100% / 3 - 1%);
        padding: .75rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #f5f5f5;
        border-radius: 1rem;
      }

      .a11y-actions-group .a11y-action-box.a11y-action-button {
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 300ms ease;
      }

      .a11y-actions-group .a11y-action-box.a11y-action-button:hover {
        border-color: ${this.color};
      }

      .a11y-actions-group .a11y-action-box.a11y-action-button.a11y-active {
        background: ${this.color};
        color: #fff;
      }

      .a11y-actions-group .a11y-action-box.a11y-action-box-big {
        width: calc(100% * 2 / 3 - 1%);
      }

      .a11y-actions-group .a11y-action-box.a11y-action-box-big .a11y-custom-range {
        width: 100%;
      }

      .a11y-actions-group h3 {
        font-size: 18px;
        margin: 1rem;
      }

      .a11y-action-box-title {
        font-size: 15px;
      }

      .a11y-custom-range {
        display: flex;
      }

      .a11y-custom-range-body {
        flex-grow: 1;
        background: #d9d9d966;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

      .a11y-custom-range-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        background: ${this.color};

      }

      @media (max-width:576px) {
        .a11y-widget {
          top: 0;
          left: 0;
          max-width: none;
          height: 100%;
          border-radius: 0;
        }

        .a11y-open-button {
          bottom: 50%;
          ${this.position}: 0;
          transform: translateY(50%);
          border-radius: 0;
        }

        footer.a11y-footer {
          border-radius: 0;
        }

        footer.a11y-footer .a11y-close {
          border-radius: 0;
        }

        footer.a11y-footer a {
          font-size: 13px;
        }
      }
    `;

    document.body.appendChild(style)


    this.build()

    this.updateLocalStorage();
  }

  build() {
    this.buildOpenButton()

    var container = document.createElement("div");
    container.classList.add("a11y-widget");



    this.buildHeader();

    this.buildHero();

    this.buildBody();

    this.buildFooter();

    container.appendChild(this.header);
    container.appendChild(this.hero);
    container.appendChild(this.body);
    container.appendChild(this.footer);

    document.body.appendChild(container);
  }

  buildOpenButton() {
    var openButton = document.createElement('button');
    openButton.setAttribute("aria-label", "Open accessibility menu")
    openButton.classList.add("a11y-open-button");
    openButton.innerHTML = `<svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" xml:space="preserve"><path fill="#fff" xmlns="http://www.w3.org/2000/svg" d="M496.101 385.669l14.227 28.663c3.929 7.915.697 17.516-7.218 21.445l-65.465 32.886c-16.049 7.967-35.556 1.194-43.189-15.055L331.679 320H192c-15.925 0-29.426-11.71-31.679-27.475C126.433 55.308 128.38 70.044 128 64c0-36.358 30.318-65.635 67.052-63.929 33.271 1.545 60.048 28.905 60.925 62.201.868 32.933-23.152 60.423-54.608 65.039l4.67 32.69H336c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16H215.182l4.572 32H352a32 32 0 0 1 28.962 18.392L438.477 396.8l36.178-18.349c7.915-3.929 17.517-.697 21.446 7.218zM311.358 352h-24.506c-7.788 54.204-54.528 96-110.852 96-61.757 0-112-50.243-112-112 0-41.505 22.694-77.809 56.324-97.156-3.712-25.965-6.844-47.86-9.488-66.333C45.956 198.464 0 261.963 0 336c0 97.047 78.953 176 176 176 71.87 0 133.806-43.308 161.11-105.192L311.358 352z"/></svg>`;

    openButton.addEventListener("click", this.toggle.bind(this));

    document.body.appendChild(openButton);
  }

  buildHeader() {
    var header = document.createElement("header");
    header.classList.add("a11y-header");

    this.header = header;
  }

  buildHero() {
    // hero
    var hero = document.createElement("section");
    hero.classList.add("a11y-hero");

    var heroTitle = document.createElement("h2");
    heroTitle.classList.add("a11y-hero-title");
    heroTitle.textContent = "Accessibility Adjustments";

    hero.appendChild(heroTitle);

    this.hero = hero;
  }

  buildBody() {
    var body = document.createElement("section");
    body.classList.add("a11y-body");

    body.appendChild(this.buildContentAdjustments());

    this.body = body;
  }

  buildFooter() {
    // Footer and all of it's elements
    var footer = document.createElement("footer");
    footer.classList.add("a11y-footer");

    var a11yBy = document.createElement("a");
    a11yBy.classList.add("a11y-by");
    a11yBy.href = "https://www.nonstopgreen.com";
    a11yBy.setAttribute("target", "_blank");
    a11yBy.innerText = "Web Accessibility Solution By NonStopGreen";

    var closeButton = document.createElement("button");
    closeButton.classList.add("a11y-close");
    closeButton.innerHTML = "&#10006;"

    footer.appendChild(closeButton);
    footer.appendChild(a11yBy);

    this.accessibilityState = false;

    closeButton.addEventListener("click", this.toggle.bind(this));

    this.footer = footer;
  }

  buildContentAdjustments() {



    var actionsBox = document.createElement("section");
    actionsBox.classList.add("a11y-actions-box");

    var heading = document.createElement("h3");
    heading.textContent = "Content Adjustments";

    var actionsGroup = document.createElement("div");
    actionsGroup.classList.add("a11y-actions-group");

    var that = this;

    var convertPercentageToZoom = (x) => 1 + x * 0.0016;
    var fixPercentage = (value, defaultValue) => ((value === defaultValue) ? "Default" : (value > defaultValue ? "+":"") + value + "%");

    var arrowBottomIcon = `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"/></svg>`;
    var arrowTopIcon = `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"/></svg>`;


    var contentScaling = (function() {
      'use strict';

      var actionBox = document.createElement('div');
      actionBox.classList.add("a11y-action-box", "a11y-action-box-big");

      var title = document.createElement('h4');
      title.classList.add("a11y-action-box-title")
      title.textContent = "Content Scaling";

      var customRange = document.createElement('div')
      customRange.classList.add("a11y-custom-range");

      var customRangePlus = document.createElement('button');
      customRangePlus.classList.add("a11y-custom-range-plus", "a11y-custom-range-button");

      var customRangeMinus = document.createElement('button');
      customRangeMinus.classList.add("a11y-custom-range-minus", "a11y-custom-range-button");

      var customRangeBody = document.createElement('div');
      customRangeBody.classList.add("a11y-custom-range-body");
      customRangeBody.innerText = fixPercentage(that.data.scaling, 0);

      customRangePlus.addEventListener("click", scale.bind(that, "in"));
      customRangePlus.addEventListener("touch", scale.bind(that, "in"));

      customRangeMinus.addEventListener("click", scale.bind(that, "out"));
      customRangeMinus.addEventListener("touch", scale.bind(that, "out"));

      function scale(state) {
        if (state === "in" && that.data.scaling < that.maxScale) that.data.scaling += 10;
        else if (state === "out" && that.data.scaling > that.minScale) that.data.scaling -= 10;

        document.body.style.zoom = convertPercentageToZoom(that.data.scaling);

        customRangeBody.textContent = fixPercentage(that.data.scaling, 0);

        that.updateLocalStorage()
      }

      customRangeMinus.innerHTML = arrowBottomIcon;
      customRangePlus.innerHTML = arrowTopIcon;

      customRange.appendChild(customRangeMinus);
      customRange.appendChild(customRangeBody);
      customRange.appendChild(customRangePlus);

      actionBox.appendChild(title);
      actionBox.appendChild(customRange);

      return actionBox;
    }());

    var readableFont = (function() {
      'use strict';
      var actionButton = document.createElement('div');
      actionButton.classList.add("a11y-action-box", "a11y-action-button");

      actionButton.textContent = "Readable Font";

      actionButton.addEventListener("click", readableFont.bind(that));
      actionButton.addEventListener("touch", readableFont.bind(that));

      function readableFont() {
        actionButton.classList.toggle("a11y-active")

        document.body.classList.toggle("a11y-readable-font");

        that.data.readableFont = !that.data.readableFont;

        that.updateLocalStorage();
      }

      if (that.data.readableFont === true) {
        actionButton.classList.toggle("a11y-active")

        document.body.classList.toggle("a11y-readable-font");
      }

      return actionButton;
    }());

    var fontScaling = (function() {
      'use strict';

      var actionBox = document.createElement('div');
      actionBox.classList.add("a11y-action-box", "a11y-action-box-big");

      var title = document.createElement('h4');
      title.classList.add("a11y-action-box-title")
      title.textContent = "Font Scaling";

      var customRange = document.createElement('div')
      customRange.classList.add("a11y-custom-range");

      var customRangePlus = document.createElement('button');
      customRangePlus.classList.add("a11y-custom-range-plus", "a11y-custom-range-button");

      var customRangeMinus = document.createElement('button');
      customRangeMinus.classList.add("a11y-custom-range-minus", "a11y-custom-range-button");

      var customRangeBody = document.createElement('div');
      customRangeBody.classList.add("a11y-custom-range-body");
      customRangeBody.innerText = fixPercentage(that.data.fontScaling, 0);

      customRangePlus.addEventListener("click", scale.bind(that, "in"));
      customRangePlus.addEventListener("touch", scale.bind(that, "in"));

      customRangeMinus.addEventListener("click", scale.bind(that, "out"));
      customRangeMinus.addEventListener("touch", scale.bind(that, "out"));

      function scale(state) {
        if (state === "in" && that.data.fontScaling < that.maxFontSize) that.data.fontScaling += 10;
        else if (state === "out" && that.data.fontScaling > that.minFontSize) that.data.fontScaling -= 10;

        document.body.style.fontSize = 100 + that.data.fontScaling + "%";

        customRangeBody.textContent = fixPercentage(that.data.fontScaling, 0);

        that.updateLocalStorage()
      }

      customRangeMinus.innerHTML = arrowBottomIcon;
      customRangePlus.innerHTML = arrowTopIcon;

      customRange.appendChild(customRangeMinus);
      customRange.appendChild(customRangeBody);
      customRange.appendChild(customRangePlus);

      actionBox.appendChild(title);
      actionBox.appendChild(customRange);

      return actionBox;
    }());

    document.body.style.zoom = convertPercentageToZoom(that.data.scaling);


    actionsBox.appendChild(heading);

    actionsGroup.appendChild(contentScaling);
    actionsGroup.appendChild(readableFont);
    actionsGroup.appendChild(fontScaling);

    actionsBox.appendChild(actionsGroup);

    return actionsBox;
  }

  toggle() {
    var container = document.querySelector('.a11y-widget')


    container.style.display = "flex";

    setTimeout(function () { container.classList.toggle("a11y-open") },0);

    if (this.accessibilityState = !this.accessibilityState) {
    } else {
      setTimeout(function () {
        container.style.display = "none";
      }, 300);
    }
  }

  debug(options) {
    var displayCSSWarnings = options?.cssWarnings || true;
    var displayCSSErrors = options?.cssErrors || true;
    var displayCSSObsoletes = options?.cssObsoletes || true;
    var displayFloatingCounter = options?.floatingCounter || true;

    var errors = {

    }

    var widthAndHeightInMarkup = document.querySelectorAll(":not(img):not(object):not(embed):not(svg):not(canvas)[width], :not(img):not(object):not(embed):not(svg):not(canvas)[height]")
    var notDisabledOrReadOnlyButton = document.querySelectorAll('button[class*="disabled"]:not([disabled]):not([readonly])');
    var emptyButtons = document.querySelectorAll('button:empty:not([aria-label]):not([aria-labelledby]):not([title])');
    var emptyButtonsAttributes = document.querySelectorAll('button[title=""], button[aria-label=""], button[aria-labelledby=""]');
    var emptyForAttribute = document.querySelectorAll('label[for=""], label[for=" "]');
    var emptyHrefAttribute = document.querySelectorAll('a[href=""], a[href=" "]');
    var emptyLinks = document.querySelectorAll(`
      a:empty[title=""], a:empty[aria-label=""], a:empty[aria-labelledby=""],
      a:empty:not([title]):not([aria-label]):not([aria-labelledby])`);
    var incorrectCharset = document.querySelectorAll('meta[charset]:not([charset="utf-8"]):not([charset="UTF-8"])');
    var ungroupedInputs = document.querySelectorAll('[type="radio"]:not([name]), [type="checkbox"]:not(:only-of-type):not([name])');
    var invalidDirAttribute = document.querySelectorAll('[dir]:not([dir="rtl"]):not([dir="ltr"]):not([dir="auto"])');
    var inlineEvents = document.querySelectorAll(`[onafterprint], [onbeforeprint], [onbeforeunload],
      [onerror], [onhaschange], [onload], [onmessage],
      [onoffline], [ononline], [onpagehide], [onpageshow],
      [onpopstate], [onredo], [onresize], [onstorage],
      [onundo], [onunload],
      [onblur], [onchage], [oncontextmenu], [onfocus],
      [onformchange], [onforminput], [oninput], [oninvalid],
      [onreset], [onselect], [onsubmit],
      [onkeydown], [onkeypress], [onkeyup],
      [onclick], [ondblclick], [ondrag], [ondragend],
      [ondragenter], [ondragleave], [ondragover],
      [ondragstart], [ondrop], [onmousedown], [onmousemove],
      [onmouseout], [onmouseover], [onmouseup], [onmousewheel],
      [onscroll],
      [onabort], [oncanplay], [oncanplaythrough],
      [ondurationchange], [onemptied], [onended], [onerror],
      [onloadeddata], [onloadedmetadata], [onloadstart],
      [onpause], [onplay], [onplaying], [onprogress],
      [onratechange], [onreadystatechange], [onseeked],
      [onseeking], [onstalled], [onsuspend], [ontimeupdate],
      [onvolumechange], [onwaiting]`);

    var charsetIsNotFirst = document.querySelectorAll('head :first-child:not([charset])');

    var nestedInteractiveElements = document.querySelectorAll(`a a[href],
      button a[href],
      a audio[controls],
      button audio[controls],
      a video[controls],
      button video[controls],
      a button,
      button button,
      a details,
      button details,
      a embed,
      button embed,
      a iframe,
      button iframe,
      a img[usemap],
      button img[usemap],
      a label,
      button label,
      a select,
      button select,
      a textarea,
      button textarea,
      a input[type]:not([hidden]),
      button input[type]:not([hidden]),
      form form,
      label label,
      meter meter,
      progress progress`);

    var missingActionAttributeInForm = document.querySelectorAll('form:not([action]), form[action=" "], form[action=""]')
    var missingAltAttributeForImage = document.querySelectorAll(`img[alt=" "],
      area[alt=" "],
      input[type="image"][alt=" "],
      img:not([alt]),
      area:not([alt]),
      input[type="image"]:not([alt])`);

    var missingLabelForRoleImg = document.querySelectorAll('[role="img"]:not([aria-label]):not([aria-labelledby]), svg[role="img"]:not([aria-label]):not([aria-labelledby])')
    var missingLabel = document.querySelectorAll('input:not([type="button"]):not([type="submit"]):not([type="hidden"]):not([type="reset"]):not([type="image"]):not([id]):not([aria-label]):not([title]):not([aria-labelledby]), textarea:not([id]):not([aria-label]):not([aria-labelledby]), select:not([id]):not([aria-label]):not([aria-labelledby])')
    var noLanguageDefined = document.querySelectorAll('html:not([lang]), html[lang=" "], html[lang=""]');
    var emptyTitleTag = document.querySelectorAll('title:empty')
    var missingSourceForImage = document.querySelectorAll(`img:not([src]):not([srcset]),
      img[src=""],
      img[src=" "],
      img[src="#"],
      img[src="/"],
      img[srcset=""],
      img[srcset=" "],
      img[srcset="#"],
      img[srcset="/"],
      input[type="image"]:not([src]):not([srcset]),
      input[type="image"][src=""],
      input[type="image"][src=" "],
      input[type="image"][src="#"],
      input[type="image"][src="/"],
      input[type="image"][srcset=""],
      input[type="image"][srcset=" "],
      input[type="image"][srcset="#"]
      input[type="image"][srcset="/"]`);

    var iframeWithoutTitle = document.querySelectorAll(`iframe:not([title]),
      iframe[title=" "],
      iframe[title=""]`);

    console.log(widthAndHeightInMarkup);
  }
}
