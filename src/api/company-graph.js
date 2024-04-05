/** Company Competition Graph API
 * Get Graph /api/comp/surrounding
 */

// const COMPANY_GRAPH_API = '/graph/api/comp/surrounding'

// const COMPANY_GRAPH_API = 'http://ec2-54-89-51-246.compute-1.amazonaws.com/api'
const COMPANY_GRAPH_API = 'http://localhost:8000/api/comp'
export async function getCompanyGraph (nodeId, expandLayers, comp, prod, other, unknown) {
  try {
    const response = await fetch(`${COMPANY_GRAPH_API}/surrounding?node_id=${nodeId}&expand_number_of_layers=${expandLayers}&competition=${comp}&product=${prod}&other=${other}&unknown=${unknown}`)
    console.log(`${COMPANY_GRAPH_API}/surrounding?node_id=${nodeId}&expand_number_of_layers=${expandLayers}&competition=${comp}&product=${prod}&other=${other}&unknown=${unknown}`)
    const data = await response.json()
    const nodeset = new Set()
    let lennode = data.nodes.length
    for (let i = 0; i < lennode; i++) {
      if (!nodeset.has(data.nodes[i].id)) {
        data.nodes.splice(i, 1)
        i = i - 1
        lennode = lennode - 1
      }
    }
    return data
  } catch (e) {
    console.error(e)
  }
}

export async function getDow30Graph () {
  try {
    const response = await fetch(`${COMPANY_GRAPH_API}/dow30`)
    const data = await response.json()
    const nodeset = new Set()
    let lennode = data.nodes.length
    for (let i = 0; i < lennode; i++) {
      if (!nodeset.has(data.nodes[i].id)) {
        data.nodes.splice(i, 1)
        i = i - 1
        lennode = lennode - 1
      }
    }
    return data
  } catch (e) {
    console.error(e)
  }
}

export async function getSP500Graph () {
  try {
    const response = await fetch(`${COMPANY_GRAPH_API}/sp500`)
    const data = await response.json()
    const nodeset = new Set()
    let lennode = data.nodes.length
    for (let i = 0; i < lennode; i++) {
      if (!nodeset.has(data.nodes[i].id)) {
        data.nodes.splice(i, 1)
        i = i - 1
        lennode = lennode - 1
      }
    }
    return data
  } catch (e) {
    console.error(e)
  }
}
