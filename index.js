import {URL_JSON, STATIC_URL, INIT_HTML_HEADER,INIT_JSON_HEADER, ID,
  STYLE_ATTRIBUTE, SRC_ATTRIBUTE, CLASS_ATTRIBUTE} from './constants'
import LinksTransformer from './LinksTransformer'


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request)
    .catch(err => console.log(err.message)))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  console.log("New v1")

  const JSON_URL = JSON.stringify(URL_JSON, null, 2);

  let match = request.url.match('\/links$');

  if (match!==null &&  match[0].toString() === "/links") {
    return await new Response(JSON_URL, INIT_JSON_HEADER)
  }else {
    const response = await fetch(STATIC_URL, INIT_HTML_HEADER)
    const results = await gatherResponse(response)
    const new_response = await new Response(results, INIT_HTML_HEADER);

    return new HTMLRewriter()
      .on("div#links", new LinksTransformer(ID, URL_JSON))
      .on("div#profile", new LinksTransformer(STYLE_ATTRIBUTE, URL_JSON))
      .on("img#avatar", new LinksTransformer(SRC_ATTRIBUTE, URL_JSON))
      .on("h1#name", new LinksTransformer("text"))
      .on("div#social", new LinksTransformer(STYLE_ATTRIBUTE))
      .on("title", new LinksTransformer("text"))
      .on("body", new LinksTransformer(CLASS_ATTRIBUTE))
      .transform(new_response)

  }

  async function gatherResponse(response) {
    const { headers } = response
    const contentType = headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      return JSON.stringify(await response.json())
    }
    else if (contentType.includes("application/text")) {
      return await response.text()
    }
    else if (contentType.includes("text/html")) {
      return await response.text()
    }
    else {
      return await response.text()
    }
  }
}
