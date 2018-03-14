import PopStateHandler from './pop-state-handler';
import jQuery from 'jquery';
// @ts-ignore
require('jsrender')(jQuery);
const $ = jQuery;
const urlRegex = /(\W[^/]*)\/?(.*)/;

/** Class for binding and rendering views. Create an instance of Renderer to persist the bindings, which causes any link with the class "pop" to trigger the rendering without reloading the page. */
class Renderer extends PopStateHandler {
  /**
   * Binds a view to a URL
   *
   * @param {string} [view] The HTML file to render
   * @param {string|Function} [url] The path of the view
   * @param {Object|Function} [contextData] Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {function(Object)|string} [callbackFn] a function with parameter (contextData) to run after the view is rendered.
   * @param {string} [selector] Supply a selector to bind with selector instead of only url
   * @memberof Renderer
   */
  bindView (view = '', url, contextData = {}, callbackFn, selector = '') {
    let viewMethod = () => {
      // @ts-ignore
      Renderer.bindView(...arguments);
    };
    if (url) {
      this.bindViewToPopState(url, viewMethod);
    }
    viewMethod();
  }

  /**
   * Binds a view to a URL (and optionally a selector), and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.
   *
   * @param {string} view name of the html file with the template to render
   * @param {string} [url] URL to bind to
   * @param {(string|string[])} jsonUrl URL(s) for JSON to fetch
   * @param {(string|string[])} dataName name of the data as it is written in the html template file, for example: 'movie' results in the data being accessible with {{:movie}}. Pass one string for each JSON.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @param {Object|string} [additionalData] Additional data to be available in the template and callback. Must be a "true" object that can be Object.assign()ed onto the fetched data.
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @memberof Renderer
   */
  bindViewWithJSON (
    view,
    url,
    jsonUrl,
    dataName = 'data',
    callbackFn = null,
    additionalData = null,
    selector = ''
  ) {
    let viewMethod = () => {
      // @ts-ignore
      Renderer.bindViewWithJSON(...arguments);
    };
    if (url) {
      this.bindViewToPopState(url, viewMethod);
    }
    viewMethod();
  }

  /**
   * Renders a view
   *
   * @param {string|function(Object)} viewFile Pass empty string to only call the callback function.
   * @param {Object} [contextData] Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array.
   * @param {function(Object)} [callbackFn] a function with parameter (contextData) to run after the view is rendered.
   * @param {string} [selector='#root'] Target selector to insert html in, default #root
   * @param {string} [viewsFolder='/views/'] default /views/
   * @returns {Promise}
   * @memberof Renderer
   */
  renderView (
    viewFile,
    contextData = {},
    callbackFn = null,
    selector = '#root',
    viewsFolder = '/views/'
  ) {
    // @ts-ignore
    return Renderer.renderView(...arguments);
  }

  /**
   * Binds a view to a URL
   *
   * @static
   * @param {string} [view] The HTML file to render
   * @param {string|Function} [url] The path of the view
   * @param {Object|Function} [contextData] Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {function(Object)|string} [callbackFn] a function with parameter (contextData) to run after the view is rendered.
   * @param {string} [selector] Supply a selector to bind with selector instead of only url
   * @memberof Renderer
   */
  static bindView (view = '', url, contextData = {}, callbackFn, selector = '') {
    if (typeof callbackFn === 'string') {
      selector = callbackFn;
      callbackFn = () => {};
    }
    if (!contextData) {
      contextData = {};
    }
    if (
      view &&
      typeof url === 'function' &&
      Object.keys(contextData).length === 0 &&
      typeof contextData !== 'function'
    ) {
      contextData = url;
      url = view;
    }
    if (selector && typeof url === 'string') {
      Renderer.bindViewToSelector(selector, view, url, contextData, callbackFn);
    }
    if (url) {
      $(document).ready(async function () {
        const path = location.pathname;
        const urlParts = urlRegex.exec(path);
        // console.log(urlParts);
        try {
          if (urlParts[1] === url && typeof contextData !== 'function') {
            // console.log(view);
            Object.assign(contextData, { pathParams: urlParts[2] });
            // console.log(contextData);
            if (callbackFn && typeof callbackFn === 'function') {
              Renderer.renderView(view, contextData, callbackFn);
            } else {
              Renderer.renderView(view, contextData);
            }
          } else if (urlParts[1] === url && !view) {
            contextData(Renderer, urlParts[2]);
          } else if (urlParts[1] === url) {
            if (callbackFn && typeof callbackFn === 'function') {
              Renderer.renderView(
                view,
                typeof contextData === 'function'
                  ? await contextData(Renderer, urlParts[2])
                  : contextData,
                callbackFn
              );
            } else {
              Renderer.renderView(
                view,
                typeof contextData === 'function'
                  ? await contextData(Renderer, urlParts[2])
                  : contextData
              );
            }
          }
        } catch (error) {
          console.warn('Invalid url: ', error);
        }
      });
    }
  }

