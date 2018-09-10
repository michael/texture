import forEach from '../util/forEach'
import { isArray } from 'substance';

/*
  Note: this implementation is different to the core implementation
  in that regard that it serializes child nodes before their parents
*/
export default class ArticleJSONConverter {
  importDocument (doc, json) {
    if (!json.nodes) {
      throw new Error('Invalid JSON format.')
    }
    // the json should just be an array of nodes
    var nodes = json.nodes
    doc.import(function (tx) {
      forEach(nodes, function (node) {
        tx.create(node)
      })
    })
    return doc
  }

  exportDocument (doc) {
    var schema = doc.getSchema()
    var json = {
      schema: {
        name: schema.name
      },
      nodes: {}
    }
    let visited = {}

    function _export (node) {
      if (!node) return
      if (visited[node.id]) return
      visited[node.id] = true
      let nodeSchema = node.getSchema()
      nodeSchema.getOwnedProperties().forEach(prop => {
        let val = node[prop]
        if (isArray(val)) {
          val.forEach(id => {
            _export(doc.get(id))
          })
        } else {
          _export(doc.get(val))
        }
      })
      json.nodes[node.id] = node.toJSON()
    }

    forEach(doc.getNodes(), node => _export(node))

    return json
  }
}
