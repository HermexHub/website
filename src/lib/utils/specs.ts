import { Product } from '@/lib/api/types'

export interface ProductSpec {
  key: string
  label: string
  value: string
}

export const SPEC_LABELS: Record<string, { ua: string; en: string }> = {
  screen: { ua: 'Дисплей / Екран', en: 'Display / Screen' },
  cpu: { ua: 'Процесор', en: 'Processor / CPU' },
  ram: { ua: 'Оперативна памʼять', en: 'RAM' },
  storage: { ua: 'Вбудована памʼять (SSD)', en: 'Storage (SSD)' },
  gpu: { ua: 'Відеокарта', en: 'Graphics / GPU' },
  camera: { ua: 'Камера', en: 'Camera' },
  battery: { ua: 'Акумулятор', en: 'Battery' },
  batteryLife: { ua: 'Автономність', en: 'Battery Life' },
  charging: { ua: 'Зарядка', en: 'Charging' },
  material: { ua: 'Матеріал корпусу', en: 'Chassis Material' },
  protection: { ua: 'Клас захисту', en: 'Protection Rating' },
  waterproof: { ua: 'Водостійкість', en: 'Waterproof' },
  ports: { ua: 'Розʼєми та порти', en: 'Ports & Connectivity' },
  bluetooth: { ua: 'Bluetooth / Звʼязок', en: 'Bluetooth / Wireless' },
  anc: { ua: 'Шумозаглушення', en: 'Noise Cancelling' },
  layout: { ua: 'Розкладка', en: 'Keyboard Layout' },
  switch: { ua: 'Перемикачі (Світчі)', en: 'Switches' },
  connectivity: { ua: 'Підключення', en: 'Connectivity' },
  sensor: { ua: 'Оптичний сенсор', en: 'Sensor' },
  capacity: { ua: 'Ємність батареї', en: 'Capacity' },
  maxPower: { ua: 'Максимальна потужність', en: 'Max Power Output' },
  weight: { ua: 'Вага', en: 'Weight' },
  os: { ua: 'Операційна система', en: 'Operating System' }
}

/**
 * Returns localized product description from i18n JSON object or fallback string.
 * Guaranteed never to return '[object Object]'.
 */