  /**
   * Binds a view to a selector and a URL
   *
   * @static
   * @param {string} selector Selector to bind to
   * @param {string} [view] The HTML file to render
   * @param {string} [url] The path of the view
   * @param {Object|Function} [contextData] Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {function(Object)} [callbackFn] a function with parameter (contextData) to run each time the view is rendered.
   * @memberof Renderer
   */
  static bindViewToSelector (
    selector,
    view = '',
    url,
    contextData = {},
    callbackFn = null
  ) {
    if ($(selector).length === 0) {
      throw new Error('No selector "' + selector + '" found.');
    }
    if (url && !url.startsWith('/')) {
      url = '/' + url;
    }
    if (!$(selector).hasClass('pop') && !$(selector).prop('href')) {
      // Selector is not a link.
      $(selector).unbind('click');
      $(selector).click(async function (e) {
        e.preventDefault();
        if (typeof contextData !== 'function') {
          Renderer.renderView(view, contextData, callbackFn);
        } else if (!view) {
          contextData(Renderer);
        } else {
          const path = location.pathname;
          const urlParts = urlRegex.exec(path);
          if (callbackFn && typeof callbackFn === 'function') {
            Renderer.renderView(
              view,
              typeof contextData === 'function'
                ? await contextData(Renderer, urlParts[2])
                : contextData,
              callbackFn
            );
          } else {
            Renderer.renderView(
              view,
              typeof contextData === 'function'
                ? await contextData(Renderer, urlParts[2])
                : contextData
            );
          }
        }
      });
    } else if ($(selector).prop('href')) {
      // Selector is a link but does not have the pop class, add it.
      $(selector).addClass('pop');
    } else if ($(selector).is('a')) {
      // Selector has the pop class and is a link but does not have a href, add it.
      $(selector).prop('href', url);
    }
    // Bind the view if there's a url.
    if (url) {
      Renderer.bindView(view, url, contextData, callbackFn);
    }
  }

