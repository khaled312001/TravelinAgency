import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
function createRemoteCollection(fetchEndpoint) {
  let _cache
  return async () => {
    if (_cache)
      return _cache
    const res = await fetch(fetchEndpoint).then(r => r.json())
    _cache = res
    return res
  }
}

export const collections = {
  'carbon': () => require('@iconify-json/carbon/icons.json'),
  'ic': () => require('@iconify-json/ic/icons.json'),
  'logos': () => require('@iconify-json/logos/icons.json'),
  'material-symbols': () => require('@iconify-json/material-symbols/icons.json'),
  'material-symbols-light': () => require('@iconify-json/material-symbols-light/icons.json'),
  'mdi': () => require('@iconify-json/mdi/icons.json'),
  'ri': () => require('@iconify-json/ri/icons.json'),
  'tabler': () => require('@iconify-json/tabler/icons.json'),
}