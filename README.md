# Weekend-SPA
Wrapper for making single page applications with [JsRender](http://www.jsviews.com/). See [JsRender API](http://www.jsviews.com/#jsrapi) for how to make html templates.
## API 

<a name="Renderer"></a>

## Renderer
Class for binding and rendering views. Create an instance of Renderer to persist the bindings, which causes any link with the class "pop" to trigger the rendering without reloading the page.

**Kind**: global class

* [Renderer](#Renderer)
    * _instance_
        * [.bindView([view], url, [contextData], [callbackFn], [selector])](#Renderer+bindView)
        * [.bindViewWithJSON(view, url, jsonUrl, dataName, [callbackFn], [additionalData], [selector])](#Renderer+bindViewWithJSON)
        * [.renderView(viewFile, [contextData], [callbackFn], [selector], [viewsFolder])](#Renderer+renderView) ⇒ <code>Promise</code>
    * _static_
        * [.bindView([view], url, [contextData], [callbackFn], [selector])](#Renderer.bindView)
        * [.bindViewToSelector(selector, [view], url, [contextData], [callbackFn])](#Renderer.bindViewToSelector)
        * [.bindViewWithJSON(view, url, jsonUrl, dataName, [callbackFn], [additionalData], [selector])](#Renderer.bindViewWithJSON)
        * [.renderView(viewFile, [contextData], [callbackFn], [selector], [viewsFolder])](#Renderer.renderView) ⇒ <code>Promise</code>


* * *

<a name="Renderer+bindView"></a>

### renderer.bindView([view], url, [contextData], [callbackFn], [selector])
Binds a view to a URL

**Kind**: instance method of [<code>Renderer</code>](#Renderer)

| Param | Type | Description |
| --- | --- | --- |
| [view] | <code>string</code> | The HTML file to render |
| url | <code>string</code> | The path of the view |
| [contextData] | <code>Object</code> \| <code>function</code> | Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams. |
| [callbackFn] | <code>function</code> \| <code>string</code> | a function with parameter (contextData) to run after the view is rendered. |
| [selector] | <code>string</code> | Supply a selector to bind with selector instead of only url |


* * *

<a name="Renderer+bindViewWithJSON"></a>

### renderer.bindViewWithJSON(view, url, jsonUrl, dataName, [callbackFn], [additionalData], [selector])
Binds a view to a URL (and optionally a selector), and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.

**Kind**: instance method of [<code>Renderer</code>](#Renderer)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| view | <code>string</code> |  | name of the html file with the template to render |
| url | <code>string</code> |  | URL to bind to |
| jsonUrl | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | URL(s) for JSON to fetch |
| dataName | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <code>&quot;data&quot;</code> | name of the data as it is written in the html template file, for example: 'movie' results in the data being accessible with {{:movie}}. Pass one string for each JSON. |
| [callbackFn] | <code>function</code> | <code></code> | a function to run each time the view is rendered. |
| [additionalData] | <code>Object</code> \| <code>string</code> | <code></code> | Additional data to be available in the template and callback. Must be a "true" object that can be Object.assign()ed onto the fetched data. |
| [selector] | <code>string</code> |  | Only necessary if the selector does not have the class 'pop' |


* * *

<a name="Renderer+renderView"></a>

### renderer.renderView(viewFile, [contextData], [callbackFn], [selector], [viewsFolder]) ⇒ <code>Promise</code>
Renders a view

**Kind**: instance method of [<code>Renderer</code>](#Renderer)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewFile | <code>string</code> \| <code>function</code> |  | Pass empty string to only call the callback function. |
| [contextData] | <code>Object</code> |  | Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. |
| [callbackFn] | <code>function</code> | <code></code> | a function with parameter (contextData) to run after the view is rendered. |
| [selector] | <code>string</code> | <code>&quot;&#x27;#root&#x27;&quot;</code> | Target selector to insert html in, default #root |
| [viewsFolder] | <code>string</code> | <code>&quot;&#x27;/views/&#x27;&quot;</code> | default /views/ |


* * *

<a name="Renderer.bindView"></a>

### Renderer.bindView([view], url, [contextData], [callbackFn], [selector])
Binds a view to a URL

**Kind**: static method of [<code>Renderer</code>](#Renderer)

| Param | Type | Description |
| --- | --- | --- |
| [view] | <code>string</code> | The HTML file to render |
| url | <code>string</code> | The path of the view |
| [contextData] | <code>Object</code> \| <code>function</code> | Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams. |
| [callbackFn] | <code>function</code> \| <code>string</code> | a function with parameter (contextData) to run after the view is rendered. |
| [selector] | <code>string</code> | Supply a selector to bind with selector instead of only url |


* * *

<a name="Renderer.bindViewToSelector"></a>

### Renderer.bindViewToSelector(selector, [view], url, [contextData], [callbackFn])
Binds a view to a selector and a URL

**Kind**: static method of [<code>Renderer</code>](#Renderer)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector to bind to |
| [view] | <code>string</code> |  | The HTML file to render |
| url | <code>string</code> |  | The path of the view |
| [contextData] | <code>Object</code> \| <code>function</code> |  | Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. A provided function can execute any code and has access to the parameters Renderer and pathParams. |
| [callbackFn] | <code>function</code> | <code></code> | a function with parameter (contextData) to run each time the view is rendered. |


* * *

<a name="Renderer.bindViewWithJSON"></a>

### Renderer.bindViewWithJSON(view, url, jsonUrl, dataName, [callbackFn], [additionalData], [selector])
Binds a view to a URL (and optionally a selector), and fetches JSON data to use as tag arguments. For more complex operations than basic JSON fetching, please use the normal bindView with contextData supplied as a function.

**Kind**: static method of [<code>Renderer</code>](#Renderer)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| view | <code>string</code> |  | name of the html file with the template to render |
| url | <code>string</code> |  | URL to bind to |
| jsonUrl | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | URL(s) for JSON to fetch |
| dataName | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <code>&quot;data&quot;</code> | name of the data as it is written in the html template file, for example: 'movie' results in the data being accessible with {{:movie}}. Pass one string for each JSON. |
| [callbackFn] | <code>function</code> | <code></code> | a function to run each time the view is rendered. |
| [additionalData] | <code>Object</code> \| <code>string</code> | <code></code> | Additional data to be available in the template and callback. Must be a "true" object that can be Object.assign()ed onto the fetched data. |
| [selector] | <code>string</code> |  | Only necessary if the selector does not have the class 'pop' |


* * *

<a name="Renderer.renderView"></a>

### Renderer.renderView(viewFile, [contextData], [callbackFn], [selector], [viewsFolder]) ⇒ <code>Promise</code>
Renders a view

**Kind**: static method of [<code>Renderer</code>](#Renderer)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewFile | <code>string</code> \| <code>function</code> |  | Pass empty string to only call the callback function. |
| [contextData] | <code>Object</code> |  | Object containing tag data, which can be accessed in the html view with {{:key}} (see JSRender API), or a function. Providing the data as an array will render the template once for each item in the array. |
| [callbackFn] | <code>function</code> | <code></code> | a function with parameter (contextData) to run after the view is rendered. |
| [selector] | <code>string</code> | <code>&quot;&#x27;#root&#x27;&quot;</code> | Target selector to insert html in, default #root |
| [viewsFolder] | <code>string</code> | <code>&quot;&#x27;/views/&#x27;&quot;</code> | default /views/ |


* * *
