
const url_json = [
  {
    "name":"Google",
    "url":"https://www.google.com/"
  },
  {
    "name":"CloudFlare",
    "url":"https://www.cloudflare.com/"
  },
  {
    "name":"GitHub",
    "url":"https://github.com/"
  }

]


class LinksTransformer {
  constructor(links_url, attribute) {
    this.links_url = links_url
    this.attribute = attribute
  }

  async element(element) {
    console.log("New v1")
    const retrieved_attribute = element.getAttribute("id")
    //console.log("Inside Re-writer out: ", div_links)
    if (retrieved_attribute === "links") {
      this.links_url.forEach((link) =>
      {
        //console.log("Link: ", link)
        element.append('<a href="' + link.url + '">' + link.name + ' </a>', {html:true});
      });
    }else if(retrieved_attribute === "profile") {
      // console.log("Else If Style Div link: ", retrieved_attribute, " Attribute: ", this.attribute)
      element.removeAttribute(this.attribute)
    }else if(retrieved_attribute === "avatar")  {
     // console.log("Else Div link: ", retrieved_attribute, " Attribute: ", this.attribute)
      element.setAttribute("src", "https://avatars3.githubusercontent.com/u/12993863?s=460&u=09966d2b1535e64dbc10f0b3580b148dc7ffbd47&v=4");
    }else if(retrieved_attribute === "name")
    {
      console.log("Else Div link: ", retrieved_attribute, " Attribute: ", this.attribute)
      element.setInnerContent("likithponnanna", {html: false})
    }
  }
}


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  const static_html_url ="https://static-links-page.signalnerve.workers.dev";
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }

  let match = request.url.match('\/links$');
  //console.log("My request url: ", request.url)
  if (match!==null &&  match[0].toString() === "/links") {
    return new Response(url_json, {
      headers: { "content-type": "application/json;charset=UTF-8" }
    })
  }else {
    const response = await fetch(static_html_url, init)
    const results = await gatherResponse(response)

    const new_response = await new Response(results, init);
    return new HTMLRewriter()
      .on("div#links", new LinksTransformer(url_json, "id"))
      .on("div#profile", new LinksTransformer(url_json,"style"))
      .on("img#avatar", new LinksTransformer(url_json,"src"))
      .on("h1#name", new LinksTransformer(url_json,"text"))
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
