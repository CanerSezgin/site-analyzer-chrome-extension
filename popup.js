
chrome.tabs.query({ active: true }, function (tabs) {
  var tab = tabs[0];
  chrome.tabs.executeScript(
    tab.id,
    {
      code: `Array.prototype.slice.call(document.getElementsByTagName("meta"), 0).map((meta) => ({
        name: (meta.name || '').toLowerCase(),
        content: (meta.content || '').toLowerCase(),
      }));`,
    },
    getMetaTags
  );
});

function MetaManager(metaTags) {
  const get = (name) => ((metaTags.find((meta) => meta.name === name) || {}).content) || '';

  const getKeywords = () => get('keywords').split(', ').filter(x => x)

  return { metaTags, get, getKeywords };
}

function getMetaTags(data) {
    const meta = data[0];
    const metaManager = MetaManager(meta);
    renderDescription(metaManager.get('description'))
    renderKeywords(metaManager.getKeywords())
    renderRobots(metaManager.get('robots'))
    renderTags(meta)
}

function getSectionHTML(title, body){
    return `<div class="section">
        <div class="section-title">${title}</div>
        <div id="keywords" class="section-body">${body}</div>
    </div>`
}

function renderKeywords(keywords){
    const tag = '#place1'
    const title = `Keywords (${keywords.length})`
    const body = `<ul> ${keywords.map(k => `<li>${k}</li>`).join('')} </ul>`
    document.querySelector(tag).innerHTML = getSectionHTML(title, body);
}

function renderDescription(desc){
    const tag = '#place2'
    const title = `Description (${desc.length})`
    const body = `<div>${desc}</div>`
    document.querySelector(tag).innerHTML = getSectionHTML(title, body);
}

function renderRobots(robots){
    const tag = '#place3'
    const title = `Robots`
    const body = `<div>${robots}</div>`
    document.querySelector(tag).innerHTML = getSectionHTML(title, body);
}

function renderTags(tags){
    const tag = '#place4'
    const title = `Tags (${tags.length})`
    const body = `${tags.map(tag => `<div>${tag.name}</div>`).join('')}`
    document.querySelector(tag).innerHTML = getSectionHTML(title, body);
}