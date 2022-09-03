import fetch from 'cross-fetch';
import taxRates from './data/taxRate.json';
export async function returnSiteTitles() {
    const urls = [
        'https://patientstudio.com/',
        'https://www.startrek.com/',
        'https://www.starwars.com/',
        'https://www.neowin.net/'
    ];
    const titles = await Promise.all(urls.map(async (url) => {
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            const data = await response.text();
            const match = data.match(/<title>(.*?)<\/title>/);
            if (match === null || match === void 0 ? void 0 : match.length) {
                return match[1];
            }
        }
        return null;
    }));
    return titles;
}
export function findTagCounts(localData) {
    const tagCounts = [];
    localData
        .reduce((map, item) => {
        item.tags.forEach(tag => map.set(tag, (map.get(tag) || 0) + 1));
        return map;
    }, new Map())
        .forEach((count, tag) => tagCounts.push({ tag, count }));
    return tagCounts;
}
export function calcualteImportCost(importedItems) {
    const result = new Array();
    const importTaxRatesMap = getTaxRateMap(taxRates);
    importedItems.forEach(importedItem => {
        const importTaxRateObject = importTaxRatesMap.get(importedItem.countryDestination);
        const importTaxRate = importTaxRateObject ? getImportTaxRate(importedItem, importTaxRateObject) : 0;
        const importCost = importedItem.unitPrice * importedItem.quantity * importTaxRate;
        const totalCost = importCost + importedItem.unitPrice * importedItem.quantity;
        const importCostOutput = createImportCostOutput(importedItem.name, 0, importCost, totalCost);
        result.push(importCostOutput);
    });
    return result;
}
export function createImportCostOutput(name, subtotal, importCost, totalCost) {
    return { name, subtotal, importCost, totalCost };
}
function getTaxRateMap(importTaxRates) {
    return importTaxRates.reduce((map, item) => {
        map.set(item.country, item);
        return map;
    }, new Map());
}
function getImportTaxRate(importedItem, importTaxRate) {
    return importTaxRate.categoryExceptions.some(item => item === importedItem.category) ? 0 : importTaxRate.importTaxRate;
}
