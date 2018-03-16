import jQuery from 'jquery';
const $ = jQuery;
const urlRegex = /(\W[^/]*)\/?(.*)/;
class PopStateHandler {
  constructor () {
    this.viewMethods = {};
    // this.changePage();
    window.addEventListener('popstate', () => this.changePage());
    $(function () {
      $('header a').removeClass('active');
      $(`header a[href="${location.pathname}"]`).addClass('active');
    });
    this.addEventHandler();
  }

  bindViewToPopState (url, viewMethod) {
    // console.log(this.viewMethods);
    Object.assign(this.viewMethods, { [url]: viewMethod });
  }

  addEventHandler () {
    let that = this;
    // $('a.pop').unbind('click');
    $(document).off('click', 'a.pop');
    $(document).on('click', 'a.pop', function (e) {
      e.preventDefault();
      let href = $(this).attr('href');
      history.pushState(null, null, href);
      that.changePage();
    });
  }

  changePage () {
    let url = location.pathname;
    let urlParts = urlRegex.exec(url);
    $('header a').removeClass('active');
    $(`header a[href="${url}"]`).addClass('active');
    let urlPart = urlParts[1];
    try {
      this.viewMethods[urlPart]();
    } catch (e) {
      throw new Error(urlPart + ' has no associated view!');
    }
    this.addEventHandler();
  }
}

export default PopStateHandler;