export function getProductDescription(product: Product, locale: 'ua' | 'en' = 'ua'): string {
  const isUa = locale === 'ua'

  // 1. Try descriptionJson if available
  if (product.descriptionJson) {
    try {
      const parsed = JSON.parse(product.descriptionJson)
      if (parsed && typeof parsed === 'object') {
        const val = parsed[locale] || parsed.ua || parsed.en
        if (val && typeof val === 'string' && val.trim() && !val.includes('[object Object]')) {
          return val.trim()
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // 2. Try description as object
  if (typeof product.description === 'object' && product.description !== null) {
    const desc = product.description as Record<string, string>
    const val = desc[locale] || desc.ua || desc.en
    if (val && typeof val === 'string' && val.trim() && !val.includes('[object Object]')) {
      return val.trim()
    }
  }

  // 3. Try description as string (avoid '[object Object]')
  if (typeof product.description === 'string') {
    const trimmed = product.description.trim()
    if (trimmed && !trimmed.includes('[object Object]')) {
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmed)
          const val = parsed[locale] || parsed.ua || parsed.en
          if (val && typeof val === 'string' && val.trim()) {
            return val.trim()
          }
        } catch {}
      }
      return trimmed
    }
  }

  // 4. Dynamic fallback: construct an authentic, senior description from specs
  const specs = getProductSpecs(product, locale)
  const screenSpec = specs.find((s) => s.key === 'screen')?.value
  const cpuSpec = specs.find((s) => s.key === 'cpu')?.value
  const ramSpec = specs.find((s) => s.key === 'ram')?.value
  const storageSpec = specs.find((s) => s.key === 'storage')?.value

  if (isUa) {
    const parts = [
      `${product.name} — офіційний флагманський пристрій з гарантією 24 місяці.`,
      screenSpec ? `Оснащений якісним дисплеєм (${screenSpec}).` : '',
      cpuSpec ? `Високу швидкодію забезпечує процесор ${cpuSpec}.` : '',
      ramSpec || storageSpec
        ? `Конфігурація пам'яті: ${[ramSpec, storageSpec].filter(Boolean).join(' / ')}.`
        : ''
    ].filter(Boolean)
    return parts.join(' ')
  } else {
    const parts = [
      `${product.name} is an official flagship tech device backed by a 24-month warranty.`,
      screenSpec ? `Features a brilliant display (${screenSpec}).` : '',
      cpuSpec ? `Powered by ${cpuSpec} for ultimate responsiveness.` : '',
      ramSpec || storageSpec
        ? `Memory setup: ${[ramSpec, storageSpec].filter(Boolean).join(' / ')}.`
        : ''
    ].filter(Boolean)
    return parts.join(' ')
  }
}

/**
 * Extract canonical brand name from product
 */
export function extractProductBrand(product: Product): string {
  if (product.brand && product.brand.trim()) {
    return product.brand.trim()
  }
  const firstWord = product.name.trim().split(' ')[0]
  return firstWord || 'Other'
}

/**
 * Extract processor / CPU family
 */
export function extractProductCpu(product: Product): string | null {
  const specs = getProductSpecs(product, 'en')
  const cpuSpec = specs.find((s) => s.key === 'cpu')?.value || ''
  const name = product.name.toLowerCase()
  const combined = (cpuSpec + ' ' + name).toLowerCase()

  if (combined.includes('m3 max')) return 'Apple M3 Max'
  if (combined.includes('m3 pro')) return 'Apple M3 Pro'
  if (combined.includes('m3')) return 'Apple M3'
  if (combined.includes('m2')) return 'Apple M2'
  if (combined.includes('a17 pro')) return 'Apple A17 Pro'
  if (combined.includes('a16 bionic') || combined.includes('a16')) return 'Apple A16 Bionic'
  if (combined.includes('snapdragon 8 gen 3') || combined.includes('8 gen 3')) return 'Snapdragon 8 Gen 3'
  if (combined.includes('snapdragon 8 gen 2') || combined.includes('8 gen 2')) return 'Snapdragon 8 Gen 2'
  if (combined.includes('tensor g3')) return 'Google Tensor G3'
  if (combined.includes('i9-14900') || combined.includes('core i9')) return 'Intel Core i9'
  if (combined.includes('i7-14700') || combined.includes('core i7')) return 'Intel Core i7'
  if (combined.includes('ryzen 9')) return 'AMD Ryzen 9'
  if (combined.includes('ryzen 7')) return 'AMD Ryzen 7'
  if (combined.includes('exynos 2400')) return 'Samsung Exynos 2400'

  if (cpuSpec) {
    return cpuSpec.split('(')[0].trim()
  }
  return null
}

/**
 * Extract RAM capacity (8 GB, 12 GB, 16 GB, 24 GB, 32 GB, etc.)
 */
export function extractProductRam(product: Product): string | null {
  const specs = getProductSpecs(product, 'en')
  const ramSpec = specs.find((s) => s.key === 'ram')?.value || ''
  const memSpec = specs.find((s) => s.key === 'memory')?.value || ''
  const combined = `${ramSpec} ${memSpec} ${product.name}`

  const match =
    combined.match(/(\d+)\s*(?:GB|ГБ)\s*(?:RAM|LPDDR|DDR|пам)/i) ||
    combined.match(/(\d+)\s*(?:GB|ГБ)/i)
  if (match) {
    const size = parseInt(match[1], 10)
    if ([4, 6, 8, 12, 16, 18, 24, 32, 36, 48, 64, 96, 128].includes(size)) {
      return `${size} GB`
    }
  }
  return null
}

/**
 * Extract storage capacity (128 GB, 256 GB, 512 GB, 1 TB, 2 TB)
 */
export function extractProductStorage(product: Product): string | null {
  const specs = getProductSpecs(product, 'en')
  const storageSpec = specs.find((s) => s.key === 'storage')?.value || ''
  const memSpec = specs.find((s) => s.key === 'memory')?.value || ''
  const combined = `${storageSpec} ${memSpec} ${product.name} ${product.sku}`

  if (combined.match(/2\s*TB|2\s*ТБ/i)) return '2 TB'
  if (combined.match(/1\s*TB|1\s*ТБ|1024\s*GB/i)) return '1 TB'
  if (combined.match(/512\s*GB|512\s*ГБ/i)) return '512 GB'
  if (combined.match(/256\s*GB|256\s*ГБ/i)) return '256 GB'
  if (combined.match(/128\s*GB|128\s*ГБ/i)) return '128 GB'
  if (combined.match(/64\s*GB|64\s*ГБ/i)) return '64 GB'

  return null
}

/**
 * Returns structured specifications for any product from DB specs JSON or fallback rules.
 */
export function getProductSpecs(product: Product, locale: 'ua' | 'en' = 'ua'): ProductSpec[] {
  const isUa = locale === 'ua'

  // 1. Primary: Use structured specs from database if available
  let dbSpecs: Record<string, string> | null = null
  if (product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0) {
    dbSpecs = product.specs
  } else if (product.specsJson && product.specsJson.trim().length > 2) {
    try {
      dbSpecs = JSON.parse(product.specsJson)
    } catch {
      // ignore
    }
  }

  if (dbSpecs && Object.keys(dbSpecs).length > 0) {
    return Object.entries(dbSpecs).map(([key, value]) => {
      const labelObj = SPEC_LABELS[key]
      const label = labelObj ? (isUa ? labelObj.ua : labelObj.en) : key.charAt(0).toUpperCase() + key.slice(1)
      return {
        key,
        label,
        value: String(value)
      }
    })
  }

  const id = product.id.toLowerCase()
  const name = product.name.toLowerCase()
  const cat = (product.category || '').toLowerCase()

  // Fallback heuristic specs if DB has no specs:
  if (cat.includes('smart') || id.startsWith('smart-')) {
    if (name.includes('iphone 15 pro max')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.7" OLED Super Retina XDR ProMotion 120Hz' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Apple A17 Pro (3 нм, 6 ядер CPU, 6 ядер GPU)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '8 GB RAM / 256 GB NVMe' },
        { key: 'camera', label: isUa ? 'Основна камера' : 'Main Camera', value: '48 Мп + 12 Мп (5x оптичний зум) + 12 Мп Ultra-Wide' },
        { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '4422 мА·год, бездротова MagSafe 15W' },
        { key: 'material', label: isUa ? 'Матеріал корпусу' : 'Chassis', value: isUa ? 'Титан 5 класу, керамічне скло Ceramic Shield' : 'Grade 5 Titanium, Ceramic Shield' }
      ]
    }
    if (name.includes('iphone 15')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.1" OLED Super Retina XDR Dynamic Island 60Hz' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Apple A16 Bionic (4 нм)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '6 GB RAM / 128 GB NVMe' },
        { key: 'camera', label: isUa ? 'Основна камера' : 'Main Camera', value: '48 Мп + 12 Мп Ultra-Wide' },
        { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '3349 мА·год, USB-C 2.0, MagSafe 15W' },
        { key: 'material', label: isUa ? 'Матеріал корпусу' : 'Chassis', value: isUa ? 'Аерокосмічний алюміній, скло' : 'Aerospace Aluminum, Glass' }
      ]
    }
    if (name.includes('s24 ultra')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.8" Dynamic AMOLED 2X QHD+ 120Hz (2600 ніт)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '12 GB LPDDR5X / 512 GB UFS 4.0' },
        { key: 'camera', label: isUa ? 'Основна камера' : 'Main Camera', value: '200 Мп OIS + 50 Мп (5x) + 10 Мп (3x) + 12 Мп' },
        { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '5000 мА·год, швидка зарядка 45W, перо S Pen' },
        { key: 'material', label: isUa ? 'Матеріал корпусу' : 'Chassis', value: isUa ? 'Титанова рамка, Gorilla Armor' : 'Titanium frame, Gorilla Armor' }
      ]
    }
    if (name.includes('s24+')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.7" Dynamic AMOLED 2X QHD+ 120Hz' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Samsung Exynos 2400 / Snapdragon 8 Gen 3' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '12 GB LPDDR5X / 256 GB UFS 4.0' },
        { key: 'camera', label: isUa ? 'Основна камера' : 'Main Camera', value: '50 Мп OIS + 10 Мп (3x) + 12 Мп' },
        { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '4900 мА·год, 45W дротова, бездротова 15W' },
        { key: 'material', label: isUa ? 'Матеріал корпусу' : 'Chassis', value: isUa ? 'Armor Aluminum 2, Gorilla Glass Victus 2' : 'Armor Aluminum 2, Victus 2' }
      ]
    }
    if (name.includes('pixel 8 pro')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.7" LTPO Super Actua OLED 120Hz (2400 ніт)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Google Tensor G3 з чипом безпеки Titan M2' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '12 GB LPDDR5X / 256 GB UFS 3.1' },
        { key: 'camera', label: isUa ? 'Основна камера' : 'Main Camera', value: '50 Мп OIS + 48 Мп (5x) + 48 Мп Ultra-Wide' },
        { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '5050 мА·год, 30W швидка зарядка' },
        { key: 'material', label: isUa ? 'Матеріал корпусу' : 'Chassis', value: isUa ? 'Полірований алюміній, матове скло Victus 2' : 'Polished aluminum, Victus 2' }
      ]
    }
    if (name.includes('xiaomi 14 ultra')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.73" AMOLED WQHD+ 120Hz LTPO (3000 ніт)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Snapdragon 8 Gen 3 (4 нм)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '16 GB LPDDR5X / 512 GB UFS 4.0' },
        { key: 'camera', label: isUa ? 'Основна камера' : 'Main Camera', value: 'Leica 4x50 Мп: 1" Sony LYT-900 з регульованою діафрагмою f/1.63-f/4.0' },
        { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '5000 мА·год, 90W HyperCharge, 80W Wireless' },
        { key: 'material', label: isUa ? 'Матеріал корпусу' : 'Chassis', value: isUa ? 'Високоміцний алюміній, веганська наношкіра' : 'High-strength aluminum, nano-leather' }
      ]
    }
    // Generic smartphone fallback
    return [
      { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '6.5"-6.7" AMOLED / OLED 120Hz' },
      { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Flagship Octa-Core AI Processor' },
      { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '12 GB / 256 GB' },
      { key: 'camera', label: isUa ? 'Камера' : 'Camera', value: '50 Мп Triple Camera System OIS' },
      { key: 'battery', label: isUa ? 'Акумулятор' : 'Battery', value: '4500-5000 мА·год Fast Charging' },
      { key: 'material', label: isUa ? 'Захист' : 'Protection', value: 'IP68 водо- та пилонепроникність' }
    ]
  }

  // 2. LAPTOPS
  if (cat.includes('laptop') || id.startsWith('lap-')) {
    if (name.includes('macbook pro 16')) {
      return [
        { key: 'screen', label: isUa ? 'Екран' : 'Display', value: '16.2" Liquid Retina XDR 120Hz (3456x2234, 1600 ніт)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Apple M3 Max (16 ядер CPU, 40 ядер GPU, 16-core Neural Engine)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '36 GB Unified Memory / 1 TB SSD (до 7.4 ГБ/с)' },
        { key: 'ports', label: isUa ? 'Порти' : 'Ports', value: '3x Thunderbolt 4, HDMI 2.1, SDXC кардрідер, MagSafe 3' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery', value: '100 Вт·год, до 22 годин відтворення відео' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '2.16 кг' }
      ]
    }
    if (name.includes('macbook air 15')) {
      return [
        { key: 'screen', label: isUa ? 'Екран' : 'Display', value: '15.3" Liquid Retina IPS (2880x1864, 500 ніт)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Apple M3 (8 ядер CPU, 10 ядер GPU)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '16 GB Unified Memory / 512 GB SSD' },
        { key: 'ports', label: isUa ? 'Порти' : 'Ports', value: '2x Thunderbolt / USB 4, MagSafe 3, 3.5 мм jack' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery', value: '66.5 Вт·год, до 18 годин автономної роботи (пасивне охолодження)' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '1.51 кг (товщина 11.5 мм)' }
      ]
    }
    if (name.includes('zephyrus g16') || name.includes('asus-g16')) {
      return [
        { key: 'screen', label: isUa ? 'Екран' : 'Display', value: '16.0" ROG Nebula OLED 240Hz 0.2ms (2.5K 2560x1600, G-Sync)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Intel Core Ultra 9 185H (16 ядер, 22 потоки, до 5.1 ГГц)' },
        { key: 'gpu', label: isUa ? 'Відеокарта' : 'Graphics', value: 'NVIDIA GeForce RTX 4070 Laptop GPU 8GB GDDR6 (105W TGP)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '32 GB LPDDR5X 7467 MHz / 1 TB NVMe PCIe 4.0 SSD' },
        { key: 'battery', label: isUa ? 'Батарея' : 'Battery', value: '90 Вт·год, швидка зарядка 240W' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '1.85 кг' }
      ]
    }
    if (name.includes('legion pro 7')) {
      return [
        { key: 'screen', label: isUa ? 'Екран' : 'Display', value: '16.0" WQXGA IPS 240Hz (2560x1600, 500 ніт, HDR 400)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Intel Core i9-13900HX (24 ядра, 32 потоки, до 5.4 ГГц)' },
        { key: 'gpu', label: isUa ? 'Відеокарта' : 'Graphics', value: 'NVIDIA GeForce RTX 4080 12GB (175W TGP)' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '32 GB DDR5 5600 MHz / 1 TB PCIe 4.0 SSD' },
        { key: 'battery', label: isUa ? 'Охолодження' : 'Cooling', value: 'Legion Coldfront 5.0 з випарною камерою, 99.9 Вт·год' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '2.80 кг' }
      ]
    }
    if (name.includes('xps 16')) {
      return [
        { key: 'screen', label: isUa ? 'Екран' : 'Display', value: '16.3" 4K+ OLED Touch 90Hz (3840x2400, 400 ніт)' },
        { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Intel Core Ultra 7 155H з нейромодулем Intel AI Boost' },
        { key: 'gpu', label: isUa ? 'Відеокарта' : 'Graphics', value: 'NVIDIA GeForce RTX 4060 8GB' },
        { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '32 GB LPDDR5X / 1 TB SSD' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery', value: '99.5 Вт·год батарея, блок живлення 130W Type-C' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '2.20 кг' }
      ]
    }
    // Generic laptop fallback
    return [
      { key: 'screen', label: isUa ? 'Екран' : 'Display', value: '14"-16" IPS / OLED 120-240Hz' },
      { key: 'cpu', label: isUa ? 'Процесор' : 'Processor', value: 'Intel Core Ultra / AMD Ryzen 8000 / Apple Silicon' },
      { key: 'memory', label: isUa ? 'Памʼять' : 'Memory', value: '16-32 GB RAM / 512GB-1TB SSD' },
      { key: 'battery', label: isUa ? 'Батарея' : 'Battery', value: '70-99 Вт·год' },
      { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '1.4 - 2.2 кг' }
    ]
  }

  // 3. AUDIO
  if (cat.includes('audio') || id.startsWith('aud-')) {
    if (name.includes('wh-1000xm5')) {
      return [
        { key: 'type', label: isUa ? 'Конструкція' : 'Form Factor', value: isUa ? 'Повнорозмірні бездротові навушники' : 'Over-Ear Wireless ANC' },
        { key: 'anc', label: isUa ? 'Шумозаглушення' : 'Noise Canceling', value: 'Активне ANC (процесори V1 + HD QN1, 8 мікрофонів)' },
        { key: 'codecs', label: isUa ? 'Кодеки та звук' : 'Audio Codecs', value: 'Hi-Res Audio Wireless, LDAC, AAC, SBC, DSEE Extreme' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: 'До 30 годин з ANC (до 40 годин без ANC)' },
        { key: 'features', label: isUa ? 'Особливості' : 'Features', value: 'Speak-to-Chat, Multipoint на 2 пристрої, вага 250 г' }
      ]
    }
    if (name.includes('airpods max')) {
      return [
        { key: 'type', label: isUa ? 'Конструкція' : 'Form Factor', value: isUa ? 'Повнорозмірні преміум-навушники з алюмінієвими чашками' : 'Over-Ear Premium Aluminum' },
        { key: 'anc', label: isUa ? 'Шумозаглушення' : 'Noise Canceling', value: 'Активне шумозаглушення Pro та режим проникності' },
        { key: 'sound', label: isUa ? 'Звук' : 'Audio', value: 'Просторове аудіо з динамічним відстеженням рухів голови' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: 'До 20 годин у режимі відтворення' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '384.8 г' }
      ]
    }
    if (name.includes('quietcomfort') || name.includes('bose')) {
      return [
        { key: 'type', label: isUa ? 'Конструкція' : 'Form Factor', value: 'Over-Ear Wireless Headphones' },
        { key: 'anc', label: isUa ? 'Шумозаглушення' : 'Noise Canceling', value: 'Bose Immersive Audio & Quiet/Aware Modes' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: 'До 24 годин роботи (до 18 год у режимі Immersive)' },
        { key: 'codecs', label: isUa ? 'Кодеки' : 'Codecs', value: 'Snapdragon Sound, aptX Adaptive, AAC' }
      ]
    }
    if (name.includes('airpods pro 2')) {
      return [
        { key: 'type', label: isUa ? 'Тип' : 'Form Factor', value: 'TWS In-Ear Wireless Earbuds' },
        { key: 'chip', label: isUa ? 'Процесор' : 'Chip', value: 'Apple H2 в навушниках, Apple U1 в кейсі' },
        { key: 'anc', label: isUa ? 'Шумозаглушення' : 'Noise Canceling', value: 'Вдвічі потужніше активне ANC та Адаптивне аудіо' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: 'До 6 годин (до 30 годин з MagSafe USB-C кейсом)' },
        { key: 'protection', label: isUa ? 'Захист' : 'Protection', value: 'IP54 пило- та водонепроникність' }
      ]
    }
    return [
      { key: 'type', label: isUa ? 'Тип' : 'Form Factor', value: 'Wireless Hi-Fi Audio' },
      { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: '20-60 годин роботи' },
      { key: 'connectivity', label: isUa ? 'Підключення' : 'Connectivity', value: 'Bluetooth 5.3 Multipoint, USB-C' }
    ]
  }

  // 4. WEARABLES
  if (cat.includes('wear') || id.startsWith('wear-')) {
    if (name.includes('ultra 2')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '1.92" Always-On Retina OLED 3000 ніт (сапфірове скло)' },
        { key: 'case', label: isUa ? 'Корпус' : 'Case', value: '49 мм авіаційний титан, підняті краї для захисту скла' },
        { key: 'cpu', label: isUa ? 'Чип' : 'Processor', value: 'Apple S9 SiP з підтримкою жесту Double Tap' },
        { key: 'gps', label: isUa ? 'Навігація' : 'GPS', value: 'Прецизійний двочастотний GPS (L1 та L5)' },
        { key: 'water', label: isUa ? 'Водозахист' : 'Water Resistance', value: 'WR100, занурення до 40 м (сертифікат дайвінгу EN13319)' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: 'До 36 годин (до 72 годин у режимі енергозбереження)' }
      ]
    }
    if (name.includes('fenix 7')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '1.4" трансфлективний MIP з сонячною лінзою Power Sapphire' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery Life', value: 'До 28 днів (до 37 днів із сонячною батареєю Solar)' },
        { key: 'torch', label: isUa ? 'Ліхтарик' : 'Flashlight', value: 'Вбудований регульований світлодіодний ліхтарик' },
        { key: 'sensors', label: isUa ? 'Датчики' : 'Sensors', value: 'Пульсометр Elevate Gen 5, пульсоксиметр, барометр, компас' },
        { key: 'water', label: isUa ? 'Водозахист' : 'Water Resistance', value: '10 ATM (занурення до 100 метрів)' }
      ]
    }
    if (name.includes('galaxy watch 6')) {
      return [
        { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: '1.5" Super AMOLED 480x480 Always-On (сапфірове скло)' },
        { key: 'bezel', label: isUa ? 'Керування' : 'Bezel', value: 'Фізичний обертовий безель з нержавіючої сталі' },
        { key: 'sensors', label: isUa ? 'Здоровʼя' : 'Sensors', value: 'ЕКГ, артеріальний тиск, склад тіла BIA, аналіз сну' },
        { key: 'os', label: isUa ? 'ОС' : 'OS', value: 'Wear OS Powered by Samsung (One UI 5 Watch)' },
        { key: 'battery', label: isUa ? 'Батарея' : 'Battery', value: '425 мА·год, бездротова швидка зарядка WPC' }
      ]
    }
    return [
      { key: 'screen', label: isUa ? 'Дисплей' : 'Display', value: 'AMOLED / Sapphire Touchscreen' },
      { key: 'sensors', label: isUa ? 'Датчики' : 'Sensors', value: 'Пульс, SpO2, крокомір, GPS трекер' },
      { key: 'battery', label: isUa ? 'Батарея' : 'Battery', value: 'Від 36 годин до 14 днів' },
      { key: 'water', label: isUa ? 'Водозахист' : 'Water Resistance', value: '5 ATM / 50 метрів' }
    ]
  }

  // 5. KEYBOARDS
  if (cat.includes('keyboard') || id.startsWith('kb-')) {
    if (name.includes('keychron q1')) {
      return [
        { key: 'format', label: isUa ? 'Форм-фактор' : 'Layout', value: '75% Compact (82 клавіші + поворотний енкодер Knob)' },
        { key: 'switches', label: isUa ? 'Перемикачі' : 'Switches', value: 'Keychron K Pro Red (змащені на заводі, лінійні)' },
        { key: 'hotswap', label: isUa ? 'Hot-Swap' : 'Hot-Swap', value: 'Підтримка 3-pin та 5-pin перемикачів без пайки' },
        { key: 'build', label: isUa ? 'Конструкція' : 'Construction', value: 'Суцільноалюмінієвий корпус CNC, Double-Gasket Mount' },
        { key: 'connection', label: isUa ? 'Підключення' : 'Connectivity', value: 'Bluetooth 5.1 (до 3 пристроїв) та Type-C 1000Hz' },
        { key: 'firmware', label: isUa ? 'Прошивка' : 'Firmware', value: 'Повна підтримка QMK/VIA для налаштування макросів' }
      ]
    }
    if (name.includes('mx mechanical')) {
      return [
        { key: 'format', label: isUa ? 'Форм-фактор' : 'Layout', value: 'Повнорозмірна бездротова низькопрофільна' },
        { key: 'switches', label: isUa ? 'Перемикачі' : 'Switches', value: 'Low Profile Mechanical Tactile Quiet' },
        { key: 'battery', label: isUa ? 'Батарея' : 'Battery', value: 'До 15 днів з підсвічуванням або до 10 місяців без нього' },
        { key: 'connection', label: isUa ? 'Підключення' : 'Connectivity', value: 'Bluetooth Low Energy або Logi Bolt USB' }
      ]
    }
    if (name.includes('mx master 3s')) {
      return [
        { key: 'sensor', label: isUa ? 'Сенсор' : 'Sensor', value: 'Darkfield 8000 DPI (працює навіть на склі)' },
        { key: 'wheel', label: isUa ? 'Коліщатко' : 'Scroll Wheel', value: 'Електромагнітне MagSpeed (прокрутка до 1000 рядків/сек)' },
        { key: 'clicks', label: isUa ? 'Кліки' : 'Clicks', value: 'Quiet Clicks (на 90% тихіше попереднього покоління)' },
        { key: 'battery', label: isUa ? 'Автономність' : 'Battery', value: 'До 70 днів на повному заряді, швидка зарядка USB-C' }
      ]
    }
    return [
      { key: 'type', label: isUa ? 'Тип' : 'Type', value: 'Механічна периферія / Миша' },
      { key: 'connection', label: isUa ? 'Підключення' : 'Connectivity', value: 'Wireless 2.4G / Bluetooth / USB-C' },
      { key: 'lighting', label: isUa ? 'Підсвітка' : 'Lighting', value: 'RGB налаштовувана' }
    ]
  }

  // 6. POWER BANKS
  if (cat.includes('power') || id.startsWith('pb-')) {
    if (name.includes('ecoflow river 2')) {
      return [
        { key: 'capacity', label: isUa ? 'Ємність' : 'Capacity', value: '512 Вт·год (LiFePO4 літій-залізо-фосфатна)' },
        { key: 'output', label: isUa ? 'Потужність AC' : 'AC Output', value: '500W номінальна (пікова X-Boost до 1000W), чиста синусоїда' },
        { key: 'charging', label: isUa ? 'Швидкість заряджання' : 'Charging Time', value: 'Від 0 до 100% за 60 хвилин від розетки 220V' },
        { key: 'cycles', label: isUa ? 'Ресурс батареї' : 'Lifecycle', value: '3000+ циклів до збереження 80% ємності (10 років роботи)' },
        { key: 'ports', label: isUa ? 'Порти' : 'Ports', value: '2x Розетки 220V, 1x USB-C 100W, 3x USB-A 12W, 1x 12V авто' },
        { key: 'weight', label: isUa ? 'Вага' : 'Weight', value: '6.0 кг' }
      ]
    }
    if (name.includes('anker prime 20')) {
      return [
        { key: 'capacity', label: isUa ? 'Ємність' : 'Capacity', value: '20 000 мА·год (72 Вт·год, дозволений в літак)' },
        { key: 'output', label: isUa ? 'Сумарна потужність' : 'Total Output', value: '200W Max (одночасно 100W + 100W по двох USB-C)' },
        { key: 'display', label: isUa ? 'Дисплей' : 'Display', value: 'Інтелектуальний кольоровий екран (вихідна потужність, час до розряду)' },
        { key: 'recharge', label: isUa ? 'Вхідне заряджання' : 'Input Recharge', value: 'До 100W (повний заряд павербанка за 1 год 15 хв)' }
      ]
    }
    if (name.includes('baseus blade')) {
      return [
        { key: 'capacity', label: isUa ? 'Ємність' : 'Capacity', value: '20 000 мА·год' },
        { key: 'output', label: isUa ? 'Потужність' : 'Output', value: '100W Power Delivery (заряджає ноутбуки)' },
        { key: 'design', label: isUa ? 'Корпус' : 'Profile', value: 'Ультратонкий корпус 18 мм, цифровий індикатор' }
      ]
    }
    return [
      { key: 'capacity', label: isUa ? 'Ємність' : 'Capacity', value: '10 000 - 26 800 мА·год' },
      { key: 'output', label: isUa ? 'Потужність' : 'Max Output', value: '65W - 140W Fast Charge' },
      { key: 'ports', label: isUa ? 'Порти' : 'Ports', value: 'USB-C Power Delivery + USB-A Quick Charge' }
    ]
  }

  return [
    { key: 'brand', label: isUa ? 'Бренд' : 'Brand', value: 'Official Partner' },
    { key: 'warranty', label: isUa ? 'Гарантія' : 'Warranty', value: '24 місяці' }
  ]
}

/**
 * Quick 2-3 feature chips for product card display.
 */
export function getHighlightSpecs(product: Product): string[] {
  const specs = getProductSpecs(product, 'ua')
  return specs.slice(0, 2).map((s) => s.value.split('(')[0].trim())
}
