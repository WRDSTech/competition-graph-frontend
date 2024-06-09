/** Company Competition Graph API
 * Get Graph /api/comp/surrounding
 */

// const COMPANY_GRAPH_API = '/graph/api/comp/surrounding'

const COMPANY_GRAPH_API = 'https://wrds-demo.ddns.net/api'
export async function getCompanyGraph (nodeId, expandLayers, comp, prod, other, unkown) {
  try {
    console.log(`${COMPANY_GRAPH_API}?node_id=${nodeId}&expand_number_of_layers=${expandLayers}`)
    const response = await fetch(`${COMPANY_GRAPH_API}?node_id=${nodeId}&expand_number_of_layers=${expandLayers}`)
    // const response = await fetch(`${COMPANY_GRAPH_API}`)
    const data = await response.json()
    const nodeset = new Set()
    if (data && data.links && data.nodes) {
      let len = data.links.length
      for (let i = 0; i < len; i++) {
        let flag = false
        if (comp !== 'true' && data.links[i].category === 'competition') {
          flag = true
        }
        if (prod !== 'true' && data.links[i].category === 'prodcut') {
          flag = true
        }
        if (other !== 'true' && data.links[i].category === 'other') {
          flag = true
        }
        if (unkown !== 'true' && data.links[i].category === 'unknown') {
          flag = true
        }
        if (flag) {
          data.links.splice(i, 1)
          i = i - 1
          len = len - 1
        } else {
          nodeset.add(data.links[i].source)
          nodeset.add(data.links[i].target)
        }
      }
      let lennode = data.nodes.length
      for (let i = 0; i < lennode; i++) {
        if (!nodeset.has(data.nodes[i].id)) {
          data.nodes.splice(i, 1)
          i = i - 1
          lennode = lennode - 1
        }
      }

      return data
    } else {
      return null
    }
  } catch (e) {
    console.error(e)
  }
}
