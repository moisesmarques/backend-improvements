import * as testFunctions from './index';
import localData from './data/records.json';
import importedItems from './data/importedItems.json';
describe('Test returnSiteTitles', () => {
    it('should return the proper site titles', async () => {
        const titles = await testFunctions.returnSiteTitles();
        expect(titles).toHaveLength(4);
        expect(titles[0]).toBe('PatientStudio - Integrated EMR, Practice Management and Billing Software');
        expect(titles[1]).toBe('Star Trek (Official Site)');
        expect(titles[2]).toBe('StarWars.com | The Official Star Wars Website');
        expect(titles[3]).toBe('Tech News, Reviews & Betas | Neowin');
    });
});
describe('Test findTagCounts', () => {
    it('should count the correct number of tag occurrences', () => {
        const tagCounts = testFunctions.findTagCounts(localData);
        expect(tagCounts).toHaveLength(62);
        const test1 = tagCounts.find(tagCount => tagCount.tag === 'occaecat');
        const test2 = tagCounts.find(tagCount => tagCount.tag === 'cupidatat');
        const test3 = tagCounts.find(tagCount => tagCount.tag === 'velit');
        expect(test1.count).toBe(6);
        expect(test2.count).toBe(5);
        expect(test3.count).toBe(1);
    });
});
describe('Test calculatePriceWithTaxes', () => {
    it('should return results in the correct format', () => {
        const results = testFunctions.calcualteImportCost(importedItems);
        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({
                subtotal: expect.any(Number),
                importCost: expect.any(Number),
                totalCost: expect.any(Number),
                name: expect.any(String)
            })
        ]));
    });
    it('should calculate the correct import cost for each item', () => {
        const results = testFunctions.calcualteImportCost(importedItems);
        const coffee = results.find(r => r.name === 'Coffee');
        const bigAvocados = results.find(r => r.name === 'Big Avocados');
        const biggerAvocados = results.find(r => r.name === 'Bigger Avocados');
        const tesla = results.find(r => r.name === 'Tesla Roadster');
        const schnitzel = results.find(r => r.name === 'Jägerschnitzel');
        expect(coffee === null || coffee === void 0 ? void 0 : coffee.importCost).toBe(3720);
        expect(coffee === null || coffee === void 0 ? void 0 : coffee.totalCost).toBe(34720);
        expect(bigAvocados === null || bigAvocados === void 0 ? void 0 : bigAvocados.importCost).toBe(0);
        expect(bigAvocados === null || bigAvocados === void 0 ? void 0 : bigAvocados.totalCost).toBe(500);
        expect(biggerAvocados === null || biggerAvocados === void 0 ? void 0 : biggerAvocados.importCost).toBe(0);
        expect(biggerAvocados === null || biggerAvocados === void 0 ? void 0 : biggerAvocados.totalCost).toBe(1000);
        expect(tesla === null || tesla === void 0 ? void 0 : tesla.importCost).toBe(2880000);
        expect(tesla === null || tesla === void 0 ? void 0 : tesla.totalCost).toBe(26880000);
        expect(schnitzel === null || schnitzel === void 0 ? void 0 : schnitzel.importCost).toBe(3000);
        expect(schnitzel === null || schnitzel === void 0 ? void 0 : schnitzel.totalCost).toBe(53000);
    });
});
