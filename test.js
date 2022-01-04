const {Tester} = require('./build/Tester');
const tester = new Tester({ host: 'cmbuckley.co.uk', siteWide: true, decodeEntities: false });

(async () => {
    const results = await tester.folder('../cmbuckley.github.io/_site/blog/2007/07/08/back-in-scholes/');
    //console.log(Object.keys(results).filter(r => r[0] == '/').reduce((o, k) => ({...o, [k]: results[k]}), {}));
    //console.log(results.orphanPages);
    console.log(results['/']);
})();
