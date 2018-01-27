
import jQuery from 'jquery';
const $ = jQuery;
const urlRegex = /(\W\w*)\W?(.*)/;
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
    $('a.pop').off('click', 'a.pop');
    $(document).on('click', 'a.pop', function (e) {
      let href = $(this).attr('href');
      history.pushState(null, null, href);
      that.changePage();
      e.preventDefault();
    });
  }

  changePage () {
    let url = location.pathname;
    let urlParts = urlRegex.exec(url);
    $('header a').removeClass('active');
    $(`header a[href="${url}"]`).addClass('active');
    let urlPart = urlParts[1];
    this.viewMethods[urlPart]();
    this.addEventHandler();
  }
}

export default PopStateHandler;
