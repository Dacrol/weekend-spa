import PopStateHandler from './pop-state-handler.js';
import jQuery from 'jquery';
// @ts-ignore
require('jsrender')(jQuery);
const $ = jQuery;
const urlRegex = /(\W\w*)\W?(.*)/;

/** Class for rendering views */
class Renderer extends PopStateHandler {
  /**
   * Binds a view to a selector and a URL
   *
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @param {string} [view] The HTML file to render
   * @param {string} url The path of the view, example: /current
   * @param {Object} contextData Object containing tag arguments, for example: {salong1: salongName} for the tag {{:salong1}}, or a function that ends by calling Renderer.renderView. Providing the data as an array will render the template once for each item in the array. A provided function can also use the usual render function from the inherited Base class.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
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
   * @param {(string|string[])} dataName name of the tags as they are written in the html template file, for example: ['salong1', 'salong2'] for a template with the tags {{:salong1}} & {{:salong2}}. Pass a single string to access the entire JSON object as is.
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
   * @param {string} viewFile
   * @param {Object} contextData Object containing tag arguments, for example: {salong1: salongName} for the tag {{:salong1}}. Providing the data as an array will render the template once for each item in the array. A provided function can also use the usual render function from the inherited Base class.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @param {string} [selector='#root'] default #root
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
   * Binds a view to a selector and a URL
   *
   * @static
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @param {string} [view] The HTML file to render
   * @param {string} url The path of the view, example: /current
   * @param {Object} contextData Object containing tag arguments, for example: {salong1: salongName} for the tag {{:salong1}}, or a function that ends by calling Renderer.renderView. Providing the data as an array will render the template once for each item in the array. A provided function can also use the usual render function from the inherited Base class.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @memberof Renderer
   */
  static bindView (
    selector = null,
    view = '',
    url,
    contextData,
    callbackFn = null
  ) {
    if (selector && !$(selector).hasClass('pop') && !$(selector).prop('href')) {
      $(selector).unbind('click');
      $(selector).click(function (e) {
        e.preventDefault();
        if (typeof contextData !== 'function') {
          Renderer.renderView(view, contextData, callbackFn);
        } else {
          contextData(Renderer);
        }
      });
    } else if (selector && !$(selector).prop('href')) {
      $(selector).addClass('pop');
    }
    Renderer.bindViewToUrl(view, url, contextData, callbackFn);
  }

  /**
   * Binds a view to a selector and a URL, and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.
   *
   * @static
   * @param {string} [selector] Only necessary if the selector does not have the class 'pop'
   * @param {string} view
   * @param {string} url
   * @param {(string|string[])} jsonUrl
   * @param {(string|string[])} dataName name of the tags as they are written in the html template file, for example: ['salong1', 'salong2'] for a template with the tags {{:salong1}} & {{:salong2}}. Pass a single string to access the entire JSON object as is.
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
   * @param {string} viewFile
   * @param {Object} contextData Object containing tag arguments, for example: {salong1: salongName} for the tag {{:salong1}}. Providing the data as an array will render the template once for each item in the array. A provided function can also use the usual render function from the inherited Base class.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @param {string} [selector='#root'] default #root
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
      if (viewFile) {
        // console.log(...arguments);
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
  /**
   * Binds a view to a URL
   *
   * @static
   * @param {string} [view]
   * @param {string} url
   * @param {Object} contextData Object containing tag arguments, for example: {salong1: salongName} for the tag {{:salong1}}, or a function that ends by calling Renderer.renderView. Providing the data as an array will render the template once for each item in the array. A provided function can also use the usual render function from the inherited Base class.
   * @param {Function} [callbackFn] a function to run each time the view is rendered.
   * @memberof Renderer
   */
  static bindViewToUrl (view = '', url, contextData, callbackFn) {
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
          contextData(Renderer, { pathParams: urlParts[2] });
        }
      } catch (error) {
        console.warn('Invalid url: ', error);
      }
    });
  }
}

export default Renderer;
