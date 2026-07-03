import type { DbProduct } from './jsonDb'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'with', 'for', 'to', 'of', 'by', 'is', 'are', 'was', 'were', 'it', 'this', 'that', 'these', 'those', 'as', 'from', 'each', 'its',
])

const extractWords = (text: string | null): string[] => {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
}

const getProductCategory = (title: string, slug: string): string | null => {
  const types = ['ring', 'necklace', 'earring', 'pendant', 'anklet', 'bracelet']
  const normalized = `${title} ${slug}`.toLowerCase()
  for (const type of types) {
    if (normalized.includes(type)) {
      return type
    }
  }
  return null
}

export const getRelatedProducts = (source: DbProduct, allProducts: DbProduct[], limit = 4): DbProduct[] => {
  const sourceCategory = getProductCategory(source.title, source.slug)
  const sourceTitleWords = new Set(extractWords(source.title))
  const sourceDescWords = new Set(extractWords(source.description))

  const scored = allProducts
    .filter(p => p.id !== source.id && p.status !== 'archived') // Exclude source and archived
    .map((p) => {
      let score = 0

      // 1. Category/Type Match
      const category = getProductCategory(p.title, p.slug)
      if (sourceCategory && category && sourceCategory === category) {
        score += 8.0 // High bonus for matching category
      }

      // 2. Title Word Overlaps
      const titleWords = extractWords(p.title)
      for (const word of titleWords) {
        if (sourceTitleWords.has(word)) {
          score += 3.0
        }
      }

      // 3. Description Word Overlaps
      const descWords = extractWords(p.description)
      for (const word of descWords) {
        if (sourceDescWords.has(word)) {
          score += 1.0
        }
      }

      // 4. Price Proximity
      const priceDiff = Math.abs(source.price_cents - p.price_cents)
      // Normalize price score between 0 and 2.0
      score += 2.0 / (1.0 + priceDiff / 15000)

      // 5. Availability Bonus (Active items are prioritized over sold items)
      if (p.status === 'active' && p.stock > 0) {
        score += 4.0
      }

      return { product: p, score }
    })

  // Sort by score descending and return top items
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product)
}
