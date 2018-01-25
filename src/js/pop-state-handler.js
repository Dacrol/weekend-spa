class PopStateHandler {
  constructor () {
    this.viewMethods = {};
    this.addEventHandler();
    // this.changePage();
    window.addEventListener('popstate', () => this.changePage());
    $(function () {
      $('header a').removeClass('active');
      $(`header a[href="${location.pathname}"]`).addClass('active');
    });
  }

  bindViewToPopState (url, viewMethod) {
    // console.log(this.viewMethods);
    Object.assign(this.viewMethods, { [url]: viewMethod });
  }

  addEventHandler () {
    let that = this;

    $(document).on('click', 'a.pop', function (e) {
      let href = $(this).attr('href');
      history.pushState(null, null, href);

      that.changePage();

      e.preventDefault();
    });
  }

  changePage () {
    let url = location.pathname;

    $('header a').removeClass('active');
    $(`header a[href="${url}"]`).addClass('active');

    // let methodName = this.urls[url];
    this.viewMethods[url]();
  }
}

export default PopStateHandler;
