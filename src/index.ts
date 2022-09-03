import fetch from 'cross-fetch'
import taxRates from './data/taxRate.json'

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */
export async function returnSiteTitles() {
  const urls = [
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.starwars.com/',
    'https://www.neowin.net/'
  ]

  const titles = await Promise.all(
    urls.map(async url => {
      const response = await fetch(url, { method: 'GET' })

      if (response.status === 200) {
        const data = await response.text()
        const match = data.match(/<title>(.*?)<\/title>/)
        if (match?.length) {
          return match[1]
        }
      }

      return null
    })
  )

  return titles
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tagCounts: Array<TagCounts> = []

  localData
    .reduce((map, item) => {
      item.tags.forEach(tag => map.set(tag, (map.get(tag) || 0) + 1))
      return map
    }, new Map<string, number>())
    .forEach((count, tag) => tagCounts.push({ tag, count }))

  // for (let i = 0; i < localData.length; i++) {
  //   const tags = localData[i].tags

  //   for (let j = 0; j < tags.length; j++) {
  //     const tag = tags[j]

  //     for (let k = 0; k < tagCounts.length; k++) {
  //       if (tagCounts[k].tag === tag) {
  //         tagCounts[k].count++
  //       } else {
  //         tagCounts.push({ tag, count: 1 })
  //       }
  //     }
  //   }
  // }

  return tagCounts
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 */
export function calcualteImportCost(importedItems: Array<ImportedItem>): Array<ImportCostOutput> {
  // please write your code in here.
  // note that `taxRate` has already been imported for you
  const result = new Array<ImportCostOutput>()
  const importTaxRatesMap = getTaxRateMap(taxRates)

  importedItems.forEach(importedItem => {
    const importTaxRateObject = importTaxRatesMap.get(importedItem.countryDestination)
    const importTaxRate = importTaxRateObject ? getImportTaxRate(importedItem, importTaxRateObject) : 0
    const importCost = importedItem.unitPrice * importedItem.quantity * importTaxRate
    const totalCost = importCost + importedItem.unitPrice * importedItem.quantity
    const importCostOutput = createImportCostOutput(importedItem.name, 0, importCost, totalCost)
    result.push(importCostOutput)
  })

  return result
}

export function createImportCostOutput(
  name: string,
  subtotal: number,
  importCost: number,
  totalCost: number
): ImportCostOutput {
  return { name, subtotal, importCost, totalCost }
}

function getTaxRateMap(importTaxRates: Array<ImportTaxRate>): Map<string, ImportTaxRate> {
  return importTaxRates.reduce((map, item) => {
    map.set(item.country, item)
    return map
  }, new Map<string, ImportTaxRate>())
}

function getImportTaxRate(importedItem: ImportedItem, importTaxRate: ImportTaxRate): number {
  return importTaxRate.categoryExceptions.some(item => item === importedItem.category) ? 0 : importTaxRate.importTaxRate
}