  /**
   * Binds a view to a URL (and optionally a selector), and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.
   *
   * @static
   * @param {string} view name of the html file with the template to render
   * @param {string} [url] URL to bind to
   * @param {(string|string[])} jsonUrl URL(s) for JSON to fetch
   * @param {(string|string[])} dataName name of the data as it is written in the html template file, for example: 'movie' results in the data being accessible with {{:movie}}. Pass one string for each JSON.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @param {Object|string} [additionalData] Additional data to be available in the template and callback. Must be a "true" object that can be Object.assign()ed onto the fetched data.
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @memberof Renderer
   */
  static bindViewWithJSON (
    view,
    url,
    jsonUrl,
    dataName = 'data',
    callbackFn = null,
    additionalData = null,
    selector = ''
  ) {
    if (typeof dataName === 'function' && !callbackFn) {
      callbackFn = dataName;
      dataName = 'data';
    }
    if (typeof additionalData === 'string' && !selector) {
      selector = additionalData;
      additionalData = null;
    }
    if (!Array.isArray(jsonUrl)) {
      if (!jsonUrl.startsWith('/')) {
        jsonUrl = '/' + jsonUrl;
      }
      Renderer.bindView(
        null,
        url,
        function (Renderer, pathParams) {
          // @ts-ignore
          $.getJSON(jsonUrl, function (json) {
            let contextData = { pathParams: pathParams };
            if (!Array.isArray(dataName)) {
              Object.assign(contextData, { [dataName]: json });
            } else {
              dataName.forEach((tagVariable, index) => {
                Object.assign(contextData, { [tagVariable]: json[index] });
              });
            }
            // console.log(contextData);
            if (
              additionalData &&
              additionalData.constructor.name === 'Object'
            ) {
              Object.assign(contextData, additionalData);
            }
            Renderer.renderView(view, contextData, callbackFn);
          });
        },
        selector
      );
    } else if (Array.isArray(jsonUrl)) {
      Renderer.bindView(
        null,
        url,
        async (Renderer, pathParams) => {
          let contextData = { pathParams: pathParams };
          let promiseData = await Promise.all(
            // @ts-ignore
            jsonUrl.map((url) => {
              return $.getJSON(url);
            })
          );
          Object.assign(contextData, promiseData);
          if (typeof dataName === 'string' || !dataName) {
            let data =
              typeof dataName === 'string' && dataName.trim().length > 0
                ? { [dataName]: contextData }
                : contextData;
            if (
              additionalData &&
              additionalData.constructor.name === 'Object'
            ) {
              Object.assign(data, additionalData);
            }
            Renderer.renderView(view, data, callbackFn);
          } else if (
            Array.isArray(dataName) &&
            Array.isArray(jsonUrl) &&
            dataName.length === jsonUrl.length
          ) {
            let data = {};
            dataName.forEach((name, index) => {
              Object.assign(data, { [name]: contextData[index] });
            });
            if (
              additionalData &&
              additionalData.constructor.name === 'Object'
            ) {
              Object.assign(data, additionalData);
            }
            Renderer.renderView(view, data, callbackFn);
          }
        },
        selector
      );
    }
  }

  /**
   * Renders a view
   *
   * @static
   * @param {string|function(Object)} viewFile Pass empty string to only call the callback function.
   * @param {Object} [contextData] Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array.
   * @param {function(Object)} [callbackFn] a function with parameter (contextData) to run after the view is rendered.
   * @param {string} [selector='#root'] Target selector to insert html in, default #root
   * @param {string} [viewsFolder='/views/'] default /views/
   * @returns {Promise}
   * @memberof Renderer
   */
  static renderView (
    viewFile,
    contextData,
    callbackFn = null,
    selector = '#root',
    viewsFolder = '/views/'
  ) {
    // console.log(contextData);
    return new Promise((resolve, reject) => {
      if (typeof viewFile === 'function' && !callbackFn) {
        callbackFn = viewFile;
      }
      if (viewFile && typeof viewFile === 'string') {
        if (!(contextData instanceof Object)) {
          contextData = {};
        }
        if (viewFile.startsWith('/')) {
          viewFile = /[^/](.*)$/.exec(viewFile)[0];
        }
        if (!(viewFile.endsWith('.html') || viewFile.endsWith('.htm'))) {
          viewFile = viewFile + '.html';
        }
        if (!viewsFolder.endsWith('/')) {
          viewsFolder = viewsFolder + '/';
        }
        const url = viewsFolder + viewFile;
        $.get(url, function (data) {
          try {
            $(selector).html($.templates(data).render(contextData));
            if (callbackFn) {
              callbackFn(contextData);
            }
            resolve();
          } catch (e) {
            reject(e);
          }
          // console.log(contextData);
        });
      } else if (callbackFn && typeof callbackFn === 'function') {
        callbackFn(contextData);
        resolve();
      } else {
        reject(new Error('No viewFile or function supplied'));
      }
    });
  }
}

export default Renderer;
