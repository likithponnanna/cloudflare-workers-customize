import { ID, PROFILE_PIC, USERNAME,PROFILE_ID, AVATAR_ID, NAME_ID, LINKS_ID,
  SOCIAL_ID, SOCIAL_URL_JSON, TITLE_TAG, TITLE_NAME,
  BODY_TAG, BODY_BG_COLOR } from './constants'

class LinksTransformer {
  constructor(attribute, links_url) {
    this.links_url = links_url
    this.attribute = attribute
  }

  async element(element) {
    const retrieved_attribute = element.getAttribute(ID)
    if (retrieved_attribute === LINKS_ID) {
      this.linkAppendHelper(element);
    }else if(retrieved_attribute === PROFILE_ID) {
      LinksTransformer.removeAttributeHelper(element,this.attribute)
    }else if(retrieved_attribute === AVATAR_ID)  {
      LinksTransformer.setAttributeHelper(element, this.attribute, PROFILE_PIC)
    }else if(retrieved_attribute === NAME_ID) {
      LinksTransformer.setInnerContentHelper(element,USERNAME)
    }else if(retrieved_attribute === SOCIAL_ID){
      LinksTransformer.removeAttributeHelper(element,this.attribute)
      this.svgAppendHelper(element);
    }else if(element.tagName === BODY_TAG){
      LinksTransformer.setAttributeHelper(element, this.attribute,
        BODY_BG_COLOR)
    } else if(element.tagName === TITLE_TAG){
      LinksTransformer.setInnerContentHelper(element,TITLE_NAME)
    }
  }

  static setAttributeHelper(element, attribute, content){
    element.setAttribute(attribute, content);
  }

  static setInnerContentHelper(element, text){
    element.setInnerContent(text, {html: false})
  }

  static removeAttributeHelper(element, attribute){
    element.removeAttribute(attribute)
  }

  linkAppendHelper(element){
    this.links_url.forEach((link) => {
      element.append('<a href="' + link.url + '">' + link.name + ' </a>'
        , {html:true});
    });
  }

  svgAppendHelper(element)
  {
    SOCIAL_URL_JSON.forEach((social) => {
      element.append('<a href="' + social.url + '"> <svg role="img" ' +
        'viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<title>' +
        social.svg_title
        + '</title><path d="' +
        social.svg_path_d
        + '"/></svg> </a>', {html:true});
    });
  }
}


export default LinksTransformer;