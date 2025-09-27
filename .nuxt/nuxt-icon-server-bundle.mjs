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
  'carbon': () => import('@iconify-json/carbon/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'ic': () => import('@iconify-json/ic/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'logos': () => import('@iconify-json/logos/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'material-symbols': () => import('@iconify-json/material-symbols/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'material-symbols-light': () => import('@iconify-json/material-symbols-light/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'mdi': () => import('@iconify-json/mdi/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'ri': () => import('@iconify-json/ri/icons.json', { with: { type: 'json' } }).then(m => m.default),
  'tabler': () => import('@iconify-json/tabler/icons.json', { with: { type: 'json' } }).then(m => m.default),
}