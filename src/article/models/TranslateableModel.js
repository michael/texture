import {
  TextModel, FlowContentModel
} from '../../kit'

/*
  A special view on a translatable text inside the document.

  Note: in terms of JATS this model can not represented as a single element.
  We use this class to provide a general abstraction of the concept of
  an translatable entity.
*/

export default class TranslateableModel {
  /*
    @param {ArticleAPI} api
    @param {string} id
    @param {StringModel} originalLanguageCode The main language i.e. the language of the article
    @param {StringModel} originalText The content in the original language
    @param {CollectionModel} translations
  */
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id () {
    return this._node.id
  }

  get type () {
    return 'translatable'
  }

  /*
    Returns original language code
  */
  getOriginalLangageCode () {
    return this._originalLanguageCode
  }

  /*
    Returns the text model to be translated
  */
  getOriginalText () {
    return this._node
  }

  getOriginalModel () {
    let model
    if (this._node.isText()) {
      model = new TextModel(this._api, this._node.getTextPath())
    } else {
      model = new FlowContentModel(this._api, this._node.getContentPath())
    }
    return model
  }

  /*
    Returns a list of translations
  */
  getTranslations () {
    let article = this._api.getArticle()
    return this._node.translations.map(t => article.get(t))
  }

  /*
    Creates a new translation (with empty text) for a given language code
  */
  addTranslation (languageCode) {
    this._api.addTranslation(this._id, languageCode)
  }

  /*
    Removes a translation for a given language code
  */
  removeTranslation (languageCode) {
    this._api.deleteTranslation(this._id, languageCode)
  }
}
