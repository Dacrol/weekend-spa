import PopStateHandler from './pop-state-handler.js';
import jQuery from 'jquery';
// @ts-ignore
require('jsrender')(jQuery);
const $ = jQuery;
const urlRegex = /(\W[^/]*)\/?(.*)/;

/** Class for rendering views */
class Renderer extends PopStateHandler {
  /**
   * Binds a view to a URL
   *
   * @param {string} [view] The HTML file to render
   * @param {string} url The path of the view
   * @param {Object|Function} contextData Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {Function} [callbackFn] a function to run after the view is rendered.
   * @memberof Renderer
   */
  bindView (selector, view = '', url, contextData, callbackFn) {
    let viewMethod = () => {
      // @ts-ignore
      Renderer.bindView(...arguments);
    };
    this.bindViewToPopState(url, viewMethod);
    viewMethod();
  }

  /**
   * Binds a view to a selector and a URL, and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.
   *
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @param {string} view
   * @param {string} url
   * @param {string} jsonUrl
   * @param {(string|string[])} dataName name of the data as it is written in the html template file, for example: 'movie' results in the data being accessible with {{:movie}}. Pass one string for each JSON.
   * @param {string} [dataKey] name of the object key that holds the desired data, for example: 'name' in salons.json
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @memberof Renderer
   */
  bindViewWithJSON (
    selector,
    view,
    url,
    jsonUrl,
    dataName,
    dataKey,
    callbackFn
  ) {
    let viewMethod = () => {
      // @ts-ignore
      Renderer.bindViewWithJSON(...arguments);
    };
    this.bindViewToPopState(url, viewMethod);
    viewMethod();
  }

  /**
   * Renders a view
   *
   * @param {string|Function} viewFile Pass empty string to only call the callback function.
   * @param {Object|Function} contextData Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {Function} [callbackFn] a function to run after the view is rendered.
   * @param {string} [selector='#root'] Target selector to insert html in, default #root
   * @param {string} [viewsFolder='/views/'] default /views/
   * @returns {Promise}
   * @memberof Renderer
   */
  renderView (
    viewFile,
    contextData,
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
   * @param {string} url The path of the view
   * @param {Object|Function} contextData Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {Function} [callbackFn] a function to run after the view is rendered.
   * @memberof Renderer
   */
  static bindView (view = '', url, contextData, callbackFn) {
    $(document).ready(function () {
      const path = location.pathname;
      const urlParts = urlRegex.exec(path);
      // console.log(urlParts);
      try {
        if (urlParts[1] === url && typeof contextData !== 'function') {
          // console.log('!')
          Object.assign(contextData, { pathParams: urlParts[2] });
          // console.log(contextData);
          if (callbackFn) {
            Renderer.renderView(view, contextData, callbackFn);
          } else {
            Renderer.renderView(view, contextData);
          }
        } else if (urlParts[1] === url) {
          contextData(Renderer, urlParts[2]);
        }
      } catch (error) {
        console.warn('Invalid url: ', error);
      }
    });
  }

  /**
   * Binds a view to a selector and a URL
   *
   * @static
   * @param {string} selector Selector to bind to
   * @param {string} [view] The HTML file to render
   * @param {string} url The path of the view
   * @param {Object|Function} contextData Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @memberof Renderer
   */
  static bindViewToSelector (
    selector,
    view = '',
    url,
    contextData,
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
      $(selector).click(function (e) {
        e.preventDefault();
        if (typeof contextData !== 'function') {
          Renderer.renderView(view, contextData, callbackFn);
        } else {
          contextData(Renderer);
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
   * Binds a view to a selector and a URL, and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.
   *
   * @static
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @param {string} view
   * @param {string} url
   * @param {(string|string[])} jsonUrl
   * @param {(string|string[])} dataName name of the data as it is written in the html template file, for example: 'movie' results in the data being accessible with {{:movie}}. Pass one string for each JSON.
   * @param {string} [dataKey] name of the object key that holds the desired data, for example: 'name' in salons.json. Setting this parameter lets you only access the selected keys from the JSON and nothing else.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @memberof Renderer
   */
  static bindViewWithJSON (
    selector,
    view,
    url,
    jsonUrl,
    dataName,
    dataKey = null,
    callbackFn = null
  ) {
    if (!Array.isArray(jsonUrl)) {
      if (!jsonUrl.startsWith('/')) {
        jsonUrl = '/' + jsonUrl;
      }
      Renderer.bindView(selector, view, url, function (Renderer, pathParams) {
        // @ts-ignore
        $.getJSON(jsonUrl, function (json) {
          let contextData = { pathParams: pathParams };
          if (!Array.isArray(dataName)) {
            Object.assign(contextData, { [dataName]: json });
          } else {
            dataName.forEach((tagVariable, index) => {
              if (!dataKey || typeof dataKey === 'function') {
                Object.assign(contextData, { [tagVariable]: json[index] });
              } else {
                Object.assign(contextData, {
                  [tagVariable]: json[index][dataKey]
                });
              }
            });
          }
          // console.log(contextData);
          if (typeof dataKey === 'function') {
            callbackFn = dataKey;
          }
          Renderer.renderView(view, contextData, callbackFn);
        });
      });
    } else if (Array.isArray(jsonUrl)) {
      Renderer.bindView(selector, view, url, async (Renderer, pathParams) => {
        let contextData = await Promise.all(
          // @ts-ignore
          jsonUrl.map(url => {
            return $.getJSON(url);
          })
        );
        if (typeof dataKey === 'function') {
          callbackFn = dataKey;
        }
        if (!dataName) {
          dataName = 'data';
        }
        if (typeof dataName === 'string') {
          Renderer.renderView(view, { [dataName]: contextData }, callbackFn);
        } else if (
          Array.isArray(dataName) &&
          Array.isArray(jsonUrl) &&
          dataName.length === jsonUrl.length
        ) {
          let data = {};
          dataName.forEach((name, index) => {
            Object.assign(data, { [name]: contextData[index] });
          });
          Renderer.renderView(view, data, callbackFn);
        }
      });
    }
  }

  /**
   * Renders a view
   *
   * @static
   * @param {string|Function} viewFile Pass empty string to only call the callback function.
   * @param {Object|Function} contextData Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams.
   * @param {Function} [callbackFn] a function to run after the view is rendered.
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
